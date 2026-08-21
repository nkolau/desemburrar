import fs from 'fs';

// We are going to fetch precisely 365 curated, high-quality themes from the Portuguese Wikipedia.
const topics = [
  "Sócrates", "Aristóteles", "Platão", "Immanuel Kant", "Friedrich Nietzsche", "René Descartes", "John Locke", 
  "Jean-Jacques Rousseau", "Voltaire", "Karl Marx", "Friedrich Engels", "Arthur Schopenhauer", 
  "Søren Kierkegaard", "Sigmund Freud", "Carl Jung", "Jean-Paul Sartre", "Simone de Beauvoir", 
  "Albert Camus", "Michel Foucault", "Jacques Derrida", "Gilles Deleuze", "Hannah Arendt", 
  "Nicolau Maquiavel", "Thomas Hobbes", "Baruch Spinoza", "David Hume", "Gottfried Wilhelm Leibniz", 
  "Agostinho de Hipona", "Tomás de Aquino", "Confúcio", "Laozi", "Siddhartha Gautama",
  "Física Quântica", "Relatividade Geral", "Relatividade Restrita", "Big Bang", "Buraco negro", 
  "Matéria escura", "Energia escura", "Teoria das cordas", "Modelo Padrão", "Bóson de Higgs", 
  "Antimatéria", "Paradoxo de Fermi", "Equação de Drake", "Mecânica Quântica", "Gravidade", 
  "Termodinâmica", "Entropia", "Princípio da Incerteza", "Gato de Schrödinger", "Emaranhamento quântico",
  "Evolução", "Seleção natural", "Ácido desoxirribonucleico", "Genética", "CRISPR", "Epigenética", "Célula-tronco", 
  "Vírus", "Sistema imunitário", "Neurociência", "Neuroplasticidade", "Dopamina", "Serotonina",
  "Inteligência artificial", "Aprendizado de máquina", "Rede neural artificial", "Computação quântica", 
  "Criptografia", "Blockchain", "Internet das coisas", "Realidade virtual", "Realidade aumentada",
  "Revolução Francesa", "Revolução Russa", "Revolução Industrial", "Revolução Americana", 
  "Primeira Guerra Mundial", "Segunda Guerra Mundial", "Guerra Fria", "Guerra do Vietnã", 
  "Guerra da Coreia", "Império Romano", "Grécia Antiga", "Antigo Egito", "Mesopotâmia", 
  "Idade Média", "Cruzadas", "Peste Negra", "Renascimento", "Iluminismo", "Reforma Protestante", 
  "Império Otomano", "Império Asteca", "Império Inca", "Descobrimento do Brasil", 
  "Independência do Brasil", "Proclamação da República do Brasil", "Era Vargas", "Ditadura militar brasileira",
  "Democracia", "República", "Monarquia", "Anarquismo", "Comunismo", "Socialismo", "Capitalismo", 
  "Fascismo", "Nazismo", "Liberalismo", "Neoliberalismo", "Conservadorismo", "Social-democracia", 
  "Geopolítica", "Globalização", "Organização das Nações Unidas", "União Europeia", "OTAN",
  "O Pequeno Príncipe", "Dom Quixote", "Os Lusíadas", "A Divina Comédia", "Hamlet", "Romeu e Julieta", 
  "Macbeth", "Ilíada", "Odisseia", "Eneida", "Fausto", "Os Miseráveis", "Crime e Castigo", 
  "Os Irmãos Karamazov", "Guerra e Paz", "Anna Karenina", "Cem Anos de Solidão", "Dom Casmurro", 
  "Memórias Póstumas de Brás Cubas", "Grande Sertão: Veredas", "Macunaíma", "A Metamorfose", 
  "1984 (livro)", "Revolução dos Bichos", "Admirável Mundo Novo", "O Senhor dos Anéis", "Harry Potter", 
  "Fahrenheit 451", "O Conto da Aia", "O Morro dos Ventos Uivantes", "Orgulho e Preconceito",
  "Leonardo da Vinci", "Michelangelo", "Vincent van Gogh", "Pablo Picasso", "Salvador Dalí", 
  "Claude Monet", "Frida Kahlo", "Diego Rivera", "Tarsila do Amaral", "Candido Portinari", 
  "Romantismo", "Realismo", "Impressionismo", "Expressionismo", "Cubismo", "Surrealismo", 
  "Arte abstrata", "Pop art", "Barroco", "Rococó", "Arquitetura gótica",
  "Ludwig van Beethoven", "Wolfgang Amadeus Mozart", "Johann Sebastian Bach", "Frédéric Chopin", "Igor Stravinsky", 
  "Jazz", "Blues", "Rock and roll", "Bossa nova", "Samba", "Tropicália", "Hip hop",
  "Cinema", "História do cinema", "Nouvelle Vague", "Neorrealismo italiano", "Cinema de Hollywood",
  "Psicanálise", "Behaviorismo", "Psicologia cognitiva", "Psicologia analítica", "Gestalt", 
  "Efeito Dunning-Kruger", "Viés de confirmação", "Dissonância cognitiva", "Falácia do custo irrecuperável", 
  "Hierarquia de necessidades de Maslow", "Complexo de Édipo", "Arquétipo",
  "Matemática", "Geometria", "Álgebra", "Cálculo", "Estatística", "Teoria das probabilidades", 
  "Teoria dos números", "Teoria dos grafos", "Infinito", "Pi", "Proporção áurea", 
  "Teorema de Pitágoras", "Último Teorema de Fermat", "Hipótese de Riemann", "Teoremas da incompletude de Gödel",
  "Mudança do clima", "Efeito estufa", "Aquecimento global", "Biodiversidade", "Desmatamento", 
  "Energia renovável", "Energia nuclear", "Sustentabilidade",
  "Isaac Newton", "Galileu Galilei", "Johannes Kepler", "Nicolau Copérnico", "Charles Darwin", 
  "Albert Einstein", "Nikola Tesla", "Thomas Edison", "Marie Curie", "Stephen Hawking", 
  "Carl Sagan", "Richard Feynman",
  "Arquitetura", "Engenharia civil", "Pirâmides do Egito", "Coliseu", "Muralha da China", 
  "Taj Mahal", "Machu Picchu", "Torre Eiffel", "Estátua da Liberdade",
  "Feminismo", "Movimento dos direitos civis", "Abolicionismo", "Sufrágio feminino",
  "Budismo", "Cristianismo", "Islão", "Hinduísmo", "Judaísmo", "Taoísmo", "Xintoísmo",
  "Mitologia grega", "Mitologia nórdica", "Mitologia egípcia", "Mitologia tupi-guarani",
  "Agropecuária", "Revolução Verde", "Microbiologia", "Nanotecnologia", "Biotecnologia",
  "Telescópio Espacial Hubble", "Telescópio Espacial James Webb", "Apollo 11", "Estação Espacial Internacional",
  "Oceano", "Atmosfera", "Placas tectônicas", "Vulcão", "Terremoto", "Tsunami",
  "Tabela periódica", "Átomo", "Elétron", "Próton", "Nêutron", "Quark",
  "Direito", "Constituição", "Declaração Universal dos Direitos Humanos",
  "Lógica", "Silogismo", "Paradoxo", "Paradoxo do mentiroso", "Navalha de Ockham",
  "Amor", "Felicidade", "Tristeza", "Medo", "Ansiedade", "Depressão",
  "Estoicismo", "Epicurismo", "Cinismo", "Ceticismo", "Nihilismo", "Existencialismo", "Pragmatismo",
  "Romance", "Poesia", "Teatro", "Tragédia", "Comédia",
  "Fotografia", "Pintura", "Escultura", "Dança", "Música",
  "Jogos Olímpicos", "Copa do Mundo FIFA",
  "Sistema Solar", "Sol", "Lua", "Terra", "Marte", "Júpiter", "Saturno",
  "Via Láctea", "Galáxia de Andrômeda", "Buraco negro supermassivo",
  "Internet", "World Wide Web", "Rede social", "Algoritmo",
  "Software livre", "Open source", "Linux",
  "Economia", "Inflação", "Deflação", "Produto interno bruto", "Bolsa de valores",
  "Antropologia", "Sociologia", "Ciência política", "Filosofia da mente", "Filosofia da ciência",
  "Educação", "Pedagogia", "Andragogia",
  "Veganismo", "Vegetarianismo",
  "Pandemia", "Vacina", "Antibiótico",
  "Dinossauros", "Extinção",
  "Idioma", "Linguística", "Esperanto",
  "Cérebro", "Coração", "Célula",
  "Astrologia", "Alquimia",
  "Hipótese da simulação", "Multiverso",
  "Viagem no tempo", "Teletransporte",
  "Clonagem", "Organismo geneticamente modificado",
  "Autismo", "Transtorno do déficit de atenção com hiperatividade",
  "Microplástico", "Poluição",
  "Bateria de íon-lítio", "Célula a combustível",
  "Fusão nuclear", "Fissão nuclear",
  "Radiação", "Radioatividade",
  "Buraco de minhoca", "Velocidade da luz",
  "Som", "Luz", "Espectro eletromagnético",
  "Magnetismo", "Eletricidade",
  "Bússola", "Pólvora", "Papel", "Imprensa",
  "Máquina a vapor", "Motor de combustão interna",
  "Avião", "Helicóptero", "Submarino",
  "Satélite artificial", "Sistema de Posicionamento Global",
  "Microprocessador", "Transistor",
  "Rádio", "Televisão", "Telefone", "Smartphone",
  "Livro", "Biblioteca", "Museu",
  "Demografia", "Mortalidade infantil", "Expectativa de vida",
  "Migração humana", "Refugiado",
  "Cultura", "Tradição", "Folclore",
  "Carnaval", "Festa Junina",
  "Saci", "Curupira", "Iara",
  "Floresta Amazônica", "Cerrado", "Mata Atlântica", "Caatinga", "Pantanal", "Pampa",
  "Rio Amazonas", "Rio Nilo",
  "Monte Everest", "Fossa das Marianas",
  "Deserto do Saara", "Antártida",
  "Pinguim", "Urso-polar", "Baleia-azul", "Ornitorrinco",
  "Café", "Chá", "Cacau",
  "Ouro", "Prata", "Ferro", "Cobre",
  "Diamante", "Rubi", "Esmeralda",
  "Oxigênio", "Carbono", "Hidrogênio", "Nitrogênio",
  "Água", "Fogo", "Ar",
  "Quatro elementos",
  "Chacra", "Ioga", "Meditação",
  "Acupuntura", "Medicina tradicional chinesa",
  "Astecas", "Incas", "Maias",
  "Samurai", "Ninja", "Império do Japão",
  "Viquingues", "Pirataria",
  "Atlântida", "Triângulo das Bermudas",
  "Vida extraterrestre", "Objeto voador não identificado",
  "Monstro do Lago Ness", "Pé-grande",
  "Inteligência", "Criatividade", "Memória",
  "Sonho", "Sono", "Insônia",
  "Estresse", "Resiliência",
  "Amizade", "Família",
  "Mentira", "Verdade", "Ética", "Moral",
  "Justiça", "Liberdade", "Igualdade",
  "Beleza", "Estética",
  "Tempo", "Espaço",
  "Infinito", "Vazio",
  "Deus", "Ateísmo", "Agnosticismo",
  "Morte", "Vida", "Consciência",
  "Realidade", "Ilusão",
  "Jogos Olímpicos de Inverno", "Jogos Paralímpicos",
  "Xadrez", "Go", "Pôquer",
  "Futebol", "Basquetebol", "Voleibol", "Tênis",
  "Automobilismo", "Fórmula 1",
  "Dança de salão", "Balé",
  "Moda", "Alta-costura",
  "Gastronomia", "Culinária",
  "Agricultura", "Pecuária",
  "Indústria", "Comércio", "Setor terciário",
  "Turismo", "Ecoturismo",
  "Geografia", "Cartografia",
  "Meteorologia", "Climatologia",
  "Paleontologia", "Arqueologia",
  "Etimologia", "Gramática",
  "Poesia épica", "Poesia lírica",
  "Ficção científica", "Fantasia", "Filme de terror",
  "Ficção de mistério", "Suspense",
  "Biografia", "Autobiografia",
  "Diário", "Ensaio",
  "Jornalismo", "Reportagem",
  "Relações internacionais", "Diplomacia"
];

