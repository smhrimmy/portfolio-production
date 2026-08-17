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
  content = content.replace(/\(req, res\)/g, '(_req, res)');
  content = content.replace(/req: any, /g, '_req: any, ');
  fs.writeFileSync(file, content);
}

const pAdminLayout = 'src/layouts/AdminLayout.tsx';
let cAdminLayout = fs.readFileSync(pAdminLayout, 'utf8');
cAdminLayout = cAdminLayout.replace(/Terminal,?\s*/g, '');
fs.writeFileSync(pAdminLayout, cAdminLayout);

const pAiStudio = 'src/pages/admin/ai/AiStudio.tsx';
let cAiStudio = fs.readFileSync(pAiStudio, 'utf8');
cAiStudio = cAiStudio.replace(/PlusCircle,?\s*/g, '');
fs.writeFileSync(pAiStudio, cAiStudio);

const pProjAdmin = 'src/pages/admin/content/ProjectsAdmin.tsx';
let cProjAdmin = fs.readFileSync(pProjAdmin, 'utf8');
cProjAdmin = cProjAdmin.replace(/ExternalLink,?\s*/g, '');
fs.writeFileSync(pProjAdmin, cProjAdmin);

const pPubDash = 'src/pages/admin/content/PublishingDashboard.tsx';
let cPubDash = fs.readFileSync(pPubDash, 'utf8');
cPubDash = cPubDash.replace(/import\s+\{.*\}\s+from\s+["']react["'];?\n/g, '');
cPubDash = cPubDash.replace(/const token = localStorage.getItem\("admin_token"\);?\n/g, '');
fs.writeFileSync(pPubDash, cPubDash);

const pTheme = 'src/pages/admin/design/ThemeStudio.tsx';
let cTheme = fs.readFileSync(pTheme, 'utf8');
cTheme = cTheme.replace(/import \{ PortfolioTheme \} from "\.\.\/\.\.\/types\/theme"/, 'import type { PortfolioTheme } from "../../types/theme"');
cTheme = cTheme.replace(/import \{ motion \} from "framer-motion";?\n/, '');
fs.writeFileSync(pTheme, cTheme);

const pMediaLib = 'src/pages/admin/media/MediaLibrary.tsx';
let cMediaLib = fs.readFileSync(pMediaLib, 'utf8');
cMediaLib = cMediaLib.replace(/Edit2,?\s*/g, '');
fs.writeFileSync(pMediaLib, cMediaLib);

const pStorageMan = 'server/services/storage/StorageManager.ts';
let cStorageMan = fs.readFileSync(pStorageMan, 'utf8');
cStorageMan = cStorageMan.replace(/import \{ IStorageProvider, UploadedFile, StorageResult \} from "\.\.\/\.\.\/types\/storage"/, 'import type { IStorageProvider, UploadedFile, StorageResult } from "../../types/storage"');
cStorageMan = cStorageMan.replace(/\(file: UploadedFile, folderId\?: string\)/g, '(_file: UploadedFile, _folderId?: string)');
cStorageMan = cStorageMan.replace(/\(providerId: string\)/g, '(_providerId: string)');
fs.writeFileSync(pStorageMan, cStorageMan);

console.log('Done replacing.');
