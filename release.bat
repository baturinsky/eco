esbuild src/prog.ts --outfile=distr/minified.js --minify
regpack distr/minified.js > distr/packed.js