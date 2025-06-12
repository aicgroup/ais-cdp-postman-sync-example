const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const collectionsDir = path.join(__dirname, 'postman', 'collections');
const outputDir = path.join(__dirname, 'open-api');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(collectionsDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const collectionPath = path.join(collectionsDir, file);
  const json = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
  const name = json.info && json.info.name ? json.info.name : path.parse(file).name;
  const openapiPath = path.join(outputDir, `${name}.yaml`);
  const cmd = `npx -y postman-to-openapi "${collectionPath}" "${openapiPath}" -y`;
  console.log(`Converting ${file} -> ${openapiPath}`);
  execSync(cmd, { stdio: 'inherit' });
});
