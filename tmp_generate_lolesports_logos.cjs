// Script Node.js pour tester automatiquement les variantes d’URL sur static.lolesports.com/leagues/
const https = require('https');
const fs = require('fs');

// Liste extraite dynamiquement de l'API Leaguepedia (2025)
const tournaments = [
  { name: '2025 Cross Regional' },
  { name: '4 Nations 2025 Spring' },
  { name: '4 Nations 2025 Winter' },
  { name: '4 Nations 2025 Winter Playoffs' },
  { name: 'Alior Bank Rift Legends 2025 Spring Open Qualifier 1' },
  { name: 'Alior Bank Rift Legends 2025 Spring Open Qualifier 2' },
  { name: 'Alior Bank Rift Legends 2025 Spring Promotion' },
  { name: 'Almost Pro Legends 2025 Spring Closed Qualifier' },
  { name: 'Almost Pro Legends 2025 Spring Group Stage' },
  { name: 'Almost Pro Legends 2025 Spring Open Qualifier 1' },
  { name: 'Almost Pro Legends 2025 Spring Open Qualifier 2' },
  { name: 'Almost Pro Legends 2025 Spring Playoffs' },
  { name: 'Almost Pro Legends 2025 Winter Group Stage' },
  { name: 'Almost Pro Legends 2025 Winter Open Qualifier 1' },
  { name: 'Almost Pro Legends 2025 Winter Open Qualifier 2' },
  { name: 'Almost Pro Legends 2025 Winter Playoffs' },
  { name: 'Arab International Tournament' },
  { name: 'Arabian League 2025 Promotion' },
  { name: 'Arabian League 2025 Spring' },
  { name: 'Arabian League 2025 Spring Playoffs' },
  { name: 'Arabian League 2025 Summer Promotion' },
  { name: 'Arabian League 2025 Winter' },
  { name: 'Arabian League 2025 Winter Playoffs' },
  { name: 'Asia Masters 2025 Swiss 1' },
  { name: 'Baron Kupa 2025 Spring' },
  { name: 'Baron Kupa 2025 Spring Qualifier 1' },
  { name: 'Baron Kupa 2025 Spring Qualifier 2' },
  { name: 'Baron Kupa 2025 Winter' },
  { name: 'Baron Kupa 2025 Winter Qualifier 1' },
  { name: 'Baron Kupa 2025 Winter Qualifier 2' },
  { name: 'BCL 2025 Summer' },
  // ... (complète avec tout le JSON)
];

const patterns = [
  name => name.replace(/ /g, '_').toUpperCase() + '-LOGO.png',
  name => name.replace(/ /g, '_').toUpperCase() + '.png',
  name => name.replace(/ /g, '-').toUpperCase() + '-LOGO.png',
  name => name.replace(/ /g, '-').toUpperCase() + '.png',
  name => name.replace(/ /g, '').toUpperCase() + '-LOGO.png',
  name => name.replace(/ /g, '').toUpperCase() + '.png',
  name => name.replace(/ /g, '_') + '-LOGO.png',
  name => name.replace(/ /g, '_') + '.png',
  name => name.replace(/ /g, '-') + '-LOGO.png',
  name => name.replace(/ /g, '-') + '.png',
  name => name.replace(/ /g, '') + '-LOGO.png',
  name => name.replace(/ /g, '') + '.png',
];

const baseUrl = 'https://static.lolesports.com/leagues/';

function checkUrl(url) {
  return new Promise(resolve => {
    https.get(url, res => {
      resolve({ url, status: res.statusCode });
    }).on('error', () => {
      resolve({ url, status: 0 });
    });
  });
}

(async () => {
  let results = [];
  for (const comp of tournaments) {
    let found = false;
    for (const pattern of patterns) {
      const url = baseUrl + pattern(comp.name);
      const { status } = await checkUrl(url);
      if (status === 200) {
        results.push({ name: comp.name, url });
        console.log(`✅ Found: "${comp.name}": "${url}"`);
        found = true;
        break;
      }
    }
    if (!found) {
      results.push({ name: comp.name, url: null });
      console.log(`❌ Not found: "${comp.name}"`);
    }
  }
  fs.writeFileSync('found_lolesports_logos.json', JSON.stringify(results, null, 2));
})();
