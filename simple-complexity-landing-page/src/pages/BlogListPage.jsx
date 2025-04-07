import { Box, Container, Typography, List, ListItem, ListItemText, Divider, Fade, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import blogPosts from '../blogData';

const BlogListPage = () =>
{
    const [loaded, setLoaded] = useState(false);

    useEffect(() =>
    {
        const timeout = setTimeout(() => setLoaded(true), 200);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', py: 8, px: 4, color: '#fff' }}>
            <Container maxWidth="md">
                <Fade in={loaded} timeout={1000}>
                    <Box>
                        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 700, mb: 4 }}>
                            Simple Complexity Blog
                        </Typography>

                        <List sx={{ width: '100%' }}>
                            {blogPosts.length > 0 ? (
                                blogPosts.map((post, index) => (
                                    <div key={post.id}>
                                        <ListItem
                                            alignItems="flex-start"
                                            sx={{ display: 'flex', flexDirection: 'column', py: 3 }}
                                        >
                                            <Typography
                                                variant="h5"
                                                component={RouterLink}
                                                to={`/blog/${post.slug}`}
                                                sx={{
                                                    color: '#fff',
                                                    textDecoration: 'none',
                                                    fontWeight: 600,
                                                    '&:hover': {
                                                        textDecoration: 'underline',
                                                        color: 'secondary.main',
                                                    },
                                                }}
                                            >
                                                {post.title}
                                            </Typography>
                                            <Typography variant="caption" display="block" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 0.5, mb: 1 }}>
                                                {post.date} {post.author ? `by ${post.author}` : ''}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
                                                {post.summary}
                                            </Typography>
                                            <Button
                                                component={RouterLink}
                                                to={`/blog/${post.slug}`}
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    color: '#fff',
                                                    borderColor: 'rgba(255, 255, 255, 0.5)',
                                                    '&:hover': {
                                                        borderColor: '#fff',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                                    }
                                                }}
                                            >
                                                Read More
                                            </Button>
                                        </ListItem>
                                        {index < blogPosts.length - 1 && <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />}
                                    </div>
                                ))
                            ) : (
                                <Typography align="center" sx={{ mt: 4, color: 'rgba(255, 255, 255, 0.8)' }}>
                                    No blog posts yet. Check back soon!
                                </Typography>
                            )}
                        </List>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default BlogListPage;