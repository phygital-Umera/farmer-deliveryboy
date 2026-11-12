const fs = require('fs');
const path = require('path');

// ============================================================
// MedCoNinja Global Theme Migration Script
// Replaces old Tailwind color classes with new semantic tokens
// ============================================================

// Ordered from most-specific to least-specific to avoid partial matches
const replacements = [
  // --- Primary Navy: sidebars, navbars, primary buttons ---
  ['blue-800',  'primary-navy'],
  ['blue-700',  'primary-navy'],
  ['blue-600',  'primary-navy'],
  ['indigo-600','primary-navy'],
  ['indigo-700','primary-navy'],
  ['boxdark',   'primary-navy'],   // dark sidebar background -> navy
  ['boxdark-2', 'primary-navy'],

  // --- Accent Teal: CTA, highlights, icons, badges ---
  ['blue-500',  'accent-teal'],
  ['blue-400',  'accent-teal'],
  ['teal-600',  'accent-teal'],
  ['teal-500',  'accent-teal'],
  ['green-600', 'accent-teal'],
  ['green-500', 'accent-teal'],
  ['secondary', 'accent-teal'],

  // --- Background Light Mint: app bg, soft sections ---
  ['gray-200',  'bg-light-mint'],
  ['gray-100',  'bg-light-mint'],
  ['gray-50',   'bg-light-mint'],
  ['slate-200', 'bg-light-mint'],
  ['slate-100', 'bg-light-mint'],
  ['slate-50',  'bg-light-mint'],
  ['blue-50',   'bg-light-mint'],
  ['gray-2',    'bg-light-mint'],

  // --- Text Charcoal: all primary text and headings ---
  ['slate-900', 'text-charcoal'],
  ['slate-800', 'text-charcoal'],
  ['slate-700', 'text-charcoal'],
  ['slate-600', 'text-charcoal'],
  ['slate-500', 'text-charcoal'],
  ['slate-400', 'text-charcoal'],
  ['gray-900',  'text-charcoal'],
  ['gray-800',  'text-charcoal'],
  ['gray-700',  'text-charcoal'],
  ['gray-600',  'text-charcoal'],
  ['gray-500',  'text-charcoal'],
  ['gray-400',  'text-charcoal'],
  ['body',      'text-charcoal'],

  // --- Pure White: cards, modals, white text ---
  ['white',     'pure-white'],
];

const PREFIX_RE = '(?:[a-z0-9-]+:)*';
const PROP_RE   = '(?:bg|text|border|ring|from|to|via|fill|stroke|outline|decoration|shadow|placeholder)';

function buildReplacer(oldColor, newColor) {
  const escaped = oldColor.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const pattern = new RegExp(
    `(${PREFIX_RE})(${PROP_RE})-(${escaped})(?=[^-\\w]|$)`,
    'g'
  );
  return { pattern, newColor, oldColor };
}

const allReplacers = replacements.map(([old, next]) => buildReplacer(old, next));

const EXTENSIONS = new Set(['.tsx', '.ts', '.jsx', '.js', '.html', '.css']);
const SKIP_DIRS  = new Set(['node_modules', '.git', 'dist', '.tanstack']);

let changedFiles = 0;
let totalMatches = 0;
const fileLog = [];

function processFile(fullPath) {
  const ext = path.extname(fullPath).toLowerCase();
  if (!EXTENSIONS.has(ext)) return;

  let content = fs.readFileSync(fullPath, 'utf8');
  let localMatches = 0;

  for (const { pattern, newColor } of allReplacers) {
    content = content.replace(pattern, (match, prefix, prop) => {
      localMatches++;
      return `${prefix}${prop}-${newColor}`;
    });
  }

  if (localMatches > 0) {
    fs.writeFileSync(fullPath, content, 'utf8');
    changedFiles++;
    totalMatches += localMatches;
    fileLog.push(`  [${localMatches.toString().padStart(3)}] ${path.relative(__dirname, fullPath)}`);
  }
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      processDirectory(path.join(dir, entry.name));
    } else {
      processFile(path.join(dir, entry.name));
    }
  }
}

console.log('🎨 MedCoNinja Theme Migration Starting...\n');
processDirectory(path.join(__dirname, 'src'));
fileLog.forEach(l => console.log(l));
console.log(`\n✅ Done! Changed ${changedFiles} files with ${totalMatches} total replacements.`);
