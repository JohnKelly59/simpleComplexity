import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler (req, res)
{
    if (req.method !== "GET")
    {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // If using next-auth:
    const session = await getSession({ req });
    if (!session)
    {
        return res.status(401).json({ error: "Not authenticated" });
    }

    // Retrieve the user
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user)
    {
        return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ subscriptionTier: user.subscriptionTier });
}
