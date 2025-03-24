import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    jwt: {
        maxAge: 15 * 60,
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
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                if (!user)
                {
                    return null;
                }
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
        async signIn ({ user, account, profile, email, credentials })
        {
            if (account?.provider === "google")
            {
                const userEmail = user.email;
                const existingUser = await prisma.user.findUnique({
                    where: { email: userEmail },
                });
                if (!existingUser)
                {
                    const newUser = await prisma.user.create({
                        data: {
                            email: userEmail,
                            password: "",
                            subscriptionTier: "free",
                            firstName: profile?.given_name || "User",
                            lastName: profile?.family_name || "User",
                        },
                    });
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

            return true;
        },


        async jwt ({ token, user })
        {
            if (user)
            {
                token.id = user.id;
                token.email = user.email;
                token.subscriptionTier = user.subscriptionTier || "free";
            }
            return token;
        },

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
