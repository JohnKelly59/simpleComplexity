// pages/api/register.js
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler (req, res)
{
    if (req.method !== "POST")
    {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword)
    {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Check that password and confirmPassword match
    if (password !== confirmPassword)
    {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    // Require strong password: minimum 8 characters with uppercase, lowercase, number, and special character
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(password))
    {
        return res.status(400).json({
            error:
                "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
        });
    }

    try
    {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser)
        {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user in the database
        await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                subscriptionTier: "free",
            },
        });

        return res.status(201).json({ message: "User created successfully" });
    } catch (error)
    {
        console.error("Registration error:", error);

        // Handle known Prisma errors explicitly
        if (error instanceof Prisma.PrismaClientKnownRequestError)
        {
            // Unique constraint failed (e.g., duplicate email)
            if (error.code === "P2002")
            {
                return res.status(400).json({ error: "A user with this email already exists." });
            }
            // For other known Prisma errors, send the message (consider hiding this in production)
            return res.status(400).json({ error: error.message });
        }

        // In development, send detailed error messages. In production, return a generic message.
        const isDev = process.env.NODE_ENV === "development";
        return res.status(500).json({ error: isDev ? error.message : "Internal server error" });
    } finally
    {
        await prisma.$disconnect();
    }
}
