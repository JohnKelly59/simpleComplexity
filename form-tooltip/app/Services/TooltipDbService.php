<?php

namespace App\Services;

use App\Models\QuestionMapping;

class TooltipDbService
{
    /**
     * Return a mapping of "fieldKey" => "question"
     * by performing fuzzy search on both the 'key' and 'synonyms' columns.
     */
    public function getTooltips(array $keys): array
    {
        // Fetch all question mappings from DB (key, question, synonyms)
        $allMappings = QuestionMapping::all();

        $result = [];

        foreach ($keys as $fieldKey) {
            // We'll track the best match among all records
            $bestItem = null;
            $bestScore = PHP_INT_MAX; // lower is better in Levenshtein

            foreach ($allMappings as $item) {
                // 1) Compare with item->key
                $scoreKey = $this->levenshteinDistance($fieldKey, $item->key);

                // 2) Compare with synonyms (if any)
                $synScores = [];
                if (is_array($item->synonyms)) {
                    foreach ($item->synonyms as $syn) {
                        $synScores[] = $this->levenshteinDistance($fieldKey, $syn);
                    }
                }
                $minSynScore = $synScores ? min($synScores) : PHP_INT_MAX;

                // The best (lowest) score for this item
                $itemScore = min($scoreKey, $minSynScore);

                // Track if better than current best
                if ($itemScore < $bestScore) {
                    $bestScore = $itemScore;
                    $bestItem = $item;
                }
            }

            // Decide if best score is "good enough"
            // Adjust THRESHOLD to suit your tolerance (0=exact, 5=loose, etc.)
            $THRESHOLD = 6; 
            if ($bestItem && $bestScore <= $THRESHOLD) {
                $result[$fieldKey] = $bestItem->question;
            } else {
                $result[$fieldKey] = "No question found for \"{$fieldKey}\". Please fill out this field.";
            }
        }

        return $result;
    }

    /**
     * A helper to do a consistent, case-insensitive Levenshtein distance.
     */
    protected function levenshteinDistance(string $needle, string $haystack): int
    {
        // Convert to lowercase for case-insensitive comparisons
        return levenshtein(mb_strtolower($needle), mb_strtolower($haystack));
    }
}
