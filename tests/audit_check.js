const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('--- Starting Codebase Regression & Audit Check ---');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log('✓ PASS:', message);
    passed++;
  } else {
    console.error('✗ FAIL:', message);
    failed++;
  }
}

// 1. Check critical files
const criticalFiles = [
  'index.html',
  'build.js',
  'server.js',
  'script.js',
  'style.css',
  'metadata.json',
  'github-cache.json',
  'leetcode-cache.json',
  'about.html',
  'contact.html',
  'projects.html'
];

criticalFiles.forEach(f => {
  assert(fs.existsSync(f) && fs.statSync(f).size > 0, `File exists and non-empty: ${f}`);
});

// 2. Check JSON validity
['metadata.json', 'github-cache.json', 'leetcode-cache.json'].forEach(j => {
  try {
    const parsed = JSON.parse(fs.readFileSync(j, 'utf8'));
    assert(parsed && typeof parsed === 'object', `Valid JSON: ${j}`);
  } catch (err) {
    assert(false, `Invalid JSON in ${j}: ${err.message}`);
  }
});

// 3. Check assets
const criticalAssets = [
  'assets/images/portrait.jpg',
  'assets/images/spiderman.jpg',
  'assets/images/brand-banner.png',
  'assets/images/arogya-flow-featured.jpg',
  'assets/images/project-darkyn-featured.jpg',
  'assets/images/safeyatra-featured.jpg'
];

criticalAssets.forEach(a => {
  assert(fs.existsSync(a) && fs.statSync(a).size > 1000, `Asset exists with healthy size: ${a}`);
});

// 4. Check no dead root files
const deletedFiles = ['herosection.html', 'media1.jpg', 'media2.jpg', 'spiderman.png'];
deletedFiles.forEach(d => {
  assert(!fs.existsSync(d), `Verified deleted: ${d}`);
});

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('All tests passed successfully!');
}
