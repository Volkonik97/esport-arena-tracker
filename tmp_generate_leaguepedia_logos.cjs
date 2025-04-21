// Script Node.js pour générer automatiquement les URLs de logo Leaguepedia pour toutes les compétitions 2025
const https = require('https');
const fs = require('fs');

// Liste extraite dynamiquement de l'API Leaguepedia (2025)
const tournaments = [
  // Les noms sont extraits du JSON (Name et LeagueIconKey)
  // Format: { name: 'Nom', leagueIconKey: 'Key' }
  { name: '2025 Cross Regional', leagueIconKey: '2025 Cross Regional' },
  { name: '4 Nations 2025 Spring', leagueIconKey: '4 Nations' },
  { name: '4 Nations 2025 Winter', leagueIconKey: '4 Nations' },
  { name: '4 Nations 2025 Winter Playoffs', leagueIconKey: '4 Nations' },
  { name: 'Alior Bank Rift Legends 2025 Spring Open Qualifier 1', leagueIconKey: 'Rift Legends' },
  { name: 'Alior Bank Rift Legends 2025 Spring Open Qualifier 2', leagueIconKey: 'Rift Legends' },
  { name: 'Alior Bank Rift Legends 2025 Spring Promotion', leagueIconKey: 'Rift Legends' },
  { name: 'Almost Pro Legends 2025 Spring Closed Qualifier', leagueIconKey: 'Almost Pro Legends 2025 March' },
  { name: 'Almost Pro Legends 2025 Spring Group Stage', leagueIconKey: 'Almost Pro Legends 2025 March' },
  { name: 'Almost Pro Legends 2025 Spring Open Qualifier 1', leagueIconKey: 'Almost Pro Legends 2025 March' },
  { name: 'Almost Pro Legends 2025 Spring Open Qualifier 2', leagueIconKey: 'Almost Pro Legends 2025 March' },
  { name: 'Almost Pro Legends 2025 Spring Playoffs', leagueIconKey: 'Almost Pro Legends 2025 March' },
  { name: 'Almost Pro Legends 2025 Winter Group Stage', leagueIconKey: 'Almost Pro' },
  { name: 'Almost Pro Legends 2025 Winter Open Qualifier 1', leagueIconKey: 'Almost Pro' },
  { name: 'Almost Pro Legends 2025 Winter Open Qualifier 2', leagueIconKey: 'Almost Pro' },
  { name: 'Almost Pro Legends 2025 Winter Playoffs', leagueIconKey: 'Almost Pro' },
  { name: 'Arab International Tournament', leagueIconKey: 'Arab International Tournament' },
  { name: 'Arabian League 2025 Promotion', leagueIconKey: 'Arabian League' },
  { name: 'Arabian League 2025 Spring', leagueIconKey: 'Arabian League' },
  { name: 'Arabian League 2025 Spring Playoffs', leagueIconKey: 'Arabian League' },
  { name: 'Arabian League 2025 Summer Promotion', leagueIconKey: 'Arabian League' },
  { name: 'Arabian League 2025 Winter', leagueIconKey: 'Arabian League' },
  { name: 'Arabian League 2025 Winter Playoffs', leagueIconKey: 'Arabian League' },
  { name: 'Asia Masters 2025 Swiss 1', leagueIconKey: 'Asia Star Challengers Invitational' },
  { name: 'Baron Kupa 2025 Spring', leagueIconKey: 'Baron Kupa' },
  { name: 'Baron Kupa 2025 Spring Qualifier 1', leagueIconKey: 'Baron Kupa' },
  { name: 'Baron Kupa 2025 Spring Qualifier 2', leagueIconKey: 'Baron Kupa' },
  { name: 'Baron Kupa 2025 Winter', leagueIconKey: 'Baron Kupa' },
  { name: 'Baron Kupa 2025 Winter Qualifier 1', leagueIconKey: 'Baron Kupa' },
  { name: 'Baron Kupa 2025 Winter Qualifier 2', leagueIconKey: 'Baron Kupa' },
  { name: 'BCL 2025 Summer', leagueIconKey: 'Bulgarian Challengers League' },
  // ... (troncature pour la démo, à compléter avec tout le JSON)
];

function leaguepediaLogoUrl(leagueIconKey) {
  if (!leagueIconKey) return null;
  // Format typique des URLs de logo Leaguepedia
  const encoded = encodeURIComponent(leagueIconKey.replace(/ /g, '_'));
  return `https://static.wikia.nocookie.net/lolesports_gamepedia_en/images/0/00/${encoded}_logo.png/revision/latest/scale-to-width-down/220`;
}

async function checkUrl(url) {
  return new Promise(resolve => {
    if (!url) return resolve(false);
    https.get(url, res => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false));
  });
}

(async () => {
  let results = [];
  for (const t of tournaments) {
    const url = leaguepediaLogoUrl(t.leagueIconKey);
    if (url && await checkUrl(url)) {
      results.push({ name: t.name, url });
      console.log(`✅ ${t.name} => ${url}`);
    } else {
      results.push({ name: t.name, url: null });
      console.log(`❌ ${t.name} => NOT FOUND`);
    }
  }
  fs.writeFileSync('found_leaguepedia_logos.json', JSON.stringify(results, null, 2));
})();
