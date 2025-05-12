// build.mjs
import * as esbuild from 'esbuild';
import fs from 'fs/promises'; // For creating the output directory

const outdir = 'dist'; // Output directory for bundled files

async function buildContentScript ()
{
    try
    {
        // Ensure the output directory exists
        await fs.mkdir(outdir, { recursive: true });

        await esbuild.build({
            entryPoints: ['contentScripts/main.js'], // Your main content script entry point
            bundle: true,                           // Important: enables bundling
            outfile: `${outdir}/contentScript.js`,  // Output file path
            format: 'iife',                         // Immediately Invoked Function Expression - good for content scripts
            // 'esm' could also work if you only have one output file and no dynamic imports
            // but 'iife' is safer to avoid any lingering module context issues.
            sourcemap: 'inline',                    // Optional: for easier debugging in development
            minify: false,                          // Optional: true for production builds to reduce size
            // You can add more options here, like loaders for CSS, etc. if needed
            // For external libraries that shouldn't be bundled (e.g., if they are globally available, which is rare for content scripts)
            // you might use the `external` option, but typically you want to bundle everything.
            logLevel: 'info',
        });
        console.log('✅ Content script built successfully!');
    } catch (error)
    {
        console.error('❌ Error building content script:', error);
        process.exit(1);
    }
}

// If you had other scripts to build (e.g., service worker, though it supports modules natively)
// you could add more functions or extend this one.
// async function buildServiceWorker() { ... }

async function main ()
{
    await buildContentScript();
    // await buildServiceWorker(); // if you also wanted to bundle it for some reason
}

main();