import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { buffer } from "micro";

export const config = {
    api: {
        bodyParser: false, // We need raw body for Stripe signature
    },
};

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
});

export default async function handler (req, res)
{
    const sig = req.headers["stripe-signature"];
    let event;

    try
    {
        const buf = await buffer(req);
        event = stripe.webhooks.constructEvent(
            buf,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err)
    {
        console.error("Webhook signature verification failed:", err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle Stripe events
    if (event.type === "checkout.session.completed")
    {
        const checkoutSession = event.data.object;
        const userId = checkoutSession.client_reference_id;
        // Mark user as subscribed
        await prisma.user.update({
            where: { id: Number(userId) },
            data: { subscriptionTier: "tier1" }, // or tier2, etc.
        });
    }

    return res.status(200).json({ received: true });
}
