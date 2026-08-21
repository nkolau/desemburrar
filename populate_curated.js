import fs from 'fs';

const curatedTopics = {
  Filosofia: {
    basic: ["Sócrates", "Platão", "Aristóteles", "Estoicismo", "Epicurismo", "Iluminismo", "René Descartes", "Empirismo", "Racionalismo", "Ética"],
    deep: ["Niilismo", "Fenomenologia", "Immanuel Kant", "Friedrich Nietzsche", "Michel Foucault", "Arthur Schopenhauer", "Jean-Paul Sartre", "Existencialismo", "Epistemologia", "Solipsismo"]
  },
  Ciência: {
    basic: ["Método científico", "Gravidade", "Evolução", "Tabela periódica", "Átomo", "Célula", "Fotossíntese", "Efeito estufa", "Água", "Oxigênio"],
    deep: ["Mecânica quântica", "Relatividade geral", "Bóson de Higgs", "Termodinâmica", "Epigenética", "Antimatéria", "Teoria do caos", "Fissão nuclear", "CRISPR", "Matéria escura"]
  },
  História: {
    basic: ["Roma Antiga", "Antigo Egito", "Grécia Antiga", "Revolução Francesa", "Revolução Industrial", "Primeira Guerra Mundial", "Segunda Guerra Mundial", "Guerra Fria", "Idade Média", "Descobrimento do Brasil"],
    deep: ["Império Bizantino", "Guerra dos Trinta Anos", "Revolução Russa", "Primavera dos Povos", "Guerra do Peloponeso", "Tratado de Tordesilhas", "Revolução Haitiana", "Império Khmer", "Guerra das Rosas", "Guerra Civil Americana"]
  },
  Literatura: {
    basic: ["Dom Quixote", "Os Lusíadas", "William Shakespeare", "Machado de Assis", "Romantismo", "Realismo", "Poesia", "Tragédia", "A Divina Comédia", "Conto"],
    deep: ["Realismo mágico", "Fluxo de consciência", "James Joyce", "Fiódor Dostoiévski", "Parnasianismo", "Simbolismo", "Marcel Proust", "Franz Kafka", "Geração Beat", "Metalinguagem"]
  },
  Astronomia: {
    basic: ["Sistema Solar", "Sol", "Lua", "Terra", "Marte", "Via Láctea", "Estrela", "Planeta", "Eclipse", "Telescópio"],
    deep: ["Buraco negro", "Radiação cósmica de fundo", "Pulsar", "Quasar", "Exoplaneta", "Supernova", "Matéria escura", "Energia escura", "Paradoxo de Fermi", "Esfera de Dyson"]
  },
  Psicologia: {
    basic: ["Psicanálise", "Sigmund Freud", "Inconsciente", "Emoção", "Memória", "Comportamento", "Inteligência", "Personalidade", "Estresse", "Sonho"],
    deep: ["Carl Jung", "Arquétipo", "Behaviorismo radical", "Dissonância cognitiva", "Teoria da Gestalt", "Neuroplasticidade", "Efeito Dunning-Kruger", "Psicologia analítica", "Hierarquia de necessidades de Maslow", "Complexo de Édipo"]
  },
  Arte: {
    basic: ["Renascimento", "Leonardo da Vinci", "Pablo Picasso", "Impressionismo", "Vincent van Gogh", "Escultura", "Pintura", "Arquitetura gótica", "Cubismo", "Música clássica"],
    deep: ["Dadaísmo", "Surrealismo", "Expressionismo abstrato", "Suprematismo", "Arte conceitual", "Bauhaus", "Minimalismo", "Pop art", "Fauvismo", "Neoclassicismo"]
  },
  Matemática: {
    basic: ["Geometria", "Álgebra", "Adição", "Fração", "Pi", "Triângulo", "Círculo", "Teorema de Pitágoras", "Número primo", "Matemática financeira"],
    deep: ["Cálculo", "Equação diferencial", "Infinito", "Teoria dos grafos", "Hipótese de Riemann", "Teoremas da incompletude de Gödel", "Fractal", "Topologia", "Último Teorema de Fermat", "Proporção áurea"]
  },
  Sociologia: {
    basic: ["Sociedade", "Cultura", "Socialização", "Classe social", "Desigualdade social", "Karl Marx", "Estado", "Cidadania", "Família", "Educação"],
    deep: ["Émile Durkheim", "Max Weber", "Anomia", "Fato social", "Ação social", "Capital cultural", "Hegemonia", "Panóptico", "Interacionismo simbólico", "Materialismo histórico"]
  },
  Tecnologia: {
    basic: ["Internet", "Computador", "Smartphone", "Inteligência artificial", "Rede social", "Algoritmo", "Software", "Hardware", "Robótica", "Wi-Fi"],
    deep: ["Computação quântica", "Blockchain", "Aprendizado de máquina", "Criptografia", "Internet das coisas", "Realidade virtual", "Realidade aumentada", "Rede neural artificial", "Nanotecnologia", "Biotecnologia"]
  },
  Política: {
    basic: ["Democracia", "República", "Monarquia", "Ditadura", "Constituição", "Poder Executivo", "Poder Legislativo", "Poder Judiciário", "Eleição", "Cidadão"],
    deep: ["Contrato social", "Realpolitik", "Totalitarismo", "Fascismo", "Anarquismo", "Neoliberalismo", "Geopolítica", "Social-democracia", "Oligarquia", "Soberania"]
  },
  Mitologia: {
    basic: ["Zeus", "Thor", "Mitologia grega", "Mitologia nórdica", "Deus", "Hércules", "Poseidon", "Atena", "Odin", "Loki"],
    deep: ["Enuma Elish", "Ragnarök", "Matéria da Bretanha", "Mitologia iorubá", "Gilgamesh", "Mitologia tupi-guarani", "Quetzalcóatl", "Mitologia celta", "Yggdrasil", "Cosmogonia"]
  }
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

// Delay helper to avoid API rate limits (HTTP 429)
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
  console.log("Starting Curated Content Injection...");
  let addedCount = 0;

  for (const [category, levels] of Object.entries(curatedTopics)) {
    for (const [level, titles] of Object.entries(levels)) {
      
      // Filter existing items for this category and level
      const currentCount = results.filter(r => r.category === category && r.level === level).length;
      let needed = Math.max(0, 10 - currentCount);
      
      if (needed === 0) {
        console.log(`[${category} - ${level}] Already has ${currentCount} items. Skipping.`);
        continue;
      }
      
      console.log(`[${category} - ${level}] Needs ${needed} more items. Processing curated list...`);

      for (const title of titles) {
        if (needed === 0) break;
        if (results.find(r => r.title.toLowerCase() === title.toLowerCase())) continue; // already have it

        await sleep(800); // 800ms delay to NEVER hit Wikipedia's rate limit
        const data = await fetchWikipedia(title);
        
        if (data) {
          results.push({
            id: nextId++,
            title: data.title,
            author_or_source: "Wikipédia",
            description: data.extract,
            category: category,
            level: level,
            link: data.content_urls ? data.content_urls.desktop.page : `https://pt.wikipedia.org/wiki/${encodeURIComponent(data.title)}`
          });
          addedCount++;
          needed--;
          console.log(`   + Added: ${data.title} (${level})`);
        } else {
          // Fallback if wikipedia API fails or disambiguates
          results.push({
            id: nextId++,
            title: title,
            author_or_source: "Conhecimento Geral",
            description: `Um conceito importante no estudo da ${category}. (Conteúdo extraído do arquivo essencial).`,
            category: category,
            level: level,
            link: `https://pt.wikipedia.org/wiki/${encodeURIComponent(title)}`
          });
          addedCount++;
          needed--;
          console.log(`   + Added (Fallback): ${title} (${level})`);
        }
      }
    }
  }

  fs.writeFileSync(referencesPath, JSON.stringify(results, null, 2));
  console.log(`\nDone! Added ${addedCount} missing topics. Total in DB: ${results.length}`);
}

run();
