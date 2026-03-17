import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir)
  .filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'))
  .map(f => path.join(pagesDir, f));

let changed = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Remove imports
  content = content.replace(/import\s*\{\s*AppLayout\s*\}\s*from\s*['"]@\/components\/layout\/AppLayout['"];?\n?/g, '');
  
  // Replace <AppLayout ...> and <AppLayout> with <>
  content = content.replace(/<AppLayout[^>]*>/g, '<>');
  
  // Replace </AppLayout> with </>
  content = content.replace(/<\/AppLayout>/g, '</>');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changed++;
  }
});

console.log(`Processed ${files.length} files. Changed ${changed} files.`);
