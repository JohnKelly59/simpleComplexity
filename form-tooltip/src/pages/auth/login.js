// pages/auth/login.js
import React, { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Box, TextField, Button, Typography, Divider } from "@mui/material";

export default function LoginPage ()
{
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleCredentialsLogin (e)
  {
    e.preventDefault();
    setErrorMsg("");

    // Attempt credentials sign in
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.error)
    {
      // Show error to user
      setErrorMsg(result.error);
    } else
    {
      // Successful login
      router.push("/dashboard");
    }
  }

  async function handleGoogleLogin ()
  {
    // NextAuth will handle the redirect to Google
    signIn("google", {
      callbackUrl: "/dashboard",
    });
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
        Login
      </Typography>

      {errorMsg && (
        <Typography color="error" mb={2}>
          {errorMsg}
        </Typography>
      )}

      <Box
        component="form"
        onSubmit={handleCredentialsLogin}
        display="flex"
        flexDirection="column"
        gap={2}
      >
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
        <Button variant="contained" type="submit">
          Sign In with Credentials
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Button variant="outlined" onClick={handleGoogleLogin} fullWidth>
        Sign In with Google
      </Button>

      <Typography mt={2} variant="body2">
        Don’t have an account?{" "}
        <Link href="/auth/register">
          Register
        </Link>
      </Typography>
    </Box>
  );
}
