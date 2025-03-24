
import { PrismaClient } from "@prisma/client";
import { getTooltipsFromDb } from "../../lib/getTooltipsFromDb.js";
import { getTooltipsFromAi } from "../../lib/getTooltipsFromAi.js";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export default async function handler (req, res)
{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS")
    {
        return res.status(200).end();
    }

    if (req.method !== "POST")
    {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try
    {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token)
        {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const userTier = token.subscriptionTier || "free";
        const { keys } = req.body;
        let result;
        if (userTier === "free")
        {
            result = await getTooltipsFromDb(keys);
        } else
        {
            result = await getTooltipsFromAi(keys);
        }

        return res.status(200).json(result);
    } catch (error)
    {
        console.error("Error in question-lookup:", error);
        return res.status(500).json({ error: "Failed to look up question mappings" });
    }
}
