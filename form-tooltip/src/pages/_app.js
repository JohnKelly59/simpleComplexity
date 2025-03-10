// pages/_app.js
import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
    // Customize your MUI theme here, e.g. palette, typography, etc.
    palette: {
        mode: "light",
    },
});

export default function App ({ Component, pageProps: { session, ...pageProps } })
{
    return (
        <SessionProvider session={session}>
            <ThemeProvider theme={theme}>
                {/* Baseline CSS reset */}
                <CssBaseline />
                <Component {...pageProps} />
            </ThemeProvider>
        </SessionProvider>
    );
}
