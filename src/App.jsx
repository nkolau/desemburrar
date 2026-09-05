import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  BookOpen, RefreshCw, ExternalLink, ArrowLeft, BrainCircuit, Brain, Clock, 
  CheckCircle2, Play, Square, Star, BookmarkCheck, History, X, Trash2, Check, Sparkles 
} from 'lucide-react';
import referencesData from './data/references.json';

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
  'Mitologia': 'https://images.unsplash.com/photo-1601002766343-7f284fb41c23?w=400&q=80',
  'Física': 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&q=80',
  'Todas': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&q=80'
};

const getCategoryImage = (cat) => {
  if (!cat) return 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80';
  const found = Object.keys(CATEGORY_IMAGES).find(k => cat.toLowerCase().includes(k.toLowerCase()));
  return found ? CATEGORY_IMAGES[found] : 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80';
};

function App() {
  const [screen, setScreen] = useState('intro');
  const [learningMode, setLearningMode] = useState('basic');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [reference, setReference] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Timer states: 'idle', 'reading', 'assimilation_ready', 'assimilating', 'evaluating', 'done'
  const [timerPhase, setTimerPhase] = useState('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  // Assimilation / Feynman Notes & Mastery
  const [feynmanNote, setFeynmanNote] = useState('');
  const [lastMastery, setLastMastery] = useState(null); // 'confuso' | 'basico' | 'dominado'

  // Library / LocalStorage States
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

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryTab, setLibraryTab] = useState('favorites'); // 'favorites' | 'history'

  // Extract unique categories
  const categories = ['Todas', ...Array.from(new Set(referencesData.map(r => r.category)))].sort();

  const generateRandomReference = useCallback((mode, category) => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    clearInterval(timerRef.current);
    setTimerPhase('idle');
    setTimeLeft(0);
    setFeynmanNote('');
    setLastMastery(null);
    
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
          description: "Não temos temas nesta categoria para o nível selecionado. Tente mudar o nível ou a categoria.",
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

  // Timer Logic
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

  // Save Mastery Rating & Feynman Note to History
  const handleSaveMastery = (masteryLevel) => {
    if (!reference || !reference.id) return;
    setLastMastery(masteryLevel);

    const record = {
      id: reference.id,
      title: reference.title,
      category: reference.category,
      level: reference.level,
      note: feynmanNote.trim(),
      mastery: masteryLevel, // 'confuso' | 'basico' | 'dominado'
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

  // Toggle Favorite
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

  const selectTopicFromLibrary = (item) => {
    const fullTopic = referencesData.find((r) => r.id === item.id);
    if (fullTopic) {
      clearInterval(timerRef.current);
      setTimerPhase('idle');
      setTimeLeft(0);
      setFeynmanNote('');
      setLastMastery(null);
      setReference(fullTopic);
      setSelectedCategory(fullTopic.category);
      setLearningMode(fullTopic.level);
      setIsLibraryOpen(false);
      setScreen('app');
    }
  };

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
      
      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full mix-blend-screen filter blur-[100px] opacity-30 transition-all duration-1000 ease-in-out ${learningMode === 'basic' ? 'bg-emerald-600/40' : 'bg-purple-700/40'}`}></div>
        <div className={`absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen filter blur-[120px] opacity-20 transition-all duration-1000 ease-in-out ${learningMode === 'basic' ? 'bg-teal-600/50' : 'bg-indigo-700/50'}`}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-start min-h-screen p-4 sm:p-8 pb-32">
        
        {screen === 'intro' ? (
          <div className="w-full max-w-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-700 mt-12 sm:mt-20">
            <div className="mb-6 p-4 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 shadow-2xl">
              <BookOpen size={40} className={learningMode === 'basic' ? "text-emerald-400" : "text-purple-400"} />
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-md">
              Desemburrar
            </h1>
            
            <p className="text-lg text-slate-200 mb-4 leading-relaxed font-light">
              Uma ferramenta projetada para ajudar você a ler mais, descobrir novas perspectivas e expandir sua bagagem cultural.
            </p>
            <p className="text-base text-slate-300 mb-6 max-w-xl font-light">
              Escolha seu nível e comece a explorar centenas de tópicos com a Técnica Feynman.
            </p>

            {(history.length > 0 || favorites.length > 0) && (
              <div className="mb-8 flex items-center gap-3">
                <button
                  onClick={() => { setIsLibraryOpen(true); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-sm text-slate-200 transition-all shadow-lg backdrop-blur-md"
                >
                  <BookmarkCheck size={16} className="text-amber-400" />
                  <span>Sua Biblioteca: <strong>{history.length}</strong> estudados • <strong>{favorites.length}</strong> salvos</span>
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full max-w-md">
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
                </div>
              </button>
            </div>

            <button
              onClick={startApp}
              className="group relative px-8 py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              Começar a explorar
            </button>
          </div>

        ) : (
          <div className="w-full flex flex-col items-center">
            
            {/* Header Navigation */}
            <div className="w-full max-w-5xl flex items-center justify-between mb-4 pt-2 gap-2">
              <button 
                onClick={() => setScreen('intro')}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 backdrop-blur-sm"
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline font-medium">Início</span>
              </button>

              {/* Central Mode Switcher */}
              <div className="flex bg-slate-950/40 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg">
                <button
                  onClick={() => handleModeSwitch('basic')}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    learningMode === 'basic' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Essencial
                </button>
                <button
                  onClick={() => handleModeSwitch('deep')}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    learningMode === 'deep' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Profundo
                </button>
              </div>

              {/* Library Button */}
              <button
                onClick={() => setIsLibraryOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 text-sm font-medium transition-all backdrop-blur-md hover:scale-105"
                title="Ver seus favoritos e histórico de estudos"
              >
                <BookmarkCheck size={16} className="text-amber-400" />
                <span className="hidden sm:inline">Biblioteca</span>
                <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
                  {favorites.length + history.length}
                </span>
              </button>
            </div>

            {/* Categories Filter */}
            <div className="w-full max-w-5xl mb-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10">
              <div className="flex gap-3 min-w-max px-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySwitch(cat)}
                    className={`flex items-center gap-3 pl-2 pr-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border shadow-md ${
                      selectedCategory === cat 
                        ? (learningMode === 'basic' ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300 shadow-emerald-500/10 scale-105' : 'border-purple-500/50 bg-purple-500/20 text-purple-300 shadow-purple-500/10 scale-105')
                        : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 hover:scale-105'
                    }`}
                  >
                    <img 
                      src={getCategoryImage(cat)} 
                      alt={cat} 
                      className="w-8 h-8 rounded-full object-cover border border-white/20 shadow-inner"
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
                  <div className="flex flex-col h-full bg-slate-950/40 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
                    
                    {/* Banner Image */}
                    <div className="w-full h-36 sm:h-48 relative shrink-0 border-b border-white/10">
                      <img 
                        src={getCategoryImage(reference.category)} 
                        alt={reference.category} 
                        className="w-full h-full object-cover opacity-70 transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                      
                      <div className="absolute bottom-4 left-6 sm:left-8 flex flex-wrap items-center gap-2">
                        <span className={`px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest shadow-lg ${
                          reference.level === 'basic' 
                            ? 'border-emerald-500/40 bg-emerald-500/40 text-emerald-50 backdrop-blur-md'
                            : 'border-purple-500/40 bg-purple-500/40 text-purple-50 backdrop-blur-md'
                        }`}>
                          {reference.category}
                        </span>

                        {currentHistoryItem && (
                          <span className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 font-semibold backdrop-blur-md">
                            <Check size={12} />
                            <span>
                              {currentHistoryItem.mastery === 'dominado' ? 'Estudado: Dominado 🏆' : currentHistoryItem.mastery === 'basico' ? 'Estudado: Básico 💡' : 'Estudado: Revisar 📖'}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={() => toggleFavorite(reference)}
                        title={isCurrentFavorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
                        className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all ${
                          isCurrentFavorite 
                            ? 'bg-amber-500/20 border-amber-500/60 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105' 
                            : 'bg-black/40 border-white/20 text-slate-300 hover:text-white hover:bg-white/10 hover:scale-105'
                        }`}
                      >
                        <Star size={18} fill={isCurrentFavorite ? "currentColor" : "none"} />
                      </button>
                    </div>

                    <div className="p-6 sm:p-8 flex flex-col flex-1">
                      <div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2 leading-[1.1] drop-shadow-md">
                          {reference.title}
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-300 font-medium flex items-center gap-2">
                          <span className="opacity-60 text-base">por</span> {reference.author_or_source}
                        </p>
                      </div>

                      <div className="w-12 h-1 bg-white/20 rounded-full my-4 shrink-0"></div>

                      <div className="flex-1 overflow-y-auto pr-2 max-h-[25vh] sm:max-h-[35vh] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-light">
                          {reference.description}
                        </p>
                      </div>

                      {reference.link && (
                        <div className="pt-6 mt-auto shrink-0 flex items-center justify-between">
                          <a 
                            href={reference.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 font-medium transition-colors w-fit group px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 ${
                              reference.level === 'basic' ? 'text-emerald-300 hover:text-emerald-200' : 'text-purple-300 hover:text-purple-200'
                            }`}
                          >
                            <span>Ler na Wikipedia</span>
                            <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full bg-slate-950/20 backdrop-blur-lg rounded-[2rem] border border-white/5 overflow-hidden animate-pulse">
                    <div className="w-full h-36 sm:h-48 bg-white/10 shrink-0"></div>
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
                      Defina o tempo de leitura antes do desafio de assimilação Feynman.
                    </p>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {[5, 10, 15, 20].map(mins => (
                        <button 
                          key={mins}
                          onClick={() => startReadingTimer(mins)}
                          className="py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 transition-all font-semibold text-slate-200"
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
                    <div className="flex flex-col gap-2 w-full mt-2">
                      <button 
                        onClick={finishReading}
                        className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                      >
                        <CheckCircle2 size={18} /> Ir para Assimilação
                      </button>
                      <button 
                        onClick={cancelTimer}
                        className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-sm font-medium transition-all"
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
                      <h3 className="text-xl font-bold text-white mb-2">Técnica Feynman</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Explique o conceito em voz alta ou anote com suas próprias palavras para fixar.
                      </p>
                    </div>
                    <button 
                      onClick={startAssimilationTimer}
                      className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.2)] mt-1"
                    >
                      <Play size={18} fill="currentColor" /> Iniciar 2 Minutos
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
                      placeholder="Anote sua explicação com palavras simples (opcional)..."
                      className="w-full h-24 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-yellow-400/50 resize-none font-sans"
                    />

                    <button 
                      onClick={() => setTimerPhase('evaluating')}
                      className="w-full py-2.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 font-semibold text-sm transition-all flex items-center justify-center gap-2 border border-yellow-500/30 mt-1"
                    >
                      <CheckCircle2 size={16} /> Finalizar e Avaliar
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
                        <span className="text-[10px] opacity-70">Explicaria facilmente</span>
                      </button>

                      <button
                        onClick={() => handleSaveMastery('basico')}
                        className="w-full py-2.5 px-3 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-300 font-semibold text-xs flex items-center justify-between transition-all"
                      >
                        <span>💡 Entendi o básico</span>
                        <span className="text-[10px] opacity-70">Boa compreensão</span>
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
                className="pointer-events-auto group relative flex items-center gap-3 px-8 py-3 bg-white hover:bg-slate-200 text-slate-900 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              >
                <RefreshCw size={20} className={`${isAnimating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                <span>Sortear Tema</span>
              </button>
            </div>
          </div>
        )}
      </main>

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
                        Clique na estrelinha no canto do tema para salvar e revisitar quando quiser.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      {favorites.map((fav) => (
                        <div
                          key={fav.id}
                          onClick={() => selectTopicFromLibrary(fav)}
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
                          onClick={() => selectTopicFromLibrary(item)}
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
