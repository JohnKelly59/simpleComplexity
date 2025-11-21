import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) =>
{
  return {
    plugins: [react()],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    build: {
      // Generate a library instead of a website
      lib: {
        entry: 'src/main.jsx', // Your SDK's entry point
        name: 'SimpleFormSDK', // The name for the global variable on the window object
        fileName: (format) => `simpleform-sdk.${format}.js`, // The name of the output file
        formats: ['umd'], // Universal Module Definition - works everywhere
      },
      // Don't minify the code while testing to make debugging easier
      minify: false,
      // Keep the CSS in the JS file for simplicity
      cssCodeSplit: false,
    },
  }
});