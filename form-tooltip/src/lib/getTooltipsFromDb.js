import { PrismaClient } from "@prisma/client";
import Fuse from "fuse.js";

const prisma = new PrismaClient();

const fuseOptions = {
    includeScore: true,
    threshold: 0.3,
    keys: ["key", "synonyms"],
};

export async function getTooltipsFromDb (keys)
{
    const allMappings = await prisma.questionMapping.findMany();

    const fuse = new Fuse(allMappings, fuseOptions);

    return keys.reduce((result, key) =>
    {
        const searchResults = fuse.search(key);

        console.log(`\nSearch results for key: "${key}"`);
        searchResults.forEach((r, idx) =>
        {
            console.log(`  #${idx + 1} => key: "${r.item.key}", score: ${r.score}, question: "${r.item.question}"`);
        });

        const [best] = searchResults;

        result[key] = best
            ? best.item.question
            : `No question found for "${key}". Please fill out this field.`;

        return result;
    }, {});
}
