
import { Box, Container, Typography, Fade, Link as MuiLink, Divider, Button } from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import blogPosts from '../blogData';

const BlogPostPage = () =>
{
    const [loaded, setLoaded] = useState(false);
    const { slug } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() =>
    {
        const currentPost = blogPosts.find((p) => p.slug === slug);
        setPost(currentPost);

        const timeout = setTimeout(() => setLoaded(true), 100);
        return () => clearTimeout(timeout);
    }, [slug]);

    const renderContent = (contentString) =>
    {
        if (!contentString) return null;
        return contentString.split('\n').map((paragraph, index) => (
            paragraph.trim() !== '' ? (
                <Typography key={index} variant="body1" paragraph sx={{ opacity: 0.9, lineHeight: 1.7 }}>
                    {paragraph}
                </Typography>
            ) : null
        ));
    };

    return (
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', py: 8, px: 4, color: '#fff' }}>
            <Container maxWidth="md">
                <Fade in={loaded} timeout={800}>
                    <Box>
                        {post ? (
                            <article>
                                <MuiLink
                                    component={RouterLink}
                                    to="/blog"
                                    sx={{ display: 'block', mb: 3, color: 'rgba(255, 255, 255, 0.8)', '&:hover': { color: '#fff' } }}
                                >
                                    &larr; Back to Blog List
                                </MuiLink>

                                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                                    {post.title}
                                </Typography>
                                <Typography variant="caption" display="block" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                                    {post.date} {post.author ? `by ${post.author}` : ''}
                                </Typography>

                                <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

                                <Box sx={{ mt: 3 }}>
                                    {renderContent(post.content)}
                                </Box>
                            </article>
                        ) : (
                            <Box sx={{ textAlign: 'center', mt: 5 }}>
                                <Typography variant="h5" gutterBottom>
                                    Post Not Found
                                </Typography>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                    Sorry, we couldn't find the post you were looking for.
                                </Typography>
                                <Button
                                    component={RouterLink}
                                    to="/blog"
                                    variant="outlined"
                                    sx={{ mt: 3, color: '#fff', borderColor: 'rgba(255, 255, 255, 0.5)', '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                                >
                                    Go to Blog List
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default BlogPostPage;