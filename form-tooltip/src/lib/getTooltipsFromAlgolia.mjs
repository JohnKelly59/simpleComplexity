import { PrismaClient } from "@prisma/client";
import { algoliasearch } from "algoliasearch";

const prisma = new PrismaClient();
const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
const indexName = "question_mappings";

export async function syncMappingsToAlgolia ()
{
    const mappings = await prisma.questionMapping.findMany();
    const records = mappings.map(item => ({
        objectID: item.key,
        key: item.key,
        question: item.question
    }));
    const response = await client.saveObjects(records, { indexName });
    // Optionally wait for the indexing task to complete.
    if (response.taskID)
    {
        await client.waitTask({ indexName, taskID: response.taskID });
    }
    console.log("Synced to Algolia, objectIDs:", response.objectIDs);
}

export async function getTooltipsFromAlgolia (keys)
{
    const resultsArray = await Promise.all(
        keys.map(async key =>
        {
            try
            {
                // The new search API accepts an array of queries.
                const { results } = await client.search([{ indexName, query: key, hitsPerPage: 5 }]);
                const hits = results[0]?.hits || [];
                const question = hits.length > 0
                    ? hits[0].question
                    : `No question found for "${key}". Please fill out this field.`;
                return { key, question };
            } catch (error)
            {
                // If the index doesn't exist, return a default message.
                if (error.status === 404)
                {
                    return { key, question: `No question found for "${key}". Please fill out this field.` };
                }
                throw error;
            }
        })
    );
    return resultsArray.reduce((acc, { key, question }) =>
    {
        acc[key] = question;
        return acc;
    }, {});
}
