// src/blogData.js

// Helper function to format date (optional)
const formatDate = (dateString) =>
{
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const blogPosts = [
    {
        id: 1,
        slug: 'welcome-to-the-blog', // URL-friendly identifier
        title: 'Welcome to the Simple Complexity Blog!',
        date: formatDate('2025-04-07'), // Use current date or desired date
        author: 'The Simple Complexity Team',
        summary: 'An introduction to our blog where we discuss accessibility, user experience, and simplifying the web.',
        // Content can be a simple string. For paragraphs, use newline characters (\n).
        content: `Welcome everyone!\n\nThis is the first post on the Simple Complexity blog. We're excited to start sharing insights, tips, and news related to making the web simpler and more accessible for everyone.\n\nIn this space, we plan to cover topics such as:\n- The importance of clear language in forms\n- AI advancements in accessibility\n- User experience best practices\n- Updates to the Simple Complexity tool\n\nStay tuned for more posts coming soon!`,
    },
    {
        id: 2,
        slug: 'why-tooltips-matter',
        title: 'The Unsung Hero: Why Tooltips Matter for Form Accessibility',
        date: formatDate('2025-04-10'), // Example future date
        author: 'Jane Doe, UX Specialist',
        summary: 'A deep dive into how well-implemented tooltips can significantly improve form completion rates and user satisfaction.',
        content: `Online forms are everywhere, but they can often be confusing. One of the simplest yet most effective ways to help users is through informative tooltips.\n\nGood tooltips provide context exactly when needed, clarifying ambiguous labels or explaining required data formats without cluttering the main interface.\n\nConsider a field labeled "Authorization Code". What is that? Where does the user find it? A simple tooltip can answer these questions instantly, preventing user frustration and abandonment.\n\nFurthermore, when designed accessibly, tooltips can be read by screen readers, ensuring that users with visual impairments also benefit from the additional information. At Simple Complexity, we focus on generating tooltips that are not only helpful but also adhere to accessibility standards.`,
    },
    // --- NEW BLOG POST ADDED BELOW ---
    {
        id: 3,
        slug: 'ai-driven-proactive-support',
        title: 'Stop Answering Questions: How AI Can Prevent Customer Support Tickets',
        date: formatDate('2025-10-20'), // Today's date
        author: 'The Simple Complexity Team',
        summary: 'Traditional customer support is reactive. We explore how AI tools can provide proactive assistance, answering user questions *before* they have to ask.',
        content: `In customer support, most companies are stuck in a reactive loop: a user gets confused, they search for a "Help" button, they open a chat or submit a ticket, and then they wait.\n\nWhat if we could solve the user's problem before they even realize they have it? This is the power of proactive, AI-driven support.\n\nTools like intelligent tooltips, which provide instant clarity on confusing form fields, are the first line of defense. By answering "What does this mean?" right at the source, you prevent the user from ever needing to leave the page to find an answer. This not only cuts down on support ticket volume but also dramatically improves form completion rates.\n\nFurthermore, by analyzing *which* tooltips are being used most, businesses can gather invaluable data. If 1,000 users are clicking the tooltip for "Beneficiary Name," that's a clear signal that the label is confusing and should be changed. This transforms your support from a cost center into a powerful engine for product improvement.`,
    },
];

export default blogPosts; // Export the array