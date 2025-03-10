import { PrismaClient } from "@prisma/client";
import Fuse from "fuse.js";

const prisma = new PrismaClient();

// Configure Fuse.js:
// - threshold 0.3 => A higher threshold means more "loose" matching.
// - keys: ["key"] => Tells Fuse to search on the "key" field of your DB rows.
const fuseOptions = {
    includeScore: true,
    threshold: 0.3,
    keys: ["key"],
};

/**
 * Fetch "questionMapping" data from DB and then fuzzy-match
 * each requested "key" to the best question.
 */
export async function getTooltipsFromDb (keys)
{
    // 1) Fetch all records from "questionMapping" once.
    const allMappings = await prisma.questionMapping.findMany();

    // 2) Build a Fuse index using "allMappings".
    const fuse = new Fuse(allMappings, fuseOptions);

    // 3) For each user-supplied key, find the best match using Fuse.js.
    const result = {};
    for (const k of keys)
    {
        // Search for the single best match for this key
        const [best] = fuse.search(k, { limit: 1 });
        if (best)
        {
            // Found a fuzzy match => use its "question"
            result[k] = best.item.question;
        } else
        {
            // Fallback if no match found
            result[k] = `No question found for "${k}". Please fill out this field.`;
        }
    }

    return result;
}
