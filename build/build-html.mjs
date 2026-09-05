import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
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
await writeFile('dist/index.html', output);
await copyFile('sw.js', 'dist/sw.js');
