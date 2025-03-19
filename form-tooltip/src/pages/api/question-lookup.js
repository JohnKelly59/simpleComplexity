// pages/api/question-lookup.js
import { PrismaClient } from "@prisma/client";
import { getTooltipsFromAlgolia } from "../../lib/getTooltipsFromAlgolia.mjs";
import { getTooltipsFromAi } from "../../lib/getTooltipsFromAi";

const prisma = new PrismaClient();

export default async function handler (req, res)
{
    // Basic CORS setup (adjust for your domain if needed)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS")
    {
        // Preflight request
        return res.status(200).end();
    }

    if (req.method !== "POST")
    {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try
    {
        const userTier = "free";

        const { keys } = req.body;
        if (!Array.isArray(keys))
        {
            return res.status(400).json({ error: "Body must contain an array 'keys'." });
        }

        let result;

        if (userTier === "free")
        {
            // Use the DB-based helper
            result = await getTooltipsFromAlgolia(keys);
        } else
        {
            // Use the GPT-based helper
            result = await getTooltipsFromAi(keys);
        }

        return res.status(200).json(result);
    } catch (error)
    {
        console.error("Error in question-lookup:", error);
        return res.status(500).json({ error: "Failed to look up question mappings" });
    }
}
