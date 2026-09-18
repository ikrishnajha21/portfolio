const fs = require('fs');

const spideyB64 = fs.readFileSync('C:/Users/Krishna Jha/OneDrive/Desktop/krishna/spiderman.jpg').toString('base64');
const portraitB64 = fs.readFileSync('C:/Users/Krishna Jha/OneDrive/Desktop/krishna/portrait.jpg').toString('base64');

let html = fs.readFileSync('C:/Users/Krishna Jha/OneDrive/Desktop/krishna/index.html', 'utf8');

html = html.replace('src="spiderman.jpg"', 'src="data:image/jpeg;base64,' + spideyB64 + '"');
html = html.replace('src="portrait.jpg"', 'src="data:image/jpeg;base64,' + portraitB64 + '"');

fs.writeFileSync('C:/Users/Krishna Jha/OneDrive/Desktop/krishna/index.html', html, 'utf8');
console.log('Done! HTML size:', fs.statSync('C:/Users/Krishna Jha/OneDrive/Desktop/krishna/index.html').size, 'bytes');
