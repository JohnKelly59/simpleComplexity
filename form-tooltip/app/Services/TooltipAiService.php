<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class TooltipAiService
{
    public function getTooltips(array $keys): array
    {
        $prompt = $this->buildPrompt($keys);

        try {
            // Using Laravel's Http client for a ChatGPT-like endpoint
            $response = Http::withToken(config('services.openai.key'))
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-4',
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'You provide short, helpful JSON tooltips for form fields.',
                        ],
                        [
                            'role' => 'user',
                            'content' => $prompt,
                        ],
                    ],
                    'temperature' => 0.7,
                ]);

            if ($response->failed()) {
                // fallback
                \Log::warning("OpenAI request failed: " . $response->body());
                return $this->fallback($keys);
            }

            $jsonResponse = $response->json();
            // e.g. parse the "content" from 'choices[0].message.content'
            $gptText = data_get($jsonResponse, 'choices.0.message.content', '');

            // Attempt to parse JSON
            $parsed = json_decode($gptText, true);

            if (!is_array($parsed)) {
                \Log::warning("GPT returned unparseable text: {$gptText}");
                $parsed = [];
            }

            // Build final result
            $finalResult = [];
            foreach ($keys as $key) {
                $finalResult[$key] = $parsed[$key]
                    ?? "Please fill out \"{$key}\".";
            }
            return $finalResult;
        } catch (\Exception $e) {
            \Log::error("OpenAI request exception: " . $e->getMessage());
            return $this->fallback($keys);
        }
    }

    protected function buildPrompt(array $keys): string
    {
        $keysList = implode("\n", array_map(fn($k) => "- {$k}", $keys));

        return <<<PROMPT
You are a helpful assistant. I need short tooltip messages for the following form fields. 
Each field is identified by a label or "key". Provide a concise explanation or question.

Keys:
{$keysList}

Return the result in valid JSON, for example:
{
  "field1": "Tooltip for field1",
  "field2": "Tooltip for field2"
}
PROMPT;
    }

    protected function fallback(array $keys): array
    {
        $result = [];
        foreach ($keys as $key) {
            $result[$key] = "Please fill out \"{$key}\".";
        }
        return $result;
    }
}
