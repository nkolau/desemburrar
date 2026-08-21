import fs from 'fs';

const categories = [
  'Categoria:Conceitos_filosóficos',
  'Categoria:Teorias_da_física',
  'Categoria:Movimentos_artísticos',
  'Categoria:Ramos_da_psicologia',
  'Categoria:Civilizações_antigas',
  'Categoria:Astronomia',
  'Categoria:Conceitos_da_sociologia',
  'Categoria:Teorias_da_biologia',
  'Categoria:Obras_literárias',
  'Categoria:Ramos_da_matemática'
];

const referencesPath = './src/data/references.json';
let existingData = JSON.parse(fs.readFileSync(referencesPath, 'utf-8'));
let nextId = Math.max(...existingData.map(d => d.id)) + 1;
const results = [...existingData];
let addedCount = 0;

async function fetchFromCategory(category) {
  try {
    // Fetch members of category
    const listUrl = `https://pt.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=${encodeURIComponent(category)}&cmlimit=100&cmnamespace=0&format=json`;
    const res = await fetch(listUrl);
    const data = await res.json();
    if (!data.query || !data.query.categorymembers) return [];
    
    return data.query.categorymembers.map(m => m.title);
  } catch (e) {
    return [];
  }
}

async function fetchDetails(title) {
  try {
    const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    
    if (data.type === 'disambiguation' || !data.extract) return null;

    return {
      id: nextId++,
      title: data.title,
      author_or_source: "Wikipédia",
      description: data.extract,
      category: "Conhecimento Geral",
      level: Math.random() > 0.4 ? 'deep' : 'basic',
      link: data.content_urls ? data.content_urls.desktop.page : `https://pt.wikipedia.org/wiki/${encodeURIComponent(title)}`
    };
  } catch (error) {
    return null;
  }
}

async function run() {
  console.log("Starting batch fetch for exactly 365 new items...");
  
  for (const cat of categories) {
    console.log(`Fetching category: ${cat}`);
    const titles = await fetchFromCategory(cat);
    
    for (const title of titles) {
      if (addedCount >= 365) break;
      if (results.find(r => r.title === title)) continue; // avoid exact duplicates
      
      const item = await fetchDetails(title);
      if (item) {
        if (!results.find(r => r.title === item.title)) {
          results.push(item);
          addedCount++;
          console.log(`Added ${addedCount}/365: ${item.title}`);
        }
      }
      // slight delay
      await new Promise(r => setTimeout(r, 50));
    }
    if (addedCount >= 365) break;
  }
  
  fs.writeFileSync(referencesPath, JSON.stringify(results, null, 2));
  console.log(`\nSuccess! Wrote total ${results.length} topics to references.json.`);
}

run();
