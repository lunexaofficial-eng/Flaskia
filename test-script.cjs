const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');
code = code.replace(/\bselect-none\b/g, '');
code = code.replace(/<div className="min-h-screen bg-slate-950/g, '<div className="min-h-screen bg-slate-950 admin-panel-root');
fs.writeFileSync('src/components/AdminPanel.tsx', code, 'utf-8');
console.log('done');
