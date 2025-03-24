import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getTooltipsFromAi (keys)
{
    const prompt = `
You are a helpful assistant. I need short tooltip messages for the following form fields. 
Each field is identified by a label or "key". Provide a concise explanation or question.

Keys:
${keys.map((k) => `- ${k}`).join('\n')}

Return the result in valid JSON, for example:
{
  "field1": "Tooltip for field1",
  "field2": "Tooltip for field2"
}
`;

    try
    {
        const response = await openai.chat.completions.create({
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

        const gptText = response.choices?.[0]?.message?.content ?? '';
        let parsedTooltips;
        try
        {
            parsedTooltips = JSON.parse(gptText);
        } catch (parseError)
        {
            console.warn('GPT returned unparseable text, using fallback:', parseError);
            parsedTooltips = {};
        }

        const finalResult = keys.reduce((acc, key) =>
        {
            acc[key] = parsedTooltips[key]
                ? parsedTooltips[key]
                : `Please fill out "${key}".`;
            return acc;
        }, {});

        return finalResult;
    } catch (error)
    {
        console.error('OpenAI request failed:', error);
        return keys.reduce((acc, key) =>
        {
            acc[key] = `Please fill out "${key}".`;
            return acc;
        }, {});
    }
}
