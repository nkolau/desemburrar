import fs from 'fs';

const fisicaTopics = {
  basic: [
    "Leis de Newton", "Cinemática", "Eletromagnetismo", "Óptica", 
    "Acústica", "Força", "Energia cinética", "Calor", 
    "Eletricidade", "Inércia"
  ],
  deep: [
    "Teoria das cordas", "Relatividade restrita", "Modelo Padrão", "Emaranhamento quântico", 
    "Eletrodinâmica quântica", "Teoria M", "Princípio da incerteza de Heisenberg", "Supercondutividade", 
    "Física de partículas", "Gravidade quântica"
  ]
};

const referencesPath = './src/data/references.json';
let existingData = [];
try {
  existingData = JSON.parse(fs.readFileSync(referencesPath, 'utf-8'));
} catch (e) {
  existingData = [];
}

let nextId = existingData.length > 0 ? Math.max(...existingData.map(d => d.id)) + 1 : 1;
const results = [...existingData];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWikipedia(title) {
  try {
    const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.type === 'disambiguation' || !data.extract) return null;
    return data;
  } catch (e) {
    return null;
  }
}

async function run() {
  console.log("Adicionando categoria de Física...");
  let addedCount = 0;

  for (const [level, titles] of Object.entries(fisicaTopics)) {
    for (const title of titles) {
      
      // Se já existe com outro nome/categoria, vamos evitar duplicatas exatas,
      // mas se não existir, adicionamos na categoria "Física".
      const exists = results.find(r => r.title.toLowerCase() === title.toLowerCase());
      if (exists) {
        if (exists.category !== "Física") {
          console.log(`Movendo '${title}' para a categoria Física.`);
          exists.category = "Física";
        }
        continue;
      }

      await sleep(800); // 800ms delay to avoid rate limit
      const data = await fetchWikipedia(title);
      
      if (data) {
        results.push({
          id: nextId++,
          title: data.title,
          author_or_source: "Wikipédia",
          description: data.extract,
          category: "Física",
          level: level,
          link: data.content_urls ? data.content_urls.desktop.page : `https://pt.wikipedia.org/wiki/${encodeURIComponent(data.title)}`
        });
        addedCount++;
        console.log(`   + Added: ${data.title} (${level})`);
      } else {
        // Fallback
        results.push({
          id: nextId++,
          title: title,
          author_or_source: "Conhecimento Geral",
          description: `Um conceito fundamental no estudo da Física. (Conteúdo extraído da base).`,
          category: "Física",
          level: level,
          link: `https://pt.wikipedia.org/wiki/${encodeURIComponent(title)}`
        });
        addedCount++;
        console.log(`   + Added (Fallback): ${title} (${level})`);
      }
    }
  }

  fs.writeFileSync(referencesPath, JSON.stringify(results, null, 2));
  console.log(`\nConcluído! ${addedCount} tópicos de Física adicionados/atualizados. Total: ${results.length}`);
}

run();
