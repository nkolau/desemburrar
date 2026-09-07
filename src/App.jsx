import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  BookOpen, RefreshCw, ExternalLink, ArrowLeft, BrainCircuit, Brain, Clock, 
  CheckCircle2, Play, Square, Star, BookmarkCheck, History, X, Trash2, Check, 
  Sparkles, Search, Share2, Volume2, VolumeX, Type, Flame, Lightbulb, Compass, Copy, Command,
  Vote, Calendar, Landmark, Flag, UserCheck, Scale, ShieldCheck, Info, FileText
} from 'lucide-react';
import referencesData from './data/references.json';
import electionsData from './data/elections.json';

const CATEGORY_IMAGES = {
  'Filosofia': 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=400&q=80',
  'Ciência': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80',
  'História': 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80',
  'Literatura': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80',
  'Astronomia': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80',
  'Psicologia': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80',
  'Arte': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80',
  'Matemática': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80',
  'Sociologia': 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&q=80',
  'Tecnologia': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
  'Política': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&q=80',
  'Mitologia': 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80',
  'Física': 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&q=80',
  'Todas': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&q=80'
};

const getCategoryImage = (cat) => {
  if (!cat) return 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80';
  const found = Object.keys(CATEGORY_IMAGES).find(k => cat.toLowerCase().includes(k.toLowerCase()));
  return found ? CATEGORY_IMAGES[found] : 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80';
};

// Socratic Provocations Generator
const getSocraticProvocation = (category, title) => {
  switch (category) {
    case 'Filosofia':
      return `Como a premissa de "${title}" questiona uma das suas certezas mais automáticas do dia a dia?`;
    case 'Ciência':
    case 'Física':
      return `Se essa lei ou conceito governa a realidade, de que maneira ele se manifesta invisivelmente à sua volta agora?`;
    case 'História':
      return `Quais ecos e padrões de "${title}" você ainda consegue enxergar nas decisões políticas ou sociais de hoje?`;
    case 'Literatura':
    case 'Arte':
      return `Qual verdade humana oculta esse trabalho busca despertar em quem o contempla?`;
    case 'Psicologia':
      return `Em quais momentos recentes você percebeu o impacto prático desse comportamento em você ou em pessoas próximas?`;
    case 'Tecnologia':
      return `Essa inovação resolve mais problemas do que cria, ou ela apenas transformou a natureza dos nossos desafios?`;
    default:
      return `Se você tivesse que explicar a essência de "${title}" para uma criança em 30 segundos, que analogia usaria?`;
  }
};

// Ambient Sound Generator (Web Audio API - Gentle Rain/Focus Lo-Fi)
class AmbientSoundPlayer {
  constructor() {
    this.ctx = null;
    this.source = null;
    this.gain = null;
    this.playing = false;
  }

  start() {
    if (this.playing) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      const bufferSize = this.ctx.sampleRate * 4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.0;
      }

      this.source = this.ctx.createBufferSource();
      this.source.buffer = buffer;
      this.source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 550;

      this.gain = this.ctx.createGain();
      this.gain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      this.source.connect(filter);
      filter.connect(this.gain);
      this.gain.connect(this.ctx.destination);

      this.source.start();
      this.playing = true;
    } catch {
      this.playing = false;
    }
  }

  stop() {
    if (!this.playing) return;
    try {
      this.source?.stop();
      this.ctx?.close();
    } catch {}
    this.playing = false;
  }
}

const ambientLoFi = new AmbientSoundPlayer();

