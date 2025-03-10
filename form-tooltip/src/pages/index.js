// pages/index.js
import React from "react";

export default function HomePage ()
{
    // This component will never be rendered because of the redirect.
    return null;
}

// Always redirect to the dashboard.
export async function getServerSideProps (context)
{
    return {
        redirect: {
            destination: "/dashboard",
            permanent: false,
        },
    };
}
