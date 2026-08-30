const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Replace standard frontend files
    const regex1 = /import\.meta\.env\.VITE_API_URL\s*\|\|\s*\(import\.meta\.env\.DEV\s*\?\s*["']http:\/\/localhost:3001["']\s*:\s*["']["']\)/g;
    if (regex1.test(content)) {
      content = content.replace(regex1, '(import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3001") : "")');
      changed = true;
    }

    const regex1b = /import\.meta\.env\.VITE_API_URL\s*\|\|\s*\(import\.meta\.env\.DEV\s*\?\s*['"]http:\/\/localhost:3001['"]\s*:\s*['"]['"]\)/g;
    if (regex1b.test(content)) {
      content = content.replace(regex1b, '(import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3001") : "")');
      changed = true;
    }

    // Replace Node-safe fallback (data files used in seed script)
    const regex2 = /\(typeof import\.meta !== 'undefined' && import\.meta\.env \? import\.meta\.env\.VITE_API_URL : null\)\s*\|\|\s*\(typeof import\.meta !== 'undefined' && import\.meta\.env\?\.DEV \? ["']http:\/\/localhost:3001["'] : ["']["']\)/g;
    if (regex2.test(content)) {
      content = content.replace(regex2, '(typeof import.meta !== "undefined" && import.meta.env?.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3001") : "")');
      changed = true;
    }

    // ProductionPortfolioAIProvider
    const regex3 = /import\.meta\.env\.VITE_API_URL\s*\|\|\s*\(import\.meta\.env\.DEV\s*\?\s*["']http:\/\/localhost:3001\/api\/ai\/ask["']\s*:\s*["']\/api\/ai\/ask["']\)/g;
    if (regex3.test(content)) {
      content = content.replace(regex3, '(import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3001/api/ai/ask") : "/api/ai/ask")');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated:', filePath);
    }
  }
});
