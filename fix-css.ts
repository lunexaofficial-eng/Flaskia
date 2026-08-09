import * as fs from 'fs';
import * as path from 'path';

const REPLACEMENTS = {
  'blue-650': 'blue-600',
  'blue-605': 'blue-600',
  'slate-850': 'slate-800',
  'slate-805': 'slate-800',
  'slate-750': 'slate-700',
  'slate-705': 'slate-700',
  'slate-650': 'slate-600',
  'slate-550': 'slate-500',
  'slate-505': 'slate-500',
  'slate-455': 'slate-500',
  'slate-450': 'slate-400',
  'slate-405': 'slate-400',
  'slate-350': 'slate-300',
  'slate-250': 'slate-200',
  'slate-150': 'slate-100',
  'amber-650': 'amber-600',
  'red-650': 'red-600',
};

function processDirectory(dirPath: string) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let updated = content;

      for (const [invalid, valid] of Object.entries(REPLACEMENTS)) {
        updated = updated.split(invalid).join(valid);
      }

      if (updated !== content) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(process.cwd(), 'src/components'));
processDirectory(path.join(process.cwd(), 'src/App.tsx').replace('/App.tsx', ''));
