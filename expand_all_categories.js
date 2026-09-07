import fs from 'fs';

const newTopics = [
  // FILOSOFIA (10)
  {
    title: "Imperativo Categórico",
    author_or_source: "Immanuel Kant",
    description: "Princípio ético universal que determina que você deve agir apenas segundo uma máxima que você possa, ao mesmo tempo, desejar que se torne uma lei universal.",
    category: "Filosofia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Imperativo_categ%C3%B3rico"
  },
  {
    title: "O Mito de Sísifo",
    author_or_source: "Albert Camus",
    description: "Ensaio existencialista sobre o absurdo da condição humana, propondo que a rebeldia e a aceitação consciente da vida tornam o indivíduo livre e pleno.",
    category: "Filosofia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/O_Mito_de_S%C3%ADsifo"
  },
  {
    title: "Tabula Rasa",
    author_or_source: "John Locke",
    description: "Tese empírica fundamental que defende que a mente humana nasce como uma 'folha em branco', sendo todo conhecimento construído através da experiência sensorial.",
    category: "Filosofia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/T%C3%A1bula_rasa"
  },
  {
    title: "Teoria das Formas",
    author_or_source: "Platão",
    description: "Doutrina que sustenta que o mundo sensível é uma cópia imperfeita do mundo inteligível, onde residem as ideias e formas puras, imutáveis e eternas.",
    category: "Filosofia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Teoria_das_ideias"
  },
  {
    title: "Amor Fati",
    author_or_source: "Friedrich Nietzsche",
    description: "Expressão latina que significa 'amor ao destino'. Propõe amar a própria vida em sua totalidade, incluindo os erros, dores e sofrimentos necessários ao crescimento.",
    category: "Filosofia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Amor_fati"
  },
  {
    title: "Ceticismo Pirrônico",
    author_or_source: "Pirro de Élis",
    description: "Corrente filosófica helenística que busca a tranquilidade da alma (ataraxia) através da suspensão de todo julgamento dogmático sobre a verdade absoluta.",
    category: "Filosofia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Pirronismo"
  },
  {
    title: "Navalha de Hanlon",
    author_or_source: "Robert J. Hanlon",
    description: "Regra prática de pensamento que afirma: 'Nunca atribua à malícia o que pode ser adequadamente explicado pela incompetência ou descuido'.",
    category: "Filosofia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Navalha_de_Hanlon"
  },
  {
    title: "O Homem Cordial",
    author_or_source: "Sérgio Buarque de Holanda",
    description: "Conceito clássico do pensamento brasileiro em 'Raízes do Brasil', que explica a tendência de guiar ações públicas e sociais pelo afeto, emoção e intimidade em vez de leis impessoais.",
    category: "Filosofia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Homem_cordial"
  },
  {
    title: "Ética a Nicômaco",
    author_or_source: "Aristóteles",
    description: "Tratado central sobre a busca da felicidade (eudaimonia) através da prática das virtudes e da doutrina do 'meio-termo' ou justa medida.",
    category: "Filosofia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/%C3%89tica_a_Nic%C3%B4maco"
  },
  {
    title: "Fenomenologia do Espírito",
    author_or_source: "G. W. F. Hegel",
    description: "Obra monumental que descreve a evolução dialética da consciência humana, da percepção mais elementar até o saber absoluto e o autoconhecimento coletivo.",
    category: "Filosofia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Fenomenologia_do_Esp%C3%ADrito"
  },

  // FÍSICA (10)
  {
    title: "Princípio de Bernoulli",
    author_or_source: "Daniel Bernoulli",
    description: "Regra hidrodinâmica que estabelece que o aumento na velocidade de um fluido ocorre simultaneamente com a diminuição da pressão estática, explicando a sustentação das asas de aviões.",
    category: "Física",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Princ%C3%ADpio_de_Bernoulli"
  },
  {
    title: "Efeito Túnel Quântico",
    author_or_source: "Mecânica Quântica",
    description: "Fenômeno quântico em que partículas subatômicas conseguem atravessar barreiras de energia potencialmente intransponíveis pela física clássica.",
    category: "Física",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Efeito_t%C3%BAnel"
  },
  {
    title: "Gaiola de Faraday",
    author_or_source: "Michael Faraday",
    description: "Blindagem eletrostática formada por condutores que impede que campos elétricos externos penetrem no interior de um compartimento, protegendo equipamentos e pessoas.",
    category: "Física",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Gaiola_de_Faraday"
  },
  {
    title: "Efeito Casimir",
    author_or_source: "Hendrik Casimir",
    description: "Força física atrativa microscópica observada entre duas placas metálicas paralelas não carregadas no vácuo, provocada por flutuações quânticas do vácuo.",
    category: "Física",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Efeito_Casimir"
  },
  {
    title: "Radiação Cherenkov",
    author_or_source: "Pavel Cherenkov",
    description: "Brilho azul característico emitido quando uma partícula carregada viaja através de um meio dielétrico com velocidade superior à velocidade da luz naquele mesmo meio.",
    category: "Física",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Radia%C3%A7%C3%A3o_Cherenkov"
  },
  {
    title: "Entropia e Segunda Lei da Termodinâmica",
    author_or_source: "Rudolf Clausius",
    description: "Lei universal que determina que a desordem ou entropia de um sistema isolado tende invariavelmente a aumentar com o tempo, definindo a 'flecha do tempo'.",
    category: "Física",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Segunda_lei_da_termodin%C3%A2mica"
  },
  {
    title: "Refração e Lei de Snell-Descartes",
    author_or_source: "Óptica Geométrica",
    description: "Mudança na direção e velocidade de propagação de uma onda luminosa ao passar de um meio transparente para outro com índice de refração diferente.",
    category: "Física",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Refra%C3%A7%C3%A3o"
  },
  {
    title: "Condensado de Bose-Einstein",
    author_or_source: "Satyendra Nath Bose e Albert Einstein",
    description: "Quinto estado da matéria obtido em temperaturas próximas ao zero absoluto, onde milhares de átomos se comportam coletivamente como uma única onda quântica gigante.",
    category: "Física",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Condensado_de_Bose-Einstein"
  },
  {
    title: "Força Centrípeta",
    author_or_source: "Mecânica Newtoniana",
    description: "Força resultante que atrai um corpo em movimento curvilíneo em direção ao centro da curvatura, permitindo trajetórias circulares estáveis.",
    category: "Física",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/For%C3%A7a_centr%C3%ADpeta"
  },
  {
    title: "Lei de Gravitação Universal",
    author_or_source: "Isaac Newton",
    description: "Lei que estabelece que dois corpos se atraem com uma força diretamente proporcional ao produto de suas massas e inversamente proporcional ao quadrado da distância entre eles.",
    category: "Física",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Lei_da_gravita%C3%A7%C3%A3o_universal"
  },

  // CIÊNCIA (10)
  {
    title: "Teoria Endossimbiótica",
    author_or_source: "Lynn Margulis",
    description: "Teoria evolutiva revolucionária que propõe que mitocôndrias e cloroplastos se originaram de bactérias primitivas que foram englobadas por células hospedeiras.",
    category: "Ciência",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Endossimbiose"
  },
  {
    title: "Ciclo de Krebs",
    author_or_source: "Hans Adolf Krebs",
    description: "Complexa sequência metabólica na respiração celular que converte carboidratos, gorduras e proteínas em energia vital em forma de ATP.",
    category: "Ciência",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Ciclo_de_Krebs"
  },
  {
    title: "Tectônica de Placas",
    author_or_source: "Geologia Moderna",
    description: "Modelo geológico que explica a movimentação dos blocos rochosos que compõem a crosta terrestre, dando origem a continentes, terremotos e cadeias de montanhas.",
    category: "Ciência",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Tect%C3%B3nica_de_placas"
  },
  {
    title: "Seleção Natural",
    author_or_source: "Charles Darwin",
    description: "Mecanismo fundamental da evolução biológica no qual organismos com variações adaptativas mais favoráveis ao ambiente têm maiores chances de sobreviver e se reproduzir.",
    category: "Ciência",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Sele%C3%A7%C3%A3o_natural"
  },
  {
    title: "Príons",
    author_or_source: "Biologia Molecular",
    description: "Agentes infecciosos microscópicos compostos unicamente por proteínas mal dobradas, desprovidos de material genético (DNA ou RNA), causadores de encefalopatias.",
    category: "Ciência",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Pr%C3%ADon"
  },
  {
    title: "Microbiota Humana",
    author_or_source: "Medicina e Microbiologia",
    description: "Comunidade de trilhões de microrganismos que habitam o corpo humano, desempenhando papéis cruciais na imunidade, digestão e regulação hormonal e cognitiva.",
    category: "Ciência",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Microbioma_humano"
  },
  {
    title: "Eletroforese em Gel",
    author_or_source: "Biotecnologia",
    description: "Técnica laboratorial que usa campos elétricos para separar moléculas de DNA, RNA ou proteínas de acordo com seu tamanho e carga elétrica.",
    category: "Ciência",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Eletroforese_em_gel"
  },
  {
    title: "Zonas Abissais Oceânicas",
    author_or_source: "Oceanografia Biológica",
    description: "Regiões oceânicas ultra-profundas caracterizadas por escuridão total, pressão esmagadora e ecossistemas exuberantes que dependem de quimiossíntese vulcânica.",
    category: "Ciência",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Zona_abissal"
  },
  {
    title: "Efeito Albedo",
    author_or_source: "Ciências Atmosféricas",
    description: "Capacidade de uma superfície refletir a radiação solar. Geleiras possuem alto albedo (resfriam), enquanto oceanos e asfalto escuro têm baixo albedo (absorvem calor).",
    category: "Ciência",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Albedo"
  },
  {
    title: "Bioluminescência",
    author_or_source: "Bioquímica Natural",
    description: "Produção e emissão de luz fria por um organismo vivo decorrente de uma reação química entre a enzima luciferase e a molécula luciferina.",
    category: "Ciência",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Bioluminesc%C3%AAncia"
  },

  // HISTÓRIA (10)
  {
    title: "Tratado de Versalhes",
    author_or_source: "História Contemporânea",
    description: "Acordo de paz assinado em 1919 que encerrou oficialmente a Primeira Guerra Mundial, impondo duras sanções à Alemanha que influenciaram o surgimento da Segunda Guerra.",
    category: "História",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Tratado_de_Versalhes_(1919)"
  },
  {
    title: "Guerra de Canudos",
    author_or_source: "História do Brasil",
    description: "Conflito militar dramático no sertão da Bahia (1896-1897) liderado por Antônio Conselheiro, reunindo milhares de sertanejos em busca de autonomia e justiça social.",
    category: "História",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Guerra_de_Canudos"
  },
  {
    title: "Queda de Constantinopla",
    author_or_source: "História Medieval",
    description: "A tomada da capital do Império Bizantino pelos turcos otomanos em 1453, evento marcante que assinala historicamente o fim da Idade Média e o início da Idade Moderna.",
    category: "História",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Queda_de_Constantinopla"
  },
  {
    title: "Era Meiji",
    author_or_source: "História do Japão",
    description: "Período transformador de 1868 a 1912 no qual o Japão emergiu do isolamento feudal para se converter rapidamente em uma potência industrial e militar moderna.",
    category: "História",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Era_Meiji"
  },
  {
    title: "Império Mali",
    author_or_source: "História Africana",
    description: "Um dos impérios mais ricos e cultos da história mundial, governado pelo lendário Mansa Musa, centro global do comércio de ouro e saber acadêmico em Tombuctu.",
    category: "História",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Imp%C3%A9rio_do_Mali"
  },
  {
    title: "Conferência de Berlim",
    author_or_source: "História do Século XIX",
    description: "Reunião de potências europeias entre 1884 e 1885 que organizou a partilha colonial do continente africano, desenhando fronteiras artificiais com consequências duradouras.",
    category: "História",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Confer%C3%AAncia_de_Berlim"
  },
  {
    title: "Belle Époque",
    author_or_source: "História Cultural",
    description: "Período cosmopolita de otimismo, paz e efervescência artística e tecnológica na Europa entre o final do século XIX e a eclosão da Primeira Guerra Mundial.",
    category: "História",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Belle_%C3%89poque"
  },
  {
    title: "Era Vargas",
    author_or_source: "História do Brasil",
    description: "Período decisivo de 1930 a 1945 comandado por Getúlio Vargas, caracterizado pela industrialização nacional, criação da legislação trabalhista e centralização estatal.",
    category: "História",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Era_Vargas"
  },
  {
    title: "Pax Romana",
    author_or_source: "Roma Antiga",
    description: "Longo período de relativa paz e estabilidade imperial que durou cerca de dois séculos a partir do governo de Augusto, permitindo expressivo florescimento comercial.",
    category: "História",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Pax_Romana"
  },
  {
    title: "Revolução dos Cravos",
    author_or_source: "História de Portugal",
    description: "Levante militar e popular pacífico em 25 de abril de 1974 que derrubou a ditadura do Estado Novo em Portugal e restaurou a democracia no país.",
    category: "História",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Revolu%C3%A7%C3%A3o_dos_Cravos"
  },

  // LITERATURA (10)
  {
    title: "Memórias Póstumas de Brás Cubas",
    author_or_source: "Machado de Assis",
    description: "Obra-prima inauguradora do Realismo no Brasil em 1881, narrada por um 'defunto autor' com ironia fina, pessimismo lúcido e ruptura da linearidade cronológica.",
    category: "Literatura",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Mem%C3%B3rias_P%C3%B3stumas_de_Br%C3%A1s_Cubas"
  },
  {
    title: "Cem Anos de Solidão",
    author_or_source: "Gabriel García Márquez",
    description: "Marco supremo do Realismo Mágico latino-americano, retratando as gerações da família Buendía na mítica cidade de Macondo através do tempo e da memória.",
    category: "Literatura",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Cien_a%C3%B1os_de_soledad"
  },
  {
    title: "Grande Sertão: Veredas",
    author_or_source: "João Guimarães Rosa",
    description: "Monumento da literatura brasileira escrito como um longo monólogo do jagunço Riobaldo sobre o diabo, o amor por Diadorim e as travessias do sertão.",
    category: "Literatura",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Grande_Sert%C3%A3o:_Veredas"
  },
  {
    title: "O Processo",
    author_or_source: "Franz Kafka",
    description: "Romance kafkiano angustiante que acompanha Josef K., preso e julgado por uma burocracia inacessível e absurda sem nunca ser informado de qual crime cometeu.",
    category: "Literatura",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/O_Processo"
  },
  {
    title: "Ilíada",
    author_or_source: "Homero",
    description: "Poema épico grego fundador da tradição ocidental que narra as semanas finais do cerco à cidade de Troia e a fúria devastadora do guerreiro Aquiles.",
    category: "Literatura",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Il%C3%ADada"
  },
  {
    title: "Crime e Castigo",
    author_or_source: "Fiódor Dostoiévski",
    description: "Profundo estudo psicológico sobre a culpa e a redenção de Raskólnikov, um jovem estudante que comete um assassinato acreditando estar acima das leis morais comuns.",
    category: "Literatura",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Crime_e_Castigo"
  },
  {
    title: "Macunaíma",
    author_or_source: "Mário de Andrade",
    description: "Rapsódia modernista brasileira de 1928 que cria 'o herói sem nenhum caráter', fundindo mitologias indígenas, dialetos populares e a formação identitária nacional.",
    category: "Literatura",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Macuna%C3%ADma_(livro)"
  },
  {
    title: "Ensaio sobre a Cegueira",
    author_or_source: "José Saramago",
    description: "Parábola ficcional perturbadora onde uma súbita 'cegueira branca' atinge uma cidade inteira, expondo a fragilidade das estruturas sociais e a essência da empatia.",
    category: "Literatura",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Ensaio_sobre_a_Cegueira"
  },
  {
    title: "Os Sertões",
    author_or_source: "Euclides da Cunha",
    description: "Ensaio e relato histórico-literário dividido em 'A Terra', 'O Homem' e 'A Luta', desnudando com rigor científico e paixão lírica o massacre de Canudos.",
    category: "Literatura",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Os_Sert%C3%B5es"
  },
  {
    title: "O Grande Gatsby",
    author_or_source: "F. Scott Fitzgerald",
    description: "Retrato clássico dos 'Anos Dourados' da década de 1920 nos Estados Unidos, explorando a obsessão pelo sucesso, desilusão amorosa e a desintegração do sonho americano.",
    category: "Literatura",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/The_Great_Gatsby"
  },

  // ASTRONOMIA (10)
  {
    title: "Cinturão de Kuiper",
    author_or_source: "Astronomia Planetária",
    description: "Vasta região em formato de disco além da órbita de Netuno repleta de pequenos corpos gelados e planetas anões, incluindo Plutão e Sedna.",
    category: "Astronomia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Cintur%C3%A3o_de_Kuiper"
  },
  {
    title: "Radiação de Hawking",
    author_or_source: "Stephen Hawking",
    description: "Radiação térmica teórica emitida pelas bordas de buracos negros decorrente de efeitos quânticos próximos ao horizonte de eventos, implicando sua lenta evaporação.",
    category: "Astronomia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Radia%C3%A7%C3%A3o_Hawking"
  },
  {
    title: "Nuvem de Oort",
    author_or_source: "Astrofísica do Sistema Solar",
    description: "Hipotética casca esférica imensa de cometas gelados nos confins externos do Sistema Solar, localizada a quase um ano-luz de distância do Sol.",
    category: "Astronomia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Nuvem_de_Oort"
  },
  {
    title: "Lente Gravitacional",
    author_or_source: "Relatividade Geral",
    description: "Distorção e amplificação da luz de galáxias distantes provocada pela gravidade imensa de um corpo massivo intermediário agindo como uma lente cósmica natural.",
    category: "Astronomia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Lente_gravitacional"
  },
  {
    title: "Horizonte de Eventos",
    author_or_source: "Cosmologia",
    description: "Fronteira teórica ao redor de um buraco negro além da qual nada, nem mesmo a luz, possui velocidade suficiente para escapar da atração gravitacional.",
    category: "Astronomia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Horizonte_de_eventos"
  },
  {
    title: "Anã Marrom",
    author_or_source: "Evolução Estelar",
    description: "Objeto astronômico com massa superior à dos maiores planetas gigantes gasosos, porém insuficiente para iniciar a fusão contínua de hidrogênio no núcleo.",
    category: "Astronomia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/An%C3%A3_castanha"
  },
  {
    title: "Nebulosa de Órion",
    author_or_source: "Astrofotografia e Observação",
    description: "Um dos berçários estelares mais luminosos e próximos da Terra, visível a olho nu na constelação de Órion, onde novas estrelas e discos protoplanetários se formam.",
    category: "Astronomia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Nebulosa_de_%C3%93rion"
  },
  {
    title: "Tempestade Geomagnética",
    author_or_source: "Física Solar",
    description: "Perturbação temporária na magnetosfera terrestre causada por ejeções de massa coronal do Sol, capaz de induzir auroras polares e interferir em redes elétricas e satélites.",
    category: "Astronomia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Tempestade_geomagn%C3%A9tica"
  },
  {
    title: "Oumuamua",
    author_or_source: "Astronomia Observacional",
    description: "O primeiro objeto interestelar confirmado a cruzar o Sistema Solar, identificado em 2017 com trajetória hiperbólica e aceleração anômala não explicada por desgaseificação comum.",
    category: "Astronomia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/%CA%BBOumuamua"
  },
  {
    title: "Lei de Hubble-Lemaître",
    author_or_source: "Edwin Hubble e Georges Lemaître",
    description: "Princípio cosmológico que demonstra que galáxias distantes estão se afastando da Terra a velocidades proporcionais à sua distância, evidenciando a expansão do Universo.",
    category: "Astronomia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Lei_de_Hubble"
  },

  // PSICOLOGIA (10)
  {
    title: "Efeito Halo",
    author_or_source: "Edward Thorndike",
    description: "Viés cognitivo no qual a impressão geral positiva ou negativa sobre uma pessoa em um traço específico influencia automaticamente a avaliação de todas as outras características dela.",
    category: "Psicologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Efeito_halo"
  },
  {
    title: "Teoria do Apego",
    author_or_source: "John Bowlby",
    description: "Modelo psicológico que postula que os laços afetivos e de segurança construídos na infância primária moldam os padrões de relacionamento e estabilidade emocional ao longo da vida adulta.",
    category: "Psicologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Teoria_do_apego"
  },
  {
    title: "Viés de Confirmação",
    author_or_source: "Psicologia Cognitiva",
    description: "Tendência inconsciente de procurar, interpretar, favorecer e recordar informações que confirmem crenças prévias pessoais, ignorando dados contrários.",
    category: "Psicologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Vi%C3%A9s_de_confirma%C3%A7%C3%A3o"
  },
  {
    title: "Desamparo Aprendido",
    author_or_source: "Martin Seligman",
    description: "Condição psicológica em que um indivíduo que sofreu estímulos negativos repetidos e inescapáveis passa a agir de forma passiva mesmo quando existem oportunidades reais de mudança.",
    category: "Psicologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Desamparo_aprendido"
  },
  {
    title: "Neurônios-Espelho",
    author_or_source: "Giacomo Rizzolatti",
    description: "Células cerebrais que disparam tanto quando um indivíduo realiza uma ação quanto quando observa outro executando o mesmo ato, fundamentais para empatia e aprendizado.",
    category: "Psicologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Neur%C3%B4nio-espelho"
  },
  {
    title: "Efeito Hawthorne",
    author_or_source: "Psicologia Organizacional",
    description: "Fenômeno em que indivíduos modificam ou aprimoram seu comportamento e desempenho no trabalho simplesmente por estarem cientes de que estão sendo observados.",
    category: "Psicologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Efeito_Hawthorne"
  },
  {
    title: "Mindset de Crescimento",
    author_or_source: "Carol Dweck",
    description: "Conceito que distingue quem acredita que suas habilidades são inatas e imutáveis (mente fixa) de quem compreende que inteligência e talentos são desenvolvidos com esforço e estratégia.",
    category: "Psicologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Mentalidade"
  },
  {
    title: "Sublimação",
    author_or_source: "Sigmund Freud",
    description: "Mecanismo de defesa maduro em que impulsos instintivos e tensões emocionais são canalizados e transformados em atividades socialmente construtivas, como arte e pesquisa científica.",
    category: "Psicologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Sublima%C3%A7%C3%A3o_(psicologia)"
  },
  {
    title: "Janela de Johari",
    author_or_source: "Joseph Luft e Harrington Ingham",
    description: "Ferramenta de autoconhecimento que mapeia a comunicação interpessoal em quatro quadrantes: a área aberta, a área cega, a área secreta e a área desconhecida.",
    category: "Psicologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Janela_de_Johari"
  },
  {
    title: "Efeito de Falso Consenso",
    author_or_source: "Lee Ross",
    description: "Viés psicológico em que as pessoas tendem a superestimar a proporção de outros indivíduos que concordam com suas próprias opiniões, atitudes e valores.",
    category: "Psicologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Efeito_do_falso_consenso"
  },

  // ARTE (10)
  {
    title: "Barroco Mineiro",
    author_or_source: "Aleijadinho e Mestre Ataíde",
    description: "Expressão artística e arquitetônica do século XVIII em Minas Gerais, caracterizada pelo uso de pedra-sabão, talha dourada e traços originais da identidade luso-brasileira.",
    category: "Arte",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Barroco_no_Brasil"
  },
  {
    title: "Kintsugi",
    author_or_source: "Estética Tradicional Japonesa",
    description: "Arte japonesa milenar de reparar cerâmicas quebradas unindo os fragmentos com laca polvilhada com ouro, exaltando as cicatrizes e imperfeições da história do objeto.",
    category: "Arte",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Kintsugi"
  },
  {
    title: "Guernica",
    author_or_source: "Pablo Picasso",
    description: "Pintura monumental cubista de 1937 criada em resposta ao bombardeio aéreo fascista da cidade basca de Guernica, consagrada como símbolo universal antiguerra.",
    category: "Arte",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Guernica_(quadro)"
  },
  {
    title: "Arte Naïf",
    author_or_source: "Henri Rousseau e Mestre Vitalino",
    description: "Estilo artístico marcado pela espontaneidade, uso livre e expressivo de cores e ausência intencional de regras acadêmicas tradicionais de perspectiva formal.",
    category: "Arte",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Arte_na%C3%AFf"
  },
  {
    title: "Op Art",
    author_or_source: "Victor Vasarely",
    description: "Vertente da arte abstrata que explora ilusões de ótica e percepção visual através de padrões geométricos rigorosos que parecem vibrar ou se movimentar na tela.",
    category: "Arte",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Op_art"
  },
  {
    title: "Chiaroscuro",
    author_or_source: "Caravaggio e Rembrandt",
    description: "Técnica renascentista e barroca de contraste dramático entre áreas de luz e sombras profundas, criando forte sensação tridimensional e intensidade psicológica.",
    category: "Arte",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Chiaroscuro"
  },
  {
    title: "Arte Cinética",
    author_or_source: "Alexander Calder",
    description: "Movimento moderno onde as obras incorporam o movimento real, seja através de motores, do vento ou da interação física do observador (como os móbiles).",
    category: "Arte",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Arte_cin%C3%A9tica"
  },
  {
    title: "Ready-made",
    author_or_source: "Marcel Duchamp",
    description: "Conceito vanguardista que redefiniu o que é arte ao deslocar objetos ordinários de fabricação industrial para o espaço expositivo, questionando a essência da criação.",
    category: "Arte",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Ready-made"
  },
  {
    title: "Impressionismo Musical",
    author_or_source: "Claude Debussy e Maurice Ravel",
    description: "Estilo de composição do final do século XIX focado na criação de atmosferas sutis, texturas tímbricas e harmonias inovadoras que evocam impressões fugazes.",
    category: "Arte",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/M%C3%BAsica_impressionista"
  },
  {
    title: "Semana de Arte Moderna de 1922",
    author_or_source: "Modernismo Brasileiro",
    description: "Festival cultural histórico realizado no Theatro Municipal de São Paulo que rompeu com o academicismo parnasiano e abriu espaço para a renovação estética nacional.",
    category: "Arte",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Semana_de_Arte_Moderna"
  },

  // MATEMÁTICA (10)
  {
    title: "Teorema Fundamental do Cálculo",
    author_or_source: "Isaac Newton e Gottfried Leibniz",
    description: "Pilar da análise matemática que unifica o cálculo diferencial e integral, demonstrando formalmente que a diferenciação e a integração são operações inversas.",
    category: "Matemática",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Teorema_fundamental_do_c%C3%A1lculo"
  },
  {
    title: "Paradoxo de Monty Hall",
    author_or_source: "Teoria das Probabilidades",
    description: "Famoso enigma probabilístico baseado em portas premiadas que prova matematicamente que mudar de escolha dobra suas chances de vitória após a eliminação de um erro.",
    category: "Matemática",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Problema_de_Monty_Hall"
  },
  {
    title: "Fita de Möbius",
    author_or_source: "August Ferdinand Möbius",
    description: "Superfície bidimensional não orientável fascinante que possui apenas um lado e uma única borda contínua no espaço euclidiano tridimensional.",
    category: "Matemática",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Fita_de_M%C3%B6bius"
  },
  {
    title: "Triângulo de Pascal",
    author_or_source: "Blaise Pascal",
    description: "Arranjo geométrico triangular infinito de coeficientes binomiais que revela inúmeras simetrias, propriedades combinatórias e conexões com a álgebra.",
    category: "Matemática",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Tri%C3%A2ngulo_de_Pascal"
  },
  {
    title: "Geometria Não-Euclidiana",
    author_or_source: "Lobachevsky e Riemann",
    description: "Sistemas geométricos consistentes que abandonam o quinto postulado de Euclides sobre paralelas, fundamentais para a formulação da relatividade geral e o espaço curvo.",
    category: "Matemática",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Geometria_n%C3%A3o_euclidiana"
  },
  {
    title: "Conjetura de Collatz",
    author_or_source: "Lothar Collatz",
    description: "Um dos problemas em aberto mais célebres da matemática: partindo de qualquer inteiro positivo, aplicando operações simples de par/ímpar, a sequência sempre atinge 1?",
    category: "Matemática",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Conjetura_de_Collatz"
  },
  {
    title: "Álgebra Linear e Matrizes",
    author_or_source: "Matemática Aplicada",
    description: "Ramo matemático que estuda espaços vetoriais e transformações lineares, sustentando a base computacional de gráficos 3D modernos e redes neurais de IA.",
    category: "Matemática",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/%C3%81lgebra_linear"
  },
  {
    title: "Paradoxo de Russell",
    author_or_source: "Bertrand Russell",
    description: "Paradoxo da teoria ingênua dos conjuntos ('o conjunto de todos os conjuntos que não contêm a si mesmos') que forçou uma profunda reformulação axiomática da matemática.",
    category: "Matemática",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Paradoxo_de_Russell"
  },
  {
    title: "Identidade de Euler",
    author_or_source: "Leonhard Euler",
    description: "Frequentemente chamada de 'a fórmula mais bela da matemática' por unir de forma simples cinco constantes fundamentais: e, i, pi, 1 e 0.",
    category: "Matemática",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Identidade_de_Euler"
  },
  {
    title: "Criptografia de Chave Pública (RSA)",
    author_or_source: "Rivest, Shamir e Adleman",
    description: "Sistema criptográfico baseado na dificuldade computacional de fatorar números primos gigantescos, garantindo a segurança de transações e comunicações na internet.",
    category: "Matemática",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/RSA_(sistema_criptogr%C3%A1fico)"
  },

  // SOCIOLOGIA (10)
  {
    title: "Violência Simbólica",
    author_or_source: "Pierre Bourdieu",
    description: "Forma invisível e sutil de dominação social na qual os próprios dominados assimilam e reproduzem as categorias mentais da hierarquia que os oprime.",
    category: "Sociologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Viol%C3%AAncia_simb%C3%B3lica"
  },
  {
    title: "Modernidade Líquida",
    author_or_source: "Zygmunt Bauman",
    description: "Diagnóstico da sociedade contemporânea onde laços comunitários, identidades e relacionamentos tornaram-se fluidos, instáveis e descartáveis.",
    category: "Sociologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Modernidade_l%C3%ADquida"
  },
  {
    title: "A Banalidade do Mal",
    author_or_source: "Hannah Arendt",
    description: "Conceito filosófico e sociológico formulado durante o julgamento de Adolf Eichmann, apontando que atrocidades extremas podem ser cometidas por burocratas comuns e acríticos.",
    category: "Sociologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Banalidade_do_mal"
  },
  {
    title: "Habitus",
    author_or_source: "Pierre Bourdieu",
    description: "Sistema de disposições e esquemas de percepção interiorizados pelos indivíduos a partir de sua posição na estrutura social, orientando gostos e comportamentos.",
    category: "Sociologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Habitus"
  },
  {
    title: "Capital Social",
    author_or_source: "Robert Putnam e James Coleman",
    description: "Rede de relações de confiança mútua, cooperação e normas cívicas em uma comunidade que facilitam a ação coordenada e ampliam a coesão social.",
    category: "Sociologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Capital_social"
  },
  {
    title: "O Desencantamento do Mundo",
    author_or_source: "Max Weber",
    description: "Processo histórico da modernidade em que explicações mágicas e místicas são progressivamente substituídas pelo cálculo técnico e racionalização burocrática.",
    category: "Sociologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Desencantamento_do_mundo"
  },
  {
    title: "Casa-Grande & Senzala",
    author_or_source: "Gilberto Freyre",
    description: "Obra de 1933 que reavaliou a miscigenação na formação histórica e sociológica da família patriarcal brasileira e das relações raciais no país.",
    category: "Sociologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Casa-Grande_%26_Senzala"
  },
  {
    title: "Alienação Social",
    author_or_source: "Karl Marx",
    description: "Condição estrutural no sistema produtivo em que o trabalhador perde o controle sobre o produto de seu trabalho, sobre si mesmo e sobre a coletividade.",
    category: "Sociologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Aliena%C3%A7%C3%A3o_(marxismo)"
  },
  {
    title: "Solidariedade Orgânica e Mecânica",
    author_or_source: "Émile Durkheim",
    description: "Conceitos que distinguem a coesão de sociedades tradicionais (baseadas na semelhança) da coesão de sociedades industriais (baseadas na interdependência da divisão do trabalho).",
    category: "Sociologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Divis%C3%A3o_do_trabalho_social"
  },
  {
    title: "Bolhas Sociais e Câmaras de Eco",
    author_or_source: "Sociologia Digital",
    description: "Fenômeno intensificado por algoritmos no qual usuários são expostos primariamente a opiniões que reforçam seus próprios preconceitos, polarizando debates públicos.",
    category: "Sociologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/C%C3%A2mara_de_eco_(m%C3%ADdia)"
  },

  // TECNOLOGIA (10)
  {
    title: "Protocolo TCP/IP",
    author_or_source: "Vint Cerf e Bob Kahn",
    description: "Conjunto de protocolos de comunicação padronizados que estabelece as regras para o roteamento e transmissão de pacotes de dados, estruturando toda a internet global.",
    category: "Tecnologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/TCP/IP"
  },
  {
    title: "Inteligência Artificial Geral (AGI)",
    author_or_source: "Ciência da Computação",
    description: "Hipotético sistema de inteligência de máquina capaz de compreender, aprender e aplicar conhecimento em qualquer tarefa intelectual com destreza equivalente ou superior à humana.",
    category: "Tecnologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Intelig%C3%AAncia_artificial_geral"
  },
  {
    title: "Computação Neuromórfica",
    author_or_source: "Engenharia de Hardware",
    description: "Arquitetura inovadora de chips de computador inspirada diretamente na estrutura sináptica e neuronal do cérebro humano, otimizando gasto energético extremo em IA.",
    category: "Tecnologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Engenharia_neurom%C3%B3rfica"
  },
  {
    title: "Criptografia de Curva Elíptica",
    author_or_source: "Segurança da Informação",
    description: "Técnica de criptografia assimétrica que utiliza a matemática de curvas algébricas para oferecer proteção máxima com chaves muito menores do que o padrão RSA.",
    category: "Tecnologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Criptografia_de_curva_el%C3%ADptica"
  },
  {
    title: "Grafeno na Microeletrônica",
    author_or_source: "Nanotecnologia",
    description: "Material bidimensional composto por uma única camada de átomos de carbono, condutor elétrico e térmico superlativo com potencial para suceder o silício.",
    category: "Tecnologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Grafeno"
  },
  {
    title: "Starlink e Constelações LEO",
    author_or_source: "Engenharia Aeroespacial",
    description: "Redes massivas de milhares de pequenos satélites em órbita baixa da Terra (LEO) projetadas para fornecer conectividade de internet de alta velocidade e baixa latência no mundo todo.",
    category: "Tecnologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Starlink"
  },
  {
    title: "Impressão 3D e Biomanufatura",
    author_or_source: "Manufatura Aditiva",
    description: "Tecnologia de prototipagem e manufatura capaz de depositar camadas sucessivas de materiais (ou biotintas com células vivas) para produzir tecidos e próteses.",
    category: "Tecnologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Impress%C3%A3o_3D"
  },
  {
    title: "Computação Serverless",
    author_or_source: "Arquitetura Cloud",
    description: "Modelo de execução em nuvem onde o provedor gerencia automaticamente a alocação e o provisionamento de servidores, cobrando estritamente pelo tempo de execução de funções.",
    category: "Tecnologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Computa%C3%A7%C3%A3o_sem_servidor"
  },
  {
    title: "Zero Trust Architecture",
    author_or_source: "Cibersegurança",
    description: "Princípio de segurança corporativa que opera sob a premissa de que nenhuma entidade, interna ou externa à rede, deve ser automaticamente confiável sem validação contínua.",
    category: "Tecnologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Seguran%C3%A7a_de_confian%C3%A7a_zero"
  },
  {
    title: "Sensores Quânticos",
    author_or_source: "Metrologia Quântica",
    description: "Dispositivos que exploram a extrema sensibilidade de estados quânticos para medir tempo, campos magnéticos e gravidade com precisão ordens de grandeza superior à clássica.",
    category: "Tecnologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Sensor_qu%C3%A2ntico"
  },

  // POLÍTICA (10)
  {
    title: "Separação de Poderes",
    author_or_source: "Montesquieu",
    description: "Doutrina constitucional clássica que preconiza a divisão orgânica do poder estatal em Executivo, Legislativo e Judiciário para evitar a tirania e garantir o equilíbrio (freios e contrapesos).",
    category: "Política",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Separa%C3%A7%C3%A3o_de_poderes"
  },
  {
    title: "Teoria da Justiça",
    author_or_source: "John Rawls",
    description: "Filosofia política moderna que propõe o 'véu da ignorância': leis justas só são concebidas quando os legisladores não sabem qual posição social ocuparão na sociedade resultante.",
    category: "Política",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Uma_Teoria_da_Justi%C3%A7a"
  },
  {
    title: "Leviatã",
    author_or_source: "Thomas Hobbes",
    description: "Obra seminal sobre o contrato social, argumentando que sem uma autoridade soberana central forte, a humanidade viveria em estado de guerra constante de 'todos contra todos'.",
    category: "Política",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Leviat%C3%A3_(livro)"
  },
  {
    title: "Estado Democrático de Direito",
    author_or_source: "Direito Constitucional",
    description: "Conceito político em que o próprio Estado se submete às leis criadas democraticamente, garantindo direitos fundamentais invioláveis e soberania popular.",
    category: "Política",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Estado_de_direito"
  },
  {
    title: "Quociente Eleitoral",
    author_or_source: "Sistema Eleitoral Proporcional",
    description: "Método matemático que define o número mínimo de votos que um partido ou federação precisa obter para conquistar cadeiras no parlamento (deputados e vereadores).",
    category: "Política",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Quociente_eleitoral"
  },
  {
    title: "Sufrágio Universal",
    author_or_source: "Teoria Democrática",
    description: "Direito garantido a todos os cidadãos adultos de uma nação de votar e participar de eleições, sem distinção de raça, gênero, renda ou grau de instrução formal.",
    category: "Política",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Sufr%C3%A1gio_universal"
  },
  {
    title: "Federalismo",
    author_or_source: "Ciência Política",
    description: "Forma de organização estatal onde a soberania é compartilhada entre um governo central e unidades regionais autônomas (estados e municípios), como no Brasil e EUA.",
    category: "Política",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Federalismo"
  },
  {
    title: "O Príncipe",
    author_or_source: "Nicolau Maquiavel",
    description: "Tratado político renascentista que inaugura o realismo político, analisando como o poder é conquistado e mantido na prática, distinguindo virtù de fortuna.",
    category: "Política",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/O_Pr%C3%ADncipe"
  },
  {
    title: "Declaração Universal dos Direitos Humanos",
    author_or_source: "Organização das Nações Unidas (1948)",
    description: "Documento histórico marco que delineou pela primeira vez os direitos humanos básicos que devem ser universalmente protegidos para todos os povos.",
    category: "Política",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Declara%C3%A7%C3%A3o_Universal_dos_Direitos_Humanos"
  },
  {
    title: "Princípio da Subsidiariedade",
    author_or_source: "Teoria Política",
    description: "Diretriz que postula que as decisões públicas devem ser tomadas no nível mais próximo possível dos cidadãos, cabendo ao Estado central agir apenas quando indispensável.",
    category: "Política",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Princ%C3%ADpio_da_subsidiariedade"
  },

  // MITOLOGIA (10)
  {
    title: "Mito de Prometeu",
    author_or_source: "Mitologia Grega",
    description: "Narrativa do titã que roubou o fogo divino do Olimpo para entregá-lo aos mortais, simbolizando a centelha da inteligência, do livre-arbítrio e da civilização técnica.",
    category: "Mitologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Prometeu"
  },
  {
    title: "Ragnarök",
    author_or_source: "Mitologia Nórdica",
    description: "A cataclísmica batalha final do cosmos nórdico que culmina na morte de deuses como Odin e Thor, a submersão do mundo e o posterior renascimento fértil de uma nova era.",
    category: "Mitologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Ragnar%C3%B6k"
  },
  {
    title: "O Mito de Osíris e Ísis",
    author_or_source: "Mitologia Egípcia",
    description: "A narrativa fundamental do Egito Antigo sobre a morte, desmembramento e ressurreição do rei Osíris por amor de Ísis, fundamentando a crença na vida após a morte.",
    category: "Mitologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Mito_de_Os%C3%ADris"
  },
  {
    title: "Odisseu e as Sereias",
    author_or_source: "Mitologia Grega",
    description: "Passagem clássica da Odisseia em que o herói manda seus marinheiros taparem os ouvidos com cera e se amarra ao mastro para resistir ao canto sedutor e mortal das sereias.",
    category: "Mitologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Odisseu"
  },
  {
    title: "Anhangá e Curupira",
    author_or_source: "Mitologia Tupi-Guarani",
    description: "Espíritos protetores ancestrais das florestas e dos animais no imaginário indígena brasileiro, que punem caçadores gananciosos que desrespeitam o equilíbrio natural.",
    category: "Mitologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Curupira"
  },
  {
    title: "O Labirinto do Minotauro",
    author_or_source: "Mitologia Cretense",
    description: "A intrincada prisão construída por Dédalo em Creta para aprisionar a criatura metade homem e metade touro, derrotada pelo herói Teseu com o fio guia de Ariadne.",
    category: "Mitologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Minotauro"
  },
  {
    title: "Panteão dos Orixás",
    author_or_source: "Mitologia Iorubá",
    description: "Divindades da tradição afro-brasileira que personificam as forças cósmicas e naturais (como Xangô, Iemanjá, Oxóssi e Ogum) mediadas pelo orixá mensageiro Exu.",
    category: "Mitologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Orix%C3%A1"
  },
  {
    title: "Quetzalcóatl (A Serpente Emplumada)",
    author_or_source: "Mitologia Mesoamericana",
    description: "Divindade central das civilizações asteca e maia associada ao vento, à alvorada, à sabedoria, à fertilidade e à criação da humanidade atual.",
    category: "Mitologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Quetzalc%C3%B3atl"
  },
  {
    title: "Epopeia de Gilgamesh",
    author_or_source: "Mitologia Mesopotâmica",
    description: "O texto literário e mitológico mais antigo da humanidade, narrando a jornada do rei de Uruk em busca da imortalidade após a dolorosa morte de seu amigo Enkidu.",
    category: "Mitologia",
    level: "deep",
    link: "https://pt.wikipedia.org/wiki/Epopeia_de_Gilgam%C3%A9s"
  },
  {
    title: "A Caixa de Pandora",
    author_or_source: "Mitologia Grega",
    description: "Mito sobre a primeira mulher humana que, movida pela curiosidade, abre o recipiente proibido liberando todos os males pelo mundo, restando apenas a esperança no fundo.",
    category: "Mitologia",
    level: "basic",
    link: "https://pt.wikipedia.org/wiki/Caixa_de_Pandora"
  }
];

const filePath = './src/data/references.json';
const currentData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
let nextId = Math.max(...currentData.map(d => d.id)) + 1;

let added = 0;
for (const item of newTopics) {
  const exists = currentData.some(c => c.title.toLowerCase() === item.title.toLowerCase());
  if (!exists) {
    currentData.push({
      id: nextId++,
      ...item
    });
    added++;
  }
}

fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), 'utf-8');
console.log(`Sucesso! Foram adicionados ${added} novos temas. Total agora: ${currentData.length}`);
