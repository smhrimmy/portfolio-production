const fs = require('fs');

const reqFiles = [
  'server/routes/admin/articles.ts',
  'server/routes/admin/certifications.ts',
  'server/routes/admin/experience.ts',
  'server/routes/admin/media.ts',
  'server/routes/admin/projects.ts',
  'server/routes/admin/skills.ts',
  'server/routes/public/articles.ts',
  'server/routes/public/certifications.ts',
  'server/routes/public/skills.ts',
];

for (const file of reqFiles) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\(_req, res\)/g, '(req, res)');
  content = content.replace(/_req: any, /g, 'req: any, ');
  
  // Replace only the first instance (GET /)
  content = content.replace(/\(req, res\) => \{/, '(_req, res) => {');
  
  fs.writeFileSync(file, content);
}

const pStorageMan = 'server/services/storage/StorageManager.ts';
let cStorageMan = fs.readFileSync(pStorageMan, 'utf8');
cStorageMan = cStorageMan.replace(/\(_file: UploadedFile, _folderId\?: string\)/g, '(file: UploadedFile, folderId?: string)');
cStorageMan = cStorageMan.replace(/\(_providerId: string\)/g, '(providerId: string)');
// The ones that were actually unused:
// line 5: upload(file: UploadedFile, folderId?: string)
// line 24: upload(file: UploadedFile, folderId?: string)
// line 33: delete(providerId: string)
// Wait, the interface defines them, so they are not unused, they are part of interface signatures!
// Ah, TS says: "file is declared but its value is never read" on the MockProvider!
cStorageMan = cStorageMan.replace(/upload\(file: UploadedFile, folderId\?: string\)/g, 'upload(_file: UploadedFile, _folderId?: string)');
cStorageMan = cStorageMan.replace(/delete\(providerId: string\)/g, 'delete(_providerId: string)');
// Revert the interface:
cStorageMan = cStorageMan.replace(/upload\(_file: UploadedFile, _folderId\?: string\): Promise<StorageResult>/, 'upload(file: UploadedFile, folderId?: string): Promise<StorageResult>');
cStorageMan = cStorageMan.replace(/delete\(_providerId: string\): Promise<void>/, 'delete(providerId: string): Promise<void>');

fs.writeFileSync(pStorageMan, cStorageMan);

const dataFiles = [
  'src/data/experience.ts',
  'src/data/profile.ts',
  'src/data/projects.ts',
  'src/data/skills.ts'
];
for (const file of dataFiles) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/from "\.\.\/types\/([^"]+)"/g, 'from "../types/$1.js"');
  // replace unknown any[]
  content = content.replace(/Promise<unknown>/g, 'Promise<any[]>');
  fs.writeFileSync(file, content);
}

const pPubDash = 'src/pages/admin/content/PublishingDashboard.tsx';
let cPubDash = fs.readFileSync(pPubDash, 'utf8');
cPubDash = cPubDash.replace(/const token = localStorage.getItem\("admin_token"\);?\n/g, '');
fs.writeFileSync(pPubDash, cPubDash);

const pTheme = 'src/pages/admin/design/ThemeStudio.tsx';
let cTheme = fs.readFileSync(pTheme, 'utf8');
cTheme = cTheme.replace(/import \{ PortfolioTheme \} from "\.\.\/\.\.\/types\/theme"/, 'import type { PortfolioTheme } from "../../types/theme"');
fs.writeFileSync(pTheme, cTheme);

console.log('Fixes applied.');
