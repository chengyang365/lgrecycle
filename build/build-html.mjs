import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { transformAsync } from '@babel/core';

const source = await readFile('index.html', 'utf8');
const scriptPattern = /<script type="text\/babel" data-presets="react">([\s\S]*?)<\/script>/;
const match = source.match(scriptPattern);
if (!match) throw new Error('Inline JSX script was not found.');

const transformed = await transformAsync(match[1], {
  filename: 'index.jsx',
  presets: [['@babel/preset-react', { runtime: 'classic' }]],
  comments: false,
  compact: true
});

const output = source
  .replace('<script src="https://unpkg.com/@babel/standalone@7.26.5/babel.min.js"></script>\n', '')
  .replace('<script src="https://cdn.tailwindcss.com/3.4.17"></script>\n', '<link rel="stylesheet" href="./tailwind.css">\n')
  .replace(scriptPattern, '<script>' + transformed.code + '</script>');

await mkdir('dist', { recursive: true });
const [tailwindCss, manifest, serviceWorkerTemplate] = await Promise.all([
  readFile('dist/tailwind.css', 'utf8'),
  readFile('site.webmanifest', 'utf8'),
  readFile('sw.js', 'utf8')
]);
const buildId = createHash('sha256').update(output).update(tailwindCss).update(manifest).digest('hex').slice(0, 12);
const serviceWorker = serviceWorkerTemplate.replace('__BUILD_ID__', buildId);
if (serviceWorker.includes('__BUILD_ID__')) throw new Error('Service worker build placeholder was not replaced.');

await writeFile('dist/index.html', output);
await writeFile('dist/sw.js', serviceWorker);
await copyFile('site.webmanifest', 'dist/site.webmanifest');
