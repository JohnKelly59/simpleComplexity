// pages/auth/register.js
import React, { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { Box, TextField, Button, Typography } from "@mui/material";

export default function RegisterPage ()
{
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Regex for a strong password
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    async function handleSubmit (e)
    {
        e.preventDefault();
        setErrorMsg("");

        // Validate that all fields are filled
        if (!firstName || !lastName || !email || !password || !confirmPassword)
        {
            setErrorMsg("Please fill in all fields");
            return;
        }

        // Validate that password and confirm password match
        if (password !== confirmPassword)
        {
            setErrorMsg("Passwords do not match");
            return;
        }

        // Validate that password meets strong criteria
        if (!strongPasswordRegex.test(password))
        {
            setErrorMsg(
                "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character."
            );
            return;
        }

        try
        {
            // 1) Create a new user in the database
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, email, password, confirmPassword }),
            });
            if (!res.ok)
            {
                const data = await res.json();
                throw new Error(data.error || "Registration failed");
            }

            // 2) Auto login the user using NextAuth credentials
            const loginResult = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });
            if (loginResult.error)
            {
                throw new Error(loginResult.error);
            }

            // 3) On successful sign-in, redirect to /dashboard
            router.push("/dashboard");
        } catch (err)
        {
            setErrorMsg(err.message || "Something went wrong.");
        }
    }

    return (
        <Box
            sx={{
                width: 300,
                margin: "40px auto",
                p: 3,
                border: "1px solid #ccc",
                borderRadius: 2,
            }}
        >
            <Typography variant="h4" mb={2}>
                Register
            </Typography>
            {errorMsg && (
                <Typography color="error" mb={2}>
                    {errorMsg}
                </Typography>
            )}
            <Box
                component="form"
                onSubmit={handleSubmit}
                display="flex"
                flexDirection="column"
                gap={2}
            >
                <TextField
                    label="First Name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    size="small"
                />
                <TextField
                    label="Last Name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    size="small"
                />
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    size="small"
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    size="small"
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    size="small"
                />
                <Button variant="contained" type="submit">
                    Register
                </Button>
            </Box>
        </Box>
    );
}
