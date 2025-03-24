// pages/dashboard.js
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import
{
    AppBar,
    Box,
    Button,
    Card,
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
import UpgradeIcon from "@mui/icons-material/Upgrade";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

const greetings = [
    "Hello",
    "Hi there",
    "Greetings",
    "Howdy",
    "Hey",
    "Salutations",
];

export default function DashboardPage (props)
{
    const { data: session, status } = useSession();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    if (status === "loading")
    {
        return <Typography>Loading...</Typography>;
    }
    if (!session)
    {
        router.push("/auth/login");
        return null;
    }

    // Randomly select a greeting each time the page renders
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    const firstName = session.user.name || "User";

    const handleDrawerToggle = () =>
    {
        setMobileOpen(!mobileOpen);
    };

    const handleUpgrade = () =>
    {
        router.push("/dashboard/upgrade");
    };

    const drawer = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Form Tooltip
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
                        aria-label={item.text}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem button onClick={() => signOut()} aria-label="Logout">
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
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Dashboard
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        {session.user.email}
                    </Typography>
                    <Button color="inherit" onClick={() => signOut()} aria-label="Logout">
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="sidebar navigation"
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
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    backgroundColor: "#f9f9f9",
                    minHeight: "100vh",
                }}
            >
                <Toolbar />
                <Typography variant="h4" gutterBottom>
                    {randomGreeting}, {firstName}!
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Your current subscription tier is:{" "}
                    <strong>{session.user.subscriptionTier}</strong>
                </Typography>
                <Card sx={{ my: 3 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            What is Form Tooltip?
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Form Tooltip is an innovative extension designed to help users fill out forms more easily. It automatically adds a small help icon beside each form field. Hover over the icon to view simplified descriptions and helpful tips.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Accessibility Benefits:</strong>
                            <br />
                            - <em>Clear Guidance:</em> Each tooltip provides concise explanations of what is required in each field, reducing confusion.
                            <br />
                            - <em>Keyboard & Screen Reader Friendly:</em> With proper ARIA labels (e.g., each help icon has an <code>aria-label="Help"</code>), the tooltips are designed to be accessible to users relying on assistive technologies.
                            <br />
                            - <em>Visual Contrast:</em> The tooltip design uses high-contrast colors ensuring readability for users with visual impairments.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            The extension works on any web page by injecting tooltips near input fields. It is built with accessibility in mind, making it easier for all users—including those with disabilities—to understand form requirements.
                        </Typography>
                    </CardContent>
                </Card>

                {/* Upgrade Section */}
                {session.user.subscriptionTier === "free" && (
                    <Card sx={{ my: 3 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Upgrade for More Features!
                            </Typography>
                            <Typography variant="body1" paragraph>
                                Upgrade your subscription to unlock premium features such as:
                            </Typography>
                            <ul>
                                <li>Customizable tooltip questions and styles.</li>
                                <li>Advanced analytics on form interactions.</li>
                                <li>Priority support and regular updates.</li>
                            </ul>
                            <Button
                                variant="contained"
                                startIcon={<UpgradeIcon />}
                                onClick={handleUpgrade}
                            >
                                Upgrade Now
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <Card sx={{ my: 3 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Quick Links & Tips
                        </Typography>
                        <Typography variant="body1">
                            Use the sidebar to navigate between Dashboard and Settings. Explore new features and customize your form experience with ease!
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
