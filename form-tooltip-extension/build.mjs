// build.mjs
import * as esbuild from 'esbuild';
import fs from 'fs/promises'; // For file system operations

const outdir = 'dist'; // Output directory for bundled files
const polyfillPath = 'contentScripts/browser-polyfill.js'; // Define path to the polyfill

async function buildContentScript ()
{
    try
    {
        // Ensure the output directory exists
        await fs.mkdir(outdir, { recursive: true });

        // Read the polyfill content from its file
        const polyfillContent = await fs.readFile(polyfillPath, 'utf-8');

        await esbuild.build({
            entryPoints: ['contentScripts/main.js'], // Your main content script entry point
            bundle: true,                           // Important: enables bundling
            outfile: `${outdir}/contentScript.js`,  // Output file path
            format: 'iife',                         // Immediately Invoked Function Expression
            sourcemap: 'inline',                    // Optional: for easier debugging
            minify: false,                          // Set to true for production
            // Use the 'banner' option to prepend the polyfill to the output
            banner: {
                js: polyfillContent
            },
            logLevel: 'info',
        });
        console.log('✅ Content script built successfully with polyfill!');
    } catch (error)
    {
        console.error('❌ Error building content script:', error);
        process.exit(1);
    }
}


async function main ()
{
    // First, check if the polyfill file actually exists before we try to build
    try
    {
        await fs.access(polyfillPath);
    } catch (e)
    {
        console.error(`❌ Polyfill file not found at: ${polyfillPath}`);
        console.error('Please create the file with the content: if (typeof browser === "undefined") { var browser = chrome; }');
        process.exit(1);
    }

    await buildContentScript();
}

main();
