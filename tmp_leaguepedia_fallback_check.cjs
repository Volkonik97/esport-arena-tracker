// Script temporaire pour obtenir les URLs Leaguepedia
const axios = require('axios');

const teams = [
  'KIA.eSuba Academy',
  'KIAeSuba Academy',
  'Gen.G Scholars',
  'GenG Scholars'
];

async function fetchLogo(team) {
  const url = `https://lol.fandom.com/api.php?action=query&format=json&prop=pageimages&titles=${encodeURIComponent(team)}&pithumbsize=220&origin=*`;
  const { data } = await axios.get(url);
  const pages = data.query.pages;
  const page = Object.values(pages)[0];
  return page.thumbnail ? page.thumbnail.source : null;
}

(async () => {
  for (const team of teams) {
    const logo = await fetchLogo(team);
    console.log(`${team}: ${logo}`);
  }
})();