function App() {
  const [screen, setScreen] = useState('intro');
  const [learningMode, setLearningMode] = useState('basic');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [reference, setReference] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Daily Topic State
  const [isDailyTopicActive, setIsDailyTopicActive] = useState(false);

  // Elections Feature State
  const [isElectionsOpen, setIsElectionsOpen] = useState(false);
  const [electionsTab, setElectionsTab] = useState('candidatos'); // 'candidatos' | 'planos' | 'marcos' | 'curiosidades'
  const [selectedPlanCandidateId, setSelectedPlanCandidateId] = useState('cand_lula');

  const currentPlanCandidate = useMemo(() => {
    return electionsData.candidates_2026.find(c => c.id === selectedPlanCandidateId) || electionsData.candidates_2026[0];
  }, [selectedPlanCandidateId]);

  // Typography state: 'sans' | 'serif'
  const [fontFamily, setFontStyle] = useState('sans');

  // Ambient sound toggle
  const [isSoundOn, setIsSoundOn] = useState(false);

  // Timer states: 'idle', 'reading', 'assimilation_ready', 'assimilating', 'evaluating', 'done'
  const [timerPhase, setTimerPhase] = useState('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  // Assimilation / Feynman Notes & Mastery
  const [feynmanNote, setFeynmanNote] = useState('');
  const [lastMastery, setLastMastery] = useState(null);

  // Library & History States
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('desemburrar_favorites') || '[]');
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('desemburrar_history') || '[]');
    } catch {
      return [];
    }
  });

  // Modals
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryTab, setLibraryTab] = useState('favorites');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Extract unique categories
  const categories = ['Todas', ...Array.from(new Set(referencesData.map(r => r.category)))].sort();

  // Daily Topic Deterministic Calculation
  const dailyTopicInfo = useMemo(() => {
    if (!referencesData || referencesData.length === 0) return null;
    const now = new Date();
    const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    let hash = 0;
    for (let i = 0; i < dateKey.length; i++) {
      hash = ((hash << 5) - hash) + dateKey.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % referencesData.length;
    return {
      topic: referencesData[index],
      dateFormatted: now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
    };
  }, []);

  // Streak Calculation
  const streak = useMemo(() => {
    if (!history || history.length === 0) return 0;
    const days = Array.from(new Set(history.map(h => {
      const d = new Date(h.timestamp || Date.now());
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }))).sort().reverse();

    if (days.length === 0) return 0;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    if (days[0] !== todayStr && days[0] !== yesterdayStr) return 0;

    let count = 1;
    let curr = new Date(days[0]);
    for (let i = 1; i < days.length; i++) {
      const prev = new Date(days[i]);
      const diff = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        count++;
        curr = prev;
      } else {
        break;
      }
    }
    return count;
  }, [history]);

  // Related Topics
  const relatedTopics = useMemo(() => {
    if (!reference || !reference.id) return [];
    return referencesData
      .filter(r => r.category === reference.category && r.id !== reference.id)
      .slice(0, 2);
  }, [reference]);

  // Filtered Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return referencesData
      .filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.description.toLowerCase().includes(q) || 
        r.category.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [searchQuery]);

  const generateRandomReference = useCallback((mode, category) => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    clearInterval(timerRef.current);
    setTimerPhase('idle');
    setTimeLeft(0);
    setFeynmanNote('');
    setLastMastery(null);
    setIsDailyTopicActive(false);
    
    setTimeout(() => {
      let filteredData = referencesData.filter(ref => ref.level === mode);
      if (category !== 'Todas') {
        filteredData = filteredData.filter(ref => ref.category === category);
      }

      if (filteredData.length === 0) {
        setIsAnimating(false);
        setReference({
          id: 0,
          title: "Nenhum tema encontrado",
          description: "Não encontramos tópicos com os filtros selecionados.",
          author_or_source: "Sistema",
          category: "Aviso",
          level: mode,
          link: ""
        });
        return;
      }
      
      const randomIndex = Math.floor(Math.random() * filteredData.length);
      let newRef = filteredData[randomIndex];
      
      if (reference && newRef.id === reference.id && filteredData.length > 1) {
        const fallbackIndex = (randomIndex + 1) % filteredData.length;
        newRef = filteredData[fallbackIndex];
      }
      
      setReference(newRef);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating, reference]);

  const handleModeSwitch = (newMode) => {
    if (newMode !== learningMode) {
      setLearningMode(newMode);
      if (screen === 'app') {
        generateRandomReference(newMode, selectedCategory);
      }
    }
  };

  const handleCategorySwitch = (newCat) => {
    if (newCat !== selectedCategory) {
      setSelectedCategory(newCat);
      generateRandomReference(learningMode, newCat);
    }
  };

  const startApp = () => {
    generateRandomReference(learningMode, selectedCategory);
    setScreen('app');
  };

  // Select Daily Topic
  const selectDailyTopic = () => {
    if (!dailyTopicInfo?.topic) return;
    clearInterval(timerRef.current);
    setTimerPhase('idle');
    setTimeLeft(0);
    setFeynmanNote('');
    setLastMastery(null);
    setReference(dailyTopicInfo.topic);
    setSelectedCategory(dailyTopicInfo.topic.category);
    setLearningMode(dailyTopicInfo.topic.level);
    setIsDailyTopicActive(true);
    setScreen('app');
  };

  // Sound Handler
  const toggleSound = () => {
    if (isSoundOn) {
      ambientLoFi.stop();
      setIsSoundOn(false);
    } else {
      ambientLoFi.start();
      setIsSoundOn(true);
    }
  };

  // Timer Handlers
  const startReadingTimer = (minutes) => {
    clearInterval(timerRef.current);
    setTimerPhase('reading');
    setTimeLeft(minutes * 60);
  };

  const finishReading = () => {
    clearInterval(timerRef.current);
    setTimerPhase('assimilation_ready');
    setTimeLeft(120); 
  };

  const startAssimilationTimer = () => {
    clearInterval(timerRef.current);
    setTimerPhase('assimilating');
    setTimeLeft(120);
  };

  const cancelTimer = () => {
    clearInterval(timerRef.current);
    setTimerPhase('idle');
    setTimeLeft(0);
    setFeynmanNote('');
    setLastMastery(null);
  };

  const handleSaveMastery = (masteryLevel) => {
    if (!reference || !reference.id) return;
    setLastMastery(masteryLevel);

    const record = {
      id: reference.id,
      title: reference.title,
      category: reference.category,
      level: reference.level,
      note: feynmanNote.trim(),
      mastery: masteryLevel,
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      timestamp: Date.now()
    };

    setHistory((prev) => {
      const filtered = prev.filter((h) => h.id !== reference.id);
      const updated = [record, ...filtered];
      try {
        localStorage.setItem('desemburrar_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setTimerPhase('done');
  };

  const toggleFavorite = (item) => {
    if (!item || !item.id) return;
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id);
      const updated = exists
        ? prev.filter((f) => f.id !== item.id)
        : [
            ...prev,
            {
              id: item.id,
              title: item.title,
              category: item.category,
              level: item.level,
              author_or_source: item.author_or_source,
              savedAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
            }
          ];
      try {
        localStorage.setItem('desemburrar_favorites', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const removeFavorite = (id, e) => {
    e?.stopPropagation();
    setFavorites((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      try {
        localStorage.setItem('desemburrar_favorites', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearHistory = () => {
    if (window.confirm("Deseja realmente limpar todo o histórico de estudos?")) {
      setHistory([]);
      try {
        localStorage.removeItem('desemburrar_history');
      } catch {}
    }
  };

  const selectTopicDirectly = (topic) => {
    clearInterval(timerRef.current);
    setTimerPhase('idle');
    setTimeLeft(0);
    setFeynmanNote('');
    setLastMastery(null);
    setReference(topic);
    setSelectedCategory(topic.category);
    setLearningMode(topic.level);
    setIsDailyTopicActive(false);
    setIsLibraryOpen(false);
    setIsSearchOpen(false);
    setScreen('app');
  };

  const copyShareText = () => {
    if (!reference) return;
    const text = `🧠 Hoje aprendi no Desemburrar sobre "${reference.title}" (${reference.category}):\n\n"${reference.description}"\n\n🔗 Descubra e expanda seu conhecimento também: https://github.com/nkolau/desemburrar`;
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        if (e.key === 'Escape') {
          setIsSearchOpen(false);
          setIsLibraryOpen(false);
          setIsShareModalOpen(false);
          setIsElectionsOpen(false);
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
        return;
      }
      if (e.key === '/') {
        e.preventDefault();
        setIsSearchOpen(true);
        return;
      }

      if (e.code === 'Space' && screen === 'app' && !isSearchOpen && !isLibraryOpen && !isShareModalOpen && !isElectionsOpen) {
        e.preventDefault();
        generateRandomReference(learningMode, selectedCategory);
        return;
      }

      if (e.key.toLowerCase() === 'f' && reference) {
        e.preventDefault();
        toggleFavorite(reference);
        return;
      }

      if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsLibraryOpen(prev => !prev);
        return;
      }

      if (e.key.toLowerCase() === 's' && screen === 'app') {
        e.preventDefault();
        setIsShareModalOpen(prev => !prev);
        return;
      }

      if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        setFontStyle(prev => prev === 'sans' ? 'serif' : 'sans');
        return;
      }

      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsLibraryOpen(false);
        setIsShareModalOpen(false);
        setIsElectionsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, learningMode, selectedCategory, reference, isSearchOpen, isLibraryOpen, isShareModalOpen, isElectionsOpen, generateRandomReference]);

  // Timer Tick
  useEffect(() => {
    if ((timerPhase === 'reading' || timerPhase === 'assimilating') && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            if (timerPhase === 'reading') {
              setTimerPhase('assimilation_ready');
              return 120;
            } else if (timerPhase === 'assimilating') {
              setTimerPhase('evaluating');
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerPhase, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isCurrentFavorite = reference ? favorites.some((f) => f.id === reference.id) : false;
  const currentHistoryItem = reference ? history.find((h) => h.id === reference.id) : null;

  return (
    <div className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-slate-950 transition-colors duration-1000 ease-in-out font-sans text-slate-50 selection:bg-white/20">
      
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full mix-blend-screen filter blur-[100px] opacity-30 transition-all duration-1000 ease-in-out ${learningMode === 'basic' ? 'bg-emerald-600/40' : 'bg-purple-700/40'}`}></div>
        <div className={`absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[120px] opacity-20 transition-all duration-1000 ease-in-out ${learningMode === 'basic' ? 'bg-teal-600/50' : 'bg-indigo-700/50'}`}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-start min-h-screen p-4 sm:p-8 pb-36">
        
        {screen === 'intro' ? (
          <div className="w-full max-w-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-700 mt-10 sm:mt-14">
            <div className="mb-6 p-4 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 shadow-2xl">
              <BookOpen size={40} className={learningMode === 'basic' ? "text-emerald-400" : "text-purple-400"} />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-3 drop-shadow-md">
              Desemburrar
            </h1>
            
            <p className="text-base sm:text-lg text-slate-200 mb-3 leading-relaxed font-light">
              Uma ferramenta projetada para ajudar você a ler mais, descobrir novas perspectivas e expandir sua bagagem cultural.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 mb-6 max-w-xl font-light">
              Explore mais de <strong>500 referências curadas</strong> em 13 áreas do saber e consolide seu aprendizado com a Técnica Feynman.
            </p>

            {/* Quick Actions (Tema do Dia & Especial Eleições) */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2.5">
              {/* Tema de Hoje */}
              <button
                onClick={selectDailyTopic}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-semibold transition-all shadow-lg backdrop-blur-md hover:scale-105"
              >
                <Calendar size={15} className="text-amber-400" />
                <span>Tema de Hoje ({dailyTopicInfo?.dateFormatted})</span>
              </button>

              {/* Especial Eleições 2026 */}
              <button
                onClick={() => setIsElectionsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600/30 via-yellow-500/20 to-blue-600/30 hover:from-emerald-600/40 hover:to-blue-600/40 border border-yellow-500/40 text-yellow-200 text-xs sm:text-sm font-semibold transition-all shadow-lg backdrop-blur-md hover:scale-105"
              >
                <Vote size={15} className="text-yellow-400" />
                <span>🇧🇷 Especial Eleições 2026</span>
              </button>
            </div>

            {/* Quick Stats Banner */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-2.5">
              {streak > 0 && (
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md shadow-lg">
                  <Flame size={14} className="fill-amber-400 text-amber-400 animate-pulse" />
                  <span>{streak} {streak === 1 ? 'dia seguido' : 'dias seguidos'}</span>
                </div>
              )}

              {(history.length > 0 || favorites.length > 0) && (
                <button
                  onClick={() => setIsLibraryOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-slate-200 transition-all shadow-lg backdrop-blur-md"
                >
                  <BookmarkCheck size={14} className="text-amber-400" />
                  <span>Sua Biblioteca: <strong>{history.length}</strong> estudados • <strong>{favorites.length}</strong> salvos</span>
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-md">
              <button
                onClick={() => handleModeSwitch('basic')}
                className={`flex-1 flex flex-col items-center gap-2 p-5 rounded-3xl border transition-all duration-300 ${
                  learningMode === 'basic' 
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.15)] scale-105' 
                    : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                <Brain size={28} />
                <div className="flex flex-col">
                  <span className="font-semibold text-base">Essencial</span>
                  <span className="text-[11px] opacity-70">Conceitos chave</span>
                </div>
              </button>

              <button
                onClick={() => handleModeSwitch('deep')}
                className={`flex-1 flex flex-col items-center gap-2 p-5 rounded-3xl border transition-all duration-300 ${
                  learningMode === 'deep' 
                    ? 'border-purple-500/50 bg-purple-500/10 text-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.15)] scale-105' 
                    : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                <BrainCircuit size={28} />
                <div className="flex flex-col">
                  <span className="font-semibold text-base">Profundo</span>
                  <span className="text-[11px] opacity-70">Teorias densas</span>
                </div>
              </button>
            </div>

            <button
              onClick={startApp}
              className="group relative px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-900 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              Começar a explorar
            </button>
          </div>

        ) : (
          <div className="w-full flex flex-col items-center">
            
            {/* Header Navigation */}
            <div className="w-full max-w-5xl flex items-center justify-between mb-4 pt-1 gap-2">
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setScreen('intro')}
                  className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 backdrop-blur-sm"
                  title="Voltar ao início"
                >
                  <ArrowLeft size={18} />
                  <span className="hidden sm:inline text-xs font-medium">Início</span>
                </button>

                {/* Especial Eleições 2026 Button */}
                <button
                  onClick={() => setIsElectionsOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-600/30 to-blue-600/30 hover:from-emerald-600/40 hover:to-blue-600/40 border border-yellow-500/40 text-yellow-200 text-xs font-bold transition-all shadow-md backdrop-blur-md hover:scale-105"
                  title="Especial Eleições 2026"
                >
                  <Vote size={14} className="text-yellow-400" />
                  <span className="hidden sm:inline">Eleições 2026</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-yellow-400/20 text-[9px] text-yellow-300 font-extrabold uppercase">Novo</span>
                </button>

                {/* Tema do Dia Quick Trigger */}
                <button
                  onClick={selectDailyTopic}
                  className={`p-2 sm:px-3 sm:py-1.5 rounded-full border text-xs font-semibold transition-all backdrop-blur-md flex items-center gap-1.5 ${
                    isDailyTopicActive 
                      ? 'bg-amber-500/30 border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                      : 'bg-white/10 hover:bg-white/20 border-white/15 text-slate-200'
                  }`}
                  title="Ver o Tema Fixo do Dia"
                >
                  <Calendar size={14} className="text-amber-400" />
                  <span className="hidden md:inline">Tema do Dia</span>
                </button>
              </div>

              {/* Central Mode Switcher */}
              <div className="flex bg-slate-950/40 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg">
                <button
                  onClick={() => handleModeSwitch('basic')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    learningMode === 'basic' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Essencial
                </button>
                <button
                  onClick={() => handleModeSwitch('deep')}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    learningMode === 'deep' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Profundo
                </button>
              </div>

              {/* Right Action Icons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                
                {/* Search Trigger */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-xs font-medium transition-all backdrop-blur-md flex items-center gap-1.5"
                  title="Buscar tema (Atalho: Ctrl+K ou /)"
                >
                  <Search size={15} />
                  <span className="hidden lg:inline">Buscar</span>
                  <kbd className="hidden lg:inline px-1.5 py-0.5 rounded bg-black/40 text-[9px] text-slate-400 border border-white/10">⌘K</kbd>
                </button>

                {/* Lo-Fi Ambient Sound Toggle */}
                <button
                  onClick={toggleSound}
                  className={`p-2 rounded-full border transition-all backdrop-blur-md ${
                    isSoundOn 
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                      : 'bg-white/10 hover:bg-white/20 border-white/15 text-slate-300'
                  }`}
                  title={isSoundOn ? "Desativar som de foco Lo-Fi" : "Ativar som ambiente de foco (Chuva Lo-Fi)"}
                >
                  {isSoundOn ? <Volume2 size={16} className="animate-pulse" /> : <VolumeX size={16} />}
                </button>

                {/* Library Button */}
                <button
                  onClick={() => setIsLibraryOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-xs font-medium transition-all backdrop-blur-md"
                  title="Ver favoritos e histórico (Atalho: B)"
                >
                  <BookmarkCheck size={15} className="text-amber-400" />
                  <span className="hidden sm:inline">Biblioteca</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-bold">
                    {favorites.length + history.length}
                  </span>
                </button>

              </div>
            </div>

            {/* Categories Filter */}
            <div className="w-full max-w-5xl mb-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10">
              <div className="flex gap-2.5 min-w-max px-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySwitch(cat)}
                    className={`flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border shadow-md ${
                      selectedCategory === cat 
                        ? (learningMode === 'basic' ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300 shadow-emerald-500/10 scale-105' : 'border-purple-500/50 bg-purple-500/20 text-purple-300 shadow-purple-500/10 scale-105')
                        : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 hover:scale-105'
                    }`}
                  >
                    <img 
                      src={getCategoryImage(cat)} 
                      alt={cat} 
                      className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-inner"
                    />
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full max-w-5xl flex flex-col lg:flex-row items-stretch gap-6">
              
              {/* TOPIC CARD */}
              <div 
                className={`flex-1 transition-all duration-500 ease-out flex flex-col ${
                  isAnimating ? 'opacity-0 translate-y-4 scale-95 filter blur-sm' : 'opacity-100 translate-y-0 scale-100 filter blur-0'
                }`}
              >
                {reference ? (
                  <div className="flex flex-col h-full bg-slate-950/40 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden relative">
                    
                    {/* Banner Image */}
                    <div className="w-full h-36 sm:h-44 relative shrink-0 border-b border-white/10">
                      <img 
                        src={getCategoryImage(reference.category)} 
                        alt={reference.category} 
                        className="w-full h-full object-cover opacity-75 transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent"></div>
                      
                      {/* Left Category, Daily Topic & History Badges */}
                      <div className="absolute bottom-4 left-6 sm:left-8 flex flex-wrap items-center gap-2">
                        <span className={`px-3.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest shadow-lg ${
                          reference.level === 'basic' 
                            ? 'border-emerald-500/40 bg-emerald-500/40 text-emerald-50 backdrop-blur-md'
                            : 'border-purple-500/40 bg-purple-500/40 text-purple-50 backdrop-blur-md'
                        }`}>
                          {reference.category}
                        </span>

                        {isDailyTopicActive && (
                          <span className="flex items-center gap-1 text-[10px] px-3 py-1 rounded-full bg-amber-500/30 border border-amber-500/50 text-amber-200 font-bold backdrop-blur-md shadow-lg">
                            <Calendar size={12} className="text-amber-400" />
                            <span>Tema de Hoje</span>
                          </span>
                        )}

                        {currentHistoryItem && (
                          <span className="flex items-center gap-1 text-[10px] px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 font-semibold backdrop-blur-md">
                            <Check size={12} />
                            <span>
                              {currentHistoryItem.mastery === 'dominado' ? 'Dominado 🏆' : currentHistoryItem.mastery === 'basico' ? 'Básico 💡' : 'Revisar 📖'}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Right Utilities: Font Toggle, Share, Favorite */}
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        {/* Font Switcher */}
                        <button
                          onClick={() => setFontStyle(prev => prev === 'sans' ? 'serif' : 'sans')}
                          title={fontFamily === 'serif' ? "Mudar para fonte sem serifa" : "Mudar para fonte serifada editorial"}
                          className="p-2.5 rounded-full backdrop-blur-md border bg-black/40 border-white/20 text-slate-300 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
                        >
                          <Type size={16} />
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={() => setIsShareModalOpen(true)}
                          title="Compartilhar tema nas redes (Atalho: S)"
                          className="p-2.5 rounded-full backdrop-blur-md border bg-black/40 border-white/20 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <Share2 size={16} />
                        </button>

                        {/* Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(reference)}
                          title={isCurrentFavorite ? "Remover dos favoritos (F)" : "Salvar nos favoritos (F)"}
                          className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                            isCurrentFavorite 
                              ? 'bg-amber-500/20 border-amber-500/60 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105' 
                              : 'bg-black/40 border-white/20 text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <Star size={16} fill={isCurrentFavorite ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 flex flex-col flex-1">
                      <div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2 leading-[1.15] drop-shadow-md">
                          {reference.title}
                        </h1>
                        <p className="text-base sm:text-lg text-slate-300 font-medium flex items-center gap-2">
                          <span className="opacity-60 text-sm">fonte:</span> {reference.author_or_source}
                        </p>
                      </div>

                      <div className="w-12 h-1 bg-white/20 rounded-full my-4 shrink-0"></div>

                      {/* Description with Dynamic Font Style */}
                      <div className="flex-1 overflow-y-auto pr-2 max-h-[26vh] sm:max-h-[32vh] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent mb-4">
                        <p className={`text-base sm:text-lg ${fontFamily === 'serif' ? 'font-serif text-slate-100 tracking-wide leading-relaxed' : 'font-sans text-slate-200 leading-relaxed font-light'}`}>
                          {reference.description}
                        </p>
                      </div>

                      {/* Socratic Provocation Card */}
                      <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 mb-4 flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                          <Lightbulb size={16} />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider block mb-0.5">
                            Provocação de Reflexão
                          </span>
                          <p className="text-xs text-slate-300 italic leading-relaxed">
                            {getSocraticProvocation(reference.category, reference.title)}
                          </p>
                        </div>
                      </div>

                      {/* Connected Topics (Teia do Conhecimento) */}
                      {relatedTopics.length > 0 && (
                        <div className="pt-2 pb-3 border-t border-white/5 flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                            <Compass size={13} className="text-purple-400" />
                            <span>Conexões:</span>
                          </div>
                          {relatedTopics.map(rel => (
                            <button
                              key={rel.id}
                              onClick={() => selectTopicDirectly(rel)}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all hover:scale-105"
                            >
                              {rel.title} →
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Bottom Footer Actions */}
                      {reference.link && (
                        <div className="pt-3 mt-auto shrink-0 flex items-center justify-between">
                          <a 
                            href={reference.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 font-medium transition-colors w-fit group px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm ${
                              reference.level === 'basic' ? 'text-emerald-300 hover:text-emerald-200' : 'text-purple-300 hover:text-purple-200'
                            }`}
                          >
                            <span>Artigo na Wikipédia</span>
                            <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </a>

                          <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                            <span>Espaço: Próximo</span>
                            <span>•</span>
                            <span>F: Favorito</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full bg-slate-950/20 backdrop-blur-lg rounded-[2rem] border border-white/5 overflow-hidden animate-pulse">
                    <div className="w-full h-36 sm:h-44 bg-white/10 shrink-0"></div>
                    <div className="p-6 sm:p-8">
                      <div className="w-3/4 h-10 bg-white/10 rounded-2xl mb-2"></div>
                      <div className="w-1/2 h-6 bg-white/10 rounded-lg mb-4"></div>
                      <div className="w-full h-32 bg-white/10 rounded-2xl mt-4"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* TIMER & FEYNMAN ASSIMILATION PANEL */}
              <div className="lg:w-[340px] shrink-0 bg-slate-950/40 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col justify-center min-h-[320px]">
                
                {/* IDLE PHASE */}
                {timerPhase === 'idle' && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="p-3 bg-white/5 rounded-full mb-1">
                      <Clock size={28} className="text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-white text-center">Modo de Foco</h3>
                    <p className="text-xs text-slate-400 text-center mb-1">
                      Defina o tempo de leitura antes do teste de assimilação Feynman.
                    </p>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {[5, 10, 15, 20].map(mins => (
                        <button 
                          key={mins}
                          onClick={() => startReadingTimer(mins)}
                          className="py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 transition-all font-semibold text-slate-200 text-sm"
                        >
                          {mins} min
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* READING PHASE */}
                {timerPhase === 'reading' && (
                  <div className="flex flex-col items-center gap-3 w-full animate-in fade-in zoom-in">
                    <div className="text-slate-400 font-medium tracking-wide uppercase text-xs">Tempo de Leitura</div>
                    <div className="text-5xl font-bold font-mono tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] my-1">
                      {formatTime(timeLeft)}
                    </div>

                    {isSoundOn && (
                      <span className="text-[11px] text-cyan-300 flex items-center gap-1 animate-pulse">
                        <Volume2 size={12} /> Áudio Lo-Fi ativado
                      </span>
                    )}

                    <div className="flex flex-col gap-2 w-full mt-2">
                      <button 
                        onClick={finishReading}
                        className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                      >
                        <CheckCircle2 size={18} /> Ir para Assimilação
                      </button>
                      <button 
                        onClick={cancelTimer}
                        className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-xs font-medium transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* ASSIMILATION READY PHASE */}
                {timerPhase === 'assimilation_ready' && (
                  <div className="flex flex-col items-center gap-4 w-full animate-in fade-in zoom-in text-center">
                    <div className="p-3 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                      <Brain size={32} className="text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Técnica Feynman</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Explique o conceito em voz alta ou anote com suas próprias palavras para fixar.
                      </p>
                    </div>
                    <button 
                      onClick={startAssimilationTimer}
                      className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.2)] mt-1 text-sm"
                    >
                      <Play size={16} fill="currentColor" /> Iniciar 2 Minutos
                    </button>
                  </div>
                )}

                {/* ASSIMILATING PHASE (WITH NOTE TAKING) */}
                {timerPhase === 'assimilating' && (
                  <div className="flex flex-col items-center gap-3 w-full animate-in fade-in zoom-in">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-yellow-400 font-medium tracking-wide uppercase text-xs">Explicando</span>
                      <span className="text-2xl font-bold font-mono text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]">
                        {formatTime(timeLeft)}
                      </span>
                    </div>

                    <textarea
                      value={feynmanNote}
                      onChange={(e) => setFeynmanNote(e.target.value)}
                      placeholder="Anote sua explicação simples com suas palavras..."
                      className="w-full h-24 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-yellow-400/50 resize-none font-sans"
                    />

                    <button 
                      onClick={() => setTimerPhase('evaluating')}
                      className="w-full py-2.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-semibold text-xs transition-all flex items-center justify-center gap-2 border border-yellow-500/30 mt-1"
                    >
                      <CheckCircle2 size={15} /> Finalizar e Avaliar
                    </button>
                  </div>
                )}

                {/* EVALUATION PHASE (MASTERY RATING) */}
                {timerPhase === 'evaluating' && (
                  <div className="flex flex-col items-center gap-3 w-full animate-in fade-in zoom-in text-center">
                    <div className="p-2.5 bg-purple-500/20 rounded-full border border-purple-500/30 mb-1">
                      <Sparkles size={24} className="text-purple-300" />
                    </div>
                    <h3 className="text-base font-bold text-white">Como foi sua assimilação?</h3>
                    <p className="text-xs text-slate-400 mb-2">
                      Classifique seu domínio para registrar no histórico.
                    </p>

                    <div className="flex flex-col gap-2 w-full">
                      <button
                        onClick={() => handleSaveMastery('dominado')}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-between transition-all"
                      >
                        <span>🏆 Dominei o tema!</span>
                        <span className="text-[10px] opacity-70">Explicaria fácil</span>
                      </button>

                      <button
                        onClick={() => handleSaveMastery('basico')}
                        className="w-full py-2.5 px-3 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-300 font-semibold text-xs flex items-center justify-between transition-all"
                      >
                        <span>💡 Entendi o básico</span>
                        <span className="text-[10px] opacity-70">Boa noção</span>
                      </button>

                      <button
                        onClick={() => handleSaveMastery('confuso')}
                        className="w-full py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-semibold text-xs flex items-center justify-between transition-all"
                      >
                        <span>📖 Ainda confuso</span>
                        <span className="text-[10px] opacity-70">Revisar depois</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* DONE PHASE */}
                {timerPhase === 'done' && (
                  <div className="flex flex-col items-center gap-3 w-full animate-in fade-in zoom-in text-center">
                    <div className="p-3 bg-emerald-500/20 rounded-full">
                      <CheckCircle2 size={36} className="text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Salvo no Histórico!</h3>
                      <p className="text-xs text-slate-300 mt-1">
                        {lastMastery === 'dominado' && 'Parabéns! Você consolidou este tema com maestria.'}
                        {lastMastery === 'basico' && 'Bom trabalho! O conceito essencial foi absorvido.'}
                        {lastMastery === 'confuso' && 'Sem problemas! Você pode revisitar este tema na sua biblioteca.'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setTimerPhase('idle');
                        setFeynmanNote('');
                        setLastMastery(null);
                      }}
                      className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition-all mt-2"
                    >
                      Concluir Ciclo
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Floating Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex justify-center pointer-events-none z-20">
              <button
                onClick={() => generateRandomReference(learningMode, selectedCategory)}
                disabled={isAnimating}
                className="pointer-events-auto group relative flex items-center gap-3 px-8 py-3.5 bg-white hover:bg-slate-200 text-slate-900 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              >
                <RefreshCw size={20} className={`${isAnimating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                <span>Sortear Tema</span>
                <span className="hidden sm:inline text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-900/10 text-slate-600">
                  Espaço
                </span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* SPECIAL ELECTIONS 2026 MODAL */}
      {isElectionsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[90vh] bg-slate-950/95 border border-emerald-500/30 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Elections Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-emerald-950/40 via-slate-900/50 to-blue-950/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-yellow-500/20 border border-yellow-500/30 rounded-2xl text-yellow-400 shadow-inner">
                  <Vote size={26} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Especial Eleições 2026 🇧🇷
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-[10px] font-extrabold uppercase border border-yellow-400/30">
                      TSE Oficial
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Guia enciclopédico e neutro de cidadania para o processo democrático brasileiro
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsElectionsOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Elections Tabs */}
            <div className="flex border-b border-white/10 bg-slate-950/70 p-1.5 gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setElectionsTab('candidatos')}
                className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  electionsTab === 'candidatos' 
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UserCheck size={14} />
                <span>Candidatos ({electionsData.candidates_2026.length})</span>
              </button>

              <button
                onClick={() => setElectionsTab('planos')}
                className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  electionsTab === 'planos' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText size={14} />
                <span>Análise dos Planos</span>
              </button>

              <button
                onClick={() => setElectionsTab('marcos')}
                className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  electionsTab === 'marcos' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Landmark size={14} />
                <span>Marcos Históricos</span>
              </button>

              <button
                onClick={() => setElectionsTab('curiosidades')}
                className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  electionsTab === 'curiosidades' 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lightbulb size={14} />
                <span>Curiosidades do Voto</span>
              </button>
            </div>

            {/* Elections Content Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10">
              
              {/* TAB 1: CANDIDATOS 2026 */}
              {electionsTab === 'candidatos' && (
                <div className="flex flex-col gap-4">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                    <Info size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Painel com estrutura e critérios estritamente isonômicos para todas as candidaturas registradas no TSE para a Presidência da República em 2026. Dados factuais extraídos do sistema <strong>DivulgaCandContas</strong>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {electionsData.candidates_2026.map(cand => (
                      <div
                        key={cand.id}
                        className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 flex flex-col justify-between transition-all"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-300">
                                  {cand.number}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                                  {cand.status}
                                </span>
                              </div>
                              <h3 className="text-lg font-bold text-white leading-tight">
                                {cand.ballot_name}
                              </h3>
                              <span className="text-xs text-slate-400">
                                {cand.full_name}
                              </span>
                            </div>
                          </div>

                          <div className="text-[11px] text-yellow-400/90 font-medium mb-3">
                            {cand.party} • <span className="text-slate-400">{cand.coalition}</span>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                                Trajetória Política:
                              </span>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {cand.trajectory}
                              </p>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                                Eixos Principais das Propostas:
                              </span>
                              <p className="text-xs text-slate-300 leading-relaxed italic bg-white/5 p-2 rounded-xl border border-white/5">
                                "{cand.proposals_summary}"
                              </p>
                            </div>
                          </div>

                          {cand.detailed_analysis && (
                            <button
                              onClick={() => {
                                setSelectedPlanCandidateId(cand.id);
                                setElectionsTab('planos');
                              }}
                              className="w-full mt-2 mb-3 py-2 px-3 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01]"
                            >
                              <FileText size={13} />
                              <span>Ler Análise Completa do Plano</span>
                              <span>→</span>
                            </button>
                          )}
                        </div>

                        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                          <span className="text-[10px] text-slate-500">Fonte: TSE / DivulgaCand</span>
                          <a 
                            href={cand.source_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                          >
                            <span>Consultar Registro</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: ANÁLISE DOS PLANOS DE GOVERNO */}
              {electionsTab === 'planos' && (
                <div className="flex flex-col gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                    <FileText size={20} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white mb-0.5">Análise Comparativa dos Planos de Governo</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Exame analítico e aprofundado das diretrizes macroeconômicas, tributárias, penais, trabalhistas e institucionais das candidaturas à Presidência da República em 2026.
                      </p>
                    </div>
                  </div>

                  {/* Candidate Switcher Pills */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
                    {electionsData.candidates_2026.filter(c => c.detailed_analysis).map(c => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedPlanCandidateId(c.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                          selectedPlanCandidateId === c.id 
                            ? 'bg-yellow-500/25 border-yellow-500/60 text-yellow-300 shadow-md scale-105' 
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        <span className="font-mono font-bold opacity-80">{c.number}</span>
                        <span>{c.ballot_name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Detailed Analysis View */}
                  {currentPlanCandidate && currentPlanCandidate.detailed_analysis ? (
                    <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.04] border border-white/15 flex flex-col gap-4 animate-in fade-in duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xl font-mono font-extrabold px-3 py-0.5 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-300">
                              {currentPlanCandidate.number}
                            </span>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                              {currentPlanCandidate.status}
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            {currentPlanCandidate.detailed_analysis.ticket_header}
                          </h3>
                          <p className="text-xs sm:text-sm text-yellow-400/90 font-medium mt-0.5">
                            {currentPlanCandidate.detailed_analysis.ticket_coalition}
                          </p>
                        </div>

                        <a 
                          href={currentPlanCandidate.source_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs text-emerald-300 hover:text-emerald-200 font-medium transition-all flex items-center gap-1.5 w-fit shrink-0"
                        >
                          <span>Consultar no JOTA / TSE</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>

                      {/* Text Paragraphs */}
                      <div className="flex flex-col gap-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                        {currentPlanCandidate.detailed_analysis.text.split('\n\n').map((paragraph, pIdx) => (
                          <div key={pIdx} className="bg-white/[0.02] hover:bg-white/[0.03] p-4 sm:p-5 rounded-2xl border border-white/5 shadow-inner transition-colors">
                            <p>{paragraph}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-400 text-sm">
                      Selecione um candidato acima para visualizar a análise completa do plano de governo.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MARCOS HISTÓRICOS & FIGURAS */}
              {electionsTab === 'marcos' && (
                <div className="flex flex-col gap-6">
                  
                  {/* Linha do Tempo */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                      <Landmark size={16} /> Marcos Históricos da Democracia
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {electionsData.milestones.map(m => (
                        <div key={m.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {m.year}
                          </span>
                          <h4 className="text-sm font-bold text-white mt-2 mb-1">{m.title}</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">{m.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Figuras Históricas */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-yellow-400 mb-3 flex items-center gap-2">
                      <UserCheck size={16} /> Figuras Históricas da Cidadania
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {electionsData.historical_figures.map((fig, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                          <h4 className="text-sm font-bold text-white">{fig.name}</h4>
                          <span className="text-[11px] text-yellow-400/90 font-medium block mb-1.5">{fig.role}</span>
                          <p className="text-xs text-slate-300 leading-relaxed">{fig.bio}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: CURIOSIDADES */}
              {electionsTab === 'curiosidades' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {electionsData.curiosities.map(c => (
                    <div key={c.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {c.tag}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-2 mb-1.5">{c.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Legal Notice Footer */}
            <div className="p-4 bg-slate-950 border-t border-white/10 flex items-start gap-2.5 text-[11px] text-slate-400">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {electionsData.notice}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* COMMAND PALETTE / SEARCH MODAL (Ctrl + K) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-slate-900/95 border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <Search size={20} className="text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por tema, categoria ou conceito em 500+ referências..."
                className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none text-base font-sans"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 flex flex-col gap-1.5">
              {searchQuery.trim() === '' ? (
                <div className="py-10 text-center text-slate-500 text-xs">
                  Digite para pesquisar em 500+ tópicos de Filosofia, Física, História, Literatura e mais...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-sm">
                  Nenhum tema encontrado para "{searchQuery}".
                </div>
              ) : (
                searchResults.map(item => (
                  <div
                    key={item.id}
                    onClick={() => selectTopicDirectly(item)}
                    className="p-3 rounded-xl hover:bg-white/10 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex flex-col pr-3">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] px-2 py-0.2 rounded bg-white/10 text-slate-300 font-semibold uppercase">
                          {item.category}
                        </span>
                        <span className={`text-[10px] font-semibold ${item.level === 'basic' ? 'text-emerald-400' : 'text-purple-400'}`}>
                          {item.level === 'basic' ? 'Essencial' : 'Profundo'}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                    <ExternalLink size={14} className="text-slate-500 group-hover:text-white shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-950/60 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 px-4">
              <span>Navegue rápido pelos 500+ temas</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">Esc para fechar</kbd>
            </div>
          </div>
        </div>
      )}

      {/* SHARE PREVIEW MODAL */}
      {isShareModalOpen && reference && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-900/95 border border-white/20 rounded-3xl shadow-2xl p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold">
                <Share2 size={18} className="text-purple-400" />
                <span>Compartilhar Conhecimento</span>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Formatted Card Preview */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/15 flex flex-col gap-3 font-sans">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                  Desemburrar • {reference.category}
                </span>
                <span className="text-[11px] text-slate-400">{reference.author_or_source}</span>
              </div>
              <h3 className="text-xl font-bold text-white leading-snug">
                "{reference.title}"
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed italic line-clamp-3">
                {reference.description}
              </p>
              <div className="pt-2 border-t border-white/10 text-[11px] text-slate-500">
                Aprenda todos os dias em desemburrar.vercel.app
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={copyShareText}
                className="flex-1 py-3 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                {copiedNotification ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                <span>{copiedNotification ? 'Copiado para o Clipboard!' : 'Copiar Texto para LinkedIn / WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIBRARY MODAL (FAVORITES & HISTORY) */}
      {isLibraryOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl max-h-[85vh] bg-slate-900/95 border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
                  <BookmarkCheck size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Meus Estudos</h2>
                  <p className="text-xs text-slate-400">Acompanhe seu progresso e temas salvos</p>
                </div>
              </div>
              <button
                onClick={() => setIsLibraryOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-white/10 bg-slate-950/40 p-1.5 gap-1.5">
              <button
                onClick={() => setLibraryTab('favorites')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  libraryTab === 'favorites' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Star size={14} fill={libraryTab === 'favorites' ? "currentColor" : "none"} />
                <span>Favoritos ({favorites.length})</span>
              </button>

              <button
                onClick={() => setLibraryTab('history')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  libraryTab === 'history' 
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <History size={14} />
                <span>Histórico de Estudos ({history.length})</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10">
              
              {/* FAVORITES TAB */}
              {libraryTab === 'favorites' && (
                <div>
                  {favorites.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400">
                      <Star size={40} className="stroke-slate-600 mb-3" />
                      <p className="text-sm font-medium text-slate-300">Nenhum favorito salvo ainda</p>
                      <p className="text-xs text-slate-500 max-w-xs mt-1">
                        Pressione <kbd className="px-1 py-0.5 rounded bg-white/10 text-[10px]">F</kbd> ou clique na estrelinha de qualquer tema para salvar.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {favorites.map((fav) => (
                        <div
                          key={fav.id}
                          onClick={() => selectTopicDirectly(fav)}
                          className="group p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01]"
                        >
                          <div className="flex flex-col gap-1 pr-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-semibold uppercase text-[10px]">
                                {fav.category}
                              </span>
                              <span className={`text-[10px] font-semibold ${fav.level === 'basic' ? 'text-emerald-400' : 'text-purple-400'}`}>
                                {fav.level === 'basic' ? 'Essencial' : 'Profundo'}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                              {fav.title}
                            </h4>
                          </div>
                          <button
                            onClick={(e) => removeFavorite(fav.id, e)}
                            title="Remover dos favoritos"
                            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* HISTORY TAB */}
              {libraryTab === 'history' && (
                <div>
                  {history.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400">
                      <History size={40} className="stroke-slate-600 mb-3" />
                      <p className="text-sm font-medium text-slate-300">Histórico vazio</p>
                      <p className="text-xs text-slate-500 max-w-xs mt-1">
                        Complete uma sessão de foco e passe pela assimilação Feynman para registrar aqui!
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between pb-2 mb-1 border-b border-white/5">
                        <span className="text-xs text-slate-400">
                          Total de <strong>{history.length}</strong> conceitos assimilados
                        </span>
                        <button
                          onClick={clearHistory}
                          className="text-[11px] text-rose-400/80 hover:text-rose-300 transition-colors"
                        >
                          Limpar tudo
                        </button>
                      </div>

                      {history.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => selectTopicDirectly(item)}
                          className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-semibold uppercase">
                                {item.category}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {item.date}
                              </span>
                            </div>

                            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                              item.mastery === 'dominado' 
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                                : item.mastery === 'basico'
                                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}>
                              {item.mastery === 'dominado' && '🏆 Dominado'}
                              {item.mastery === 'basico' && '💡 Básico'}
                              {item.mastery === 'confuso' && '📖 Revisar'}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                            {item.title}
                          </h4>

                          {item.note && (
                            <p className="text-xs text-slate-300 italic bg-white/5 p-2.5 rounded-xl border border-white/5 line-clamp-2">
                              "{item.note}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
