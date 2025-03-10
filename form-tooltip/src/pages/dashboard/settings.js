// pages/dashboard/settings.js
import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import
    {
        AppBar,
        Box,
        Button,
        Card,
        CardActions,
        CardContent,
        CssBaseline,
        Divider,
        Drawer,
        IconButton,
        List,
        ListItem,
        ListItemIcon,
        ListItemText,
        Toolbar,
        Typography,
    } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

export default function SettingsPage ()
{
    const { data: session, status } = useSession();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [loadingUpgrade, setLoadingUpgrade] = useState(false);

    if (status === "loading")
    {
        return <Typography>Loading...</Typography>;
    }
    if (!session)
    {
        router.push("/auth/login");
        return null;
    }

    const handleDrawerToggle = () =>
    {
        setMobileOpen(!mobileOpen);
    };

    async function handleUpgrade ()
    {
        setLoadingUpgrade(true);
        try
        {
            // POST to your Stripe checkout API endpoint.
            // Make sure to replace 'your_stripe_price_id' with the actual Stripe price ID for the upgrade plan.
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId: "your_stripe_price_id" }),
            });
            const data = await res.json();
            if (data.url)
            {
                router.push(data.url);
            } else
            {
                throw new Error("Unable to create checkout session");
            }
        } catch (error)
        {
            console.error(error);
            alert(error.message || "Something went wrong.");
        } finally
        {
            setLoadingUpgrade(false);
        }
    }

    // A simple sidebar drawer for navigation within the dashboard
    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    My App
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {[
                    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
                    { text: "Settings", icon: <SettingsIcon />, path: "/dashboard/settings" },
                ].map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => router.push(item.path)}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem button onClick={() => signOut()}>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            {/* Top AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Settings
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        {session.user.email}
                    </Typography>
                    <Button color="inherit" onClick={() => signOut()}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            {/* Sidebar Drawer */}
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="dashboard navigation"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            {/* Main Settings Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                <Typography variant="h4" gutterBottom>
                    Account Settings
                </Typography>
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6">Personal Information</Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography>Email: {session.user.email}</Typography>
                        <Typography>
                            Current Subscription:{" "}
                            <strong>{session.user.subscriptionTier}</strong>
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" color="secondary" onClick={() => signOut()}>
                            Sign Out
                        </Button>
                    </CardActions>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h6">Subscription & Billing</Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body1">
                            Upgrade your subscription to access additional features.
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button
                            variant="contained"
                            onClick={handleUpgrade}
                            disabled={loadingUpgrade}
                        >
                            {loadingUpgrade ? "Processing..." : "Upgrade Plan"}
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Box>
    );
}