const moreTopics = [
  "O Capital", "Utopia (livro)", "A Riqueza das Nações", "Leviatã (livro)", 
  "Crítica da Razão Prática", "Assim Falou Zaratustra", "O Príncipe", 
  "A Arte da Guerra", "Tao Te Ching", "Bíblia", "Alcorão", "Torá", 
  "Vedas", "Upanixades", "Mahabharata", "Ramayana", "Guerra e Paz"
];

const allTopics = Array.from(new Set([...topics, ...moreTopics]));

const referencesPath = './src/data/references.json';
let existingData = [];
try {
  existingData = JSON.parse(fs.readFileSync(referencesPath, 'utf-8'));
} catch (e) {
  console.log("No existing data found, starting fresh.");
}

let nextId = existingData.length > 0 ? Math.max(...existingData.map(d => d.id)) + 1 : 1;
const results = [...existingData];

async function fetchWikipedia(title) {
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
      category: "Conhecimento Geral", // Broad category for fetched content
      level: Math.random() > 0.5 ? 'basic' : 'deep',
      link: data.content_urls ? data.content_urls.desktop.page : `https://pt.wikipedia.org/wiki/${encodeURIComponent(title)}`
    };
  } catch (error) {
    return null;
  }
}

async function populate() {
  console.log(`Starting to fetch ${allTopics.length} topics...`);
  
  let successCount = 0;
  for (let i = 0; i < allTopics.length; i++) {
    const topic = allTopics[i];
    process.stdout.write(`Fetching ${i+1}/${allTopics.length}: ${topic}... `);
    
    const item = await fetchWikipedia(topic);
    if (item) {
      // Check if it's already in the DB to avoid duplicates
      if (!results.find(r => r.title === item.title)) {
        results.push(item);
        successCount++;
        console.log('OK');
      } else {
         console.log('DUPLICATE');
      }
    } else {
      console.log('FAILED or DISAMBIGUATION');
    }

    await new Promise(r => setTimeout(r, 100));
    
    if (successCount >= 365) {
      console.log(`\nReached exactly 365 new topics! Stopping.`);
      break;
    }
  }

  fs.writeFileSync(referencesPath, JSON.stringify(results, null, 2));
  console.log(`\nSuccess! Wrote total ${results.length} topics to references.json.`);
}

populate();
