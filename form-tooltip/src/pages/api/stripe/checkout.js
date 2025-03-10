import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
});

export default async function handler (req, res)
{
    if (req.method !== "POST")
    {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try
    {
        const session = await getSession({ req });
        if (!session)
        {
            return res.status(401).json({ error: "Not authenticated" });
        }

        // Example priceId from your Stripe dashboard
        const { priceId } = req.body;
        const userId = session.user.id;

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/payment-cancel`,
            client_reference_id: String(userId), // reference the user
        });

        return res.status(200).json({ url: checkoutSession.url });
    } catch (err)
    {
        console.error("Error creating checkout session:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
