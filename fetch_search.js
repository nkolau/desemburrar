import fs from 'fs';

const searches = ['Filosofia', 'Ciência', 'História', 'Literatura', 'Astronomia', 'Psicologia', 'Arte'];
const referencesPath = './src/data/references.json';

let existingData = [];
try {
  existingData = JSON.parse(fs.readFileSync(referencesPath, 'utf-8'));
} catch (e) {
  existingData = [];
}

let nextId = existingData.length > 0 ? Math.max(...existingData.map(d => d.id)) + 1 : 1;
const results = [...existingData];
let addedCount = 0;
const targetNew = 365; // User specifically asked for 365 topics

async function run() {
  console.log(`Starting to fetch ${targetNew} new topics via Search API...`);
  
  for (const term of searches) {
    if (addedCount >= targetNew) break;
    console.log(`Searching for: ${term}`);
    
    try {
      const searchUrl = `https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&srlimit=80&format=json`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      
      if (!searchData.query || !searchData.query.search) continue;
      
      for (const item of searchData.query.search) {
        if (addedCount >= targetNew) break;
        if (results.find(r => r.title === item.title)) continue;
        
        // Fetch summary
        const summaryUrl = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(item.title)}`;
        const sumRes = await fetch(summaryUrl);
        if (!sumRes.ok) continue;
        const sumData = await sumRes.json();
        
        if (sumData.type === 'disambiguation' || !sumData.extract) continue;
        
        if (!results.find(r => r.title === sumData.title)) {
          results.push({
            id: nextId++,
            title: sumData.title,
            author_or_source: "Wikipédia",
            description: sumData.extract,
            category: term,
            level: Math.random() > 0.5 ? 'deep' : 'basic',
            link: sumData.content_urls ? sumData.content_urls.desktop.page : `https://pt.wikipedia.org/wiki/${encodeURIComponent(sumData.title)}`
          });
          addedCount++;
          console.log(`Added ${addedCount}/${targetNew}: ${sumData.title}`);
        }
        
        await new Promise(r => setTimeout(r, 50));
      }
    } catch (e) {
      console.log(`Error on search term ${term}:`, e);
    }
  }
  
  fs.writeFileSync(referencesPath, JSON.stringify(results, null, 2));
  console.log(`\nSuccess! Added ${addedCount} topics. Total is now ${results.length} topics in references.json.`);
}

run();
