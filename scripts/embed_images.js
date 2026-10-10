const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const spideyPath = path.join(rootDir, 'assets', 'images', 'spiderman.jpg');
const portraitPath = path.join(rootDir, 'assets', 'images', 'portrait.jpg');
const indexPath = path.join(rootDir, 'index.html');

if (fs.existsSync(spideyPath) && fs.existsSync(portraitPath) && fs.existsSync(indexPath)) {
  const spideyB64 = fs.readFileSync(spideyPath).toString('base64');
  const portraitB64 = fs.readFileSync(portraitPath).toString('base64');

  let html = fs.readFileSync(indexPath, 'utf8');
  html = html.replace('src="spiderman.jpg"', 'src="data:image/jpeg;base64,' + spideyB64 + '"');
  html = html.replace('src="portrait.jpg"', 'src="data:image/jpeg;base64,' + portraitB64 + '"');

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('Done! HTML size:', fs.statSync(indexPath).size, 'bytes');
} else {
  console.log('Embed script: files not found at expected paths.');
}
