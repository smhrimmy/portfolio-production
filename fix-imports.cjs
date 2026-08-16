const fs = require('fs');

const adminRoutes = [
  'server/routes/admin/articles.ts',
  'server/routes/admin/certifications.ts',
  'server/routes/admin/experience.ts',
  'server/routes/admin/media.ts',
  'server/routes/admin/projects.ts',
  'server/routes/admin/skills.ts',
];
const publicRoutes = [
  'server/routes/public/articles.ts',
  'server/routes/public/certifications.ts',
  'server/routes/public/skills.ts',
];

const scripts = [
  'server/scripts/build-index.ts',
  'server/scripts/seed.ts',
];

function replace(files, dbPath) {
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace('import { PrismaClient } from "@prisma/client"\n', '');
    content = content.replace('const prisma = new PrismaClient()\n', `import { prisma } from "${dbPath}"\n`);
    // Fallback for cases with extra spaces
    content = content.replace('import { PrismaClient } from "@prisma/client";\n', '');
    content = content.replace('const prisma = new PrismaClient();\n', `import { prisma } from "${dbPath}"\n`);
    fs.writeFileSync(file, content);
  }
}

replace(adminRoutes, '../../config/db.js');
replace(publicRoutes, '../../config/db.js');
replace(scripts, '../config/db.js');
