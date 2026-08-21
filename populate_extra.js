import fs from 'fs';

const extraTitles = {
  "Filosofia": ["Cinismo", "Ceticismo", "Idealismo", "Utilitarismo", "Filosofia analítica", "Filosofia continental", "Estética", "Lógica formal", "Hermenêutica", "Escolástica"],
  "Física": ["Termologia", "Hidrostática", "Mecânica clássica", "Efeito Doppler", "Física nuclear", "Física de plasmas", "Efeito fotoelétrico", "Dinâmica dos fluidos", "Física do estado sólido", "Óptica quântica"],
  "Ciência": ["Biologia celular", "Botânica", "Zoologia", "Ecologia", "Genoma", "Bioquímica", "Oceanografia", "Meteorologia", "Paleontologia", "Virologia"],
  "História": ["Idade do Bronze", "Era Viking", "Cruzadas", "Guerra dos Cem Anos", "Império Otomano", "Guerra do Vietnã", "Queda do Muro de Berlim", "Apartheid", "Revolução Cubana", "Primavera Árabe"],
  "Literatura": ["Naturalismo", "Trovadorismo", "Barroco", "Arcadismo", "Modernismo", "Pós-modernismo", "Poesia épica", "Poesia lírica", "Drama", "Romance de formação"],
  "Astronomia": ["Anã branca", "Estrela de nêutrons", "Cinturão de asteroides", "Cometa", "Constelação", "Galáxia espiral", "Buraco de minhoca", "Telescópio espacial James Webb", "Nebulosa", "Aglomerado estelar"],
  "Psicologia": ["Terapia cognitivo-comportamental", "Psicopatologia", "Transtorno de ansiedade", "Depressão", "Neurociência cognitiva", "Psicologia social", "Psicologia do desenvolvimento", "Teste de Rorschach", "Hipnose", "Complexo de inferioridade"],
  "Arte": ["Pós-impressionismo", "Romantismo", "Rococó", "Arte gótica", "Arte românica", "Arte islâmica", "Arte contemporânea", "Expressionismo", "Futurismo", "De Stijl"],
  "Matemática": ["Probabilidade", "Estatística", "Trigonometria", "Logaritmo", "Matriz (matemática)", "Determinante", "Geometria analítica", "Números complexos", "Análise combinatória", "Sequência de Fibonacci"],
  "Sociologia": ["Positivismo", "Luta de classes", "Ação afirmativa", "Movimento social", "Globalização", "Etnocentrismo", "Relativismo cultural", "Estratificação social", "Sociologia urbana", "Sociologia do trabalho"],
  "Tecnologia": ["Computação em nuvem", "Cibersegurança", "Edge computing", "5G", "Big data", "Automação", "Sistema operativo", "Código aberto", "Interface de usuário", "Internet das coisas"],
  "Política": ["Conservadorismo", "Liberalismo", "Socialismo", "Comunismo", "Anarcocapitalismo", "Sistema eleitoral", "Parlamentarismo", "Presidencialismo", "Direitos humanos", "Políticas públicas"],
  "Mitologia": ["Mitologia hindu", "Mitologia japonesa", "Mitologia eslava", "Mitologia inca", "Mitologia maia", "Mitologia asteca", "Amaterasu", "Shiva", "Quetzalcóatl", "Panteão"]
};

const referencesPath = './src/data/references.json';
let existingData = JSON.parse(fs.readFileSync(referencesPath, 'utf-8'));
let nextId = existingData.length > 0 ? Math.max(...existingData.map(d => d.id)) + 1 : 1;
const results = [...existingData];

const sleep = ms => new Promise(r => setTimeout(r, ms));

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
  console.log("Iniciando a carga extra massiva de temas...");
  let addedCount = 0;

  for (const [category, titles] of Object.entries(extraTitles)) {
    let toggleLevel = true; // alternar entre basic e deep para equilibrar

    for (const title of titles) {
      const level = toggleLevel ? 'basic' : 'deep';
      toggleLevel = !toggleLevel;

      const exists = results.find(r => r.title.toLowerCase() === title.toLowerCase());
      if (exists) continue;

      await sleep(500); // 500ms para evitar bloqueios da Wikipédia
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
        console.log(`+ Adicionado: ${data.title} (${category} - ${level})`);
      }
    }
  }

  fs.writeFileSync(referencesPath, JSON.stringify(results, null, 2));
  console.log(`\nCarga concluída! ${addedCount} novos temas inseridos. Total na base: ${results.length}`);
}

run();
