// pages/api/auth/[...nextauth].js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default NextAuth({
    // Ensure you set NEXTAUTH_SECRET in your env variables
    secret: process.env.NEXTAUTH_SECRET,
    // Explicitly tell NextAuth to use JWT for sessions
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize (credentials)
            {
                if (!credentials.email || !credentials.password)
                {
                    return null;
                }
                // Find user in DB
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                if (!user)
                {
                    return null;
                }
                // Compare password
                const match = await bcrypt.compare(credentials.password, user.password);
                if (!match)
                {
                    return null;
                }
                return {
                    id: user.id,
                    email: user.email,
                    subscriptionTier: user.subscriptionTier,
                    firstName: user.firstName,
                    lastName: user.lastName,
                };
            },
        }),
    ],
    callbacks: {
        /**
         * 1) signIn callback runs BEFORE jwt/session,
         *    letting you create or deny user entries in DB.
         */
        async signIn ({ user, account, profile, email, credentials })
        {
            // If this is Google sign-in
            if (account?.provider === "google")
            {
                const userEmail = user.email;
                // Check if user exists in DB
                const existingUser = await prisma.user.findUnique({
                    where: { email: userEmail },
                });
                if (!existingUser)
                {
                    // If user doesn't exist, create a new record
                    const newUser = await prisma.user.create({
                        data: {
                            email: userEmail,
                            password: "",                // not used for Google-based accounts
                            subscriptionTier: "free",
                            firstName: profile?.given_name || "User",
                            lastName: profile?.family_name || "User", // important fix here
                        },
                    });
                    // Overwrite "user" to pass custom fields to jwt callback
                    user.id = newUser.id;
                    user.subscriptionTier = newUser.subscriptionTier;
                    user.firstName = newUser.firstName;
                } else
                {
                    // If user already exists, just attach DB info
                    user.id = existingUser.id;
                    user.subscriptionTier = existingUser.subscriptionTier;
                }
            }
            // For credentials sign-in, we already handle that in "authorize"
            return true; // Continue the sign-in process
        },

        /**
         * 2) jwt callback - set token payload for session
         */
        async jwt ({ token, user, account })
        {
            console.log("jwt callback", user);
            if (user)
            {
                token.id = user.id;
                token.subscriptionTier = user.subscriptionTier || "free";
                // Combine firstName and lastName or use user.name if available
                token.name = user.firstName
            }
            return token;
        },

        // session callback
        async session ({ session, token })
        {
            session.user = session.user || {};
            session.user.id = token.id;
            session.user.subscriptionTier = token.subscriptionTier || "free";
            session.user.name = token.name || "";
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
});
