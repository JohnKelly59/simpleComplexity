// /lib/getTooltipsFromAi.js
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getTooltipsFromAi (keys)
{
    // 1) Build a single prompt for GPT
    const prompt = `
You are a helpful assistant. I need short tooltip messages for the following form fields. 
Each field is identified by a label or "key". Provide a concise explanation or question. 

Keys:
${keys.map((k) => `- ${k}`).join("\n")}

Return the result in valid JSON, for example:
{
  "field1": "Tooltip for field1",
  "field2": "Tooltip for field2"
} 
`;

    // 2) Call OpenAI's Chat Completion endpoint
    const response = await openai.chat.completions.create({
        // Make sure you have access to "gpt-4" or use "gpt-3.5-turbo"
        model: 'gpt-4',
        messages: [
            {
                role: 'system',
                content: 'You provide short, helpful JSON tooltips for form fields.',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        temperature: 0.7,
    });

    // 3) Extract GPT's text response
    let gptText = response.choices?.[0]?.message?.content || "";

    // 4) Try to parse the text as JSON
    let generatedTooltips = {};
    try
    {
        generatedTooltips = JSON.parse(gptText);
    } catch (err)
    {
        console.warn("GPT returned unparseable text, using fallback:", err);
        // fallback approach
        keys.forEach((k) =>
        {
            generatedTooltips[k] = `Please fill out "${k}".`;
        });
    }

    // 5) Ensure every requested key has at least a fallback
    const finalResult = {};
    keys.forEach((k) =>
    {
        if (generatedTooltips[k])
        {
            finalResult[k] = generatedTooltips[k];
        } else
        {
            finalResult[k] = `Please fill out "${k}".`;
        }
    });

    return finalResult;
}
