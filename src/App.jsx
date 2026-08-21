import { useState, useEffect, useCallback, useRef } from 'react';
import { BookOpen, RefreshCw, ExternalLink, ArrowLeft, BrainCircuit, Brain, Clock, CheckCircle2, Play, Square } from 'lucide-react';
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

  // Timer states: 'idle', 'reading', 'assimilation_ready', 'assimilating', 'done'
  const [timerPhase, setTimerPhase] = useState('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  // Extract unique categories
  const categories = ['Todas', ...Array.from(new Set(referencesData.map(r => r.category)))].sort();

  const generateRandomReference = useCallback((mode, category) => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    clearInterval(timerRef.current);
    setTimerPhase('idle');
    setTimeLeft(0);
    
    setTimeout(() => {
      let filteredData = referencesData.filter(ref => ref.level === mode);
      if (category !== 'Todas') {
        filteredData = filteredData.filter(ref => ref.category === category);
      }

      if (filteredData.length === 0) {
        setIsAnimating(false);
        setReference({
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
              setTimerPhase('done');
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
            <p className="text-base text-slate-300 mb-10 max-w-xl font-light">
              Escolha seu nível e comece a explorar milhares de tópicos.
            </p>

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
            <div className="w-full max-w-5xl flex items-center justify-between mb-4 pt-2">
              <button 
                onClick={() => setScreen('intro')}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 backdrop-blur-sm"
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline font-medium">Voltar</span>
              </button>

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
            </div>

            {/* Categories Filter (With Real Images) */}
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
              
              {/* TOPIC CARD - With Banner Image */}
              <div 
                className={`flex-1 transition-all duration-500 ease-out flex flex-col ${
                  isAnimating ? 'opacity-0 translate-y-4 scale-95 filter blur-sm' : 'opacity-100 translate-y-0 scale-100 filter blur-0'
                }`}
              >
                {reference ? (
                  <div className="flex flex-col h-full bg-slate-950/40 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
                    
                    {/* Banner Image for the Category */}
                    <div className="w-full h-36 sm:h-48 relative shrink-0 border-b border-white/10">
                      <img 
                        src={getCategoryImage(reference.category)} 
                        alt={reference.category} 
                        className="w-full h-full object-cover opacity-70 transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
                      <div className="absolute bottom-4 left-6 sm:left-8">
                         <span className={`px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest shadow-lg ${
                            reference.level === 'basic' 
                              ? 'border-emerald-500/40 bg-emerald-500/40 text-emerald-50 backdrop-blur-md'
                              : 'border-purple-500/40 bg-purple-500/40 text-purple-50 backdrop-blur-md'
                          }`}>
                            {reference.category}
                          </span>
                      </div>
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
                        <div className="pt-6 mt-auto shrink-0">
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

              {/* TIMER PANEL */}
              <div className="lg:w-[320px] shrink-0 bg-slate-950/40 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col justify-center min-h-[280px]">
                {timerPhase === 'idle' && (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="p-3 bg-white/5 rounded-full mb-2">
                      <Clock size={28} className="text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-white text-center">Modo de Foco</h3>
                    <p className="text-sm text-slate-400 text-center mb-2">Defina o tempo de leitura antes da assimilação.</p>
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

                {timerPhase === 'reading' && (
                  <div className="flex flex-col items-center gap-4 w-full animate-in fade-in zoom-in">
                    <div className="text-slate-400 font-medium tracking-wide uppercase text-xs">Tempo de Leitura</div>
                    <div className="text-5xl font-bold font-mono tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] my-2">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="flex flex-col gap-2 w-full mt-2">
                      <button 
                        onClick={finishReading}
                        className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={18} /> Concluir
                      </button>
                      <button 
                        onClick={cancelTimer}
                        className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {timerPhase === 'assimilation_ready' && (
                  <div className="flex flex-col items-center gap-4 w-full animate-in fade-in zoom-in text-center">
                    <div className="p-3 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                      <Brain size={32} className="text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Assimilação</h3>
                      <p className="text-sm text-slate-300">
                        Explique o tema em voz alta para si mesmo.
                      </p>
                    </div>
                    <button 
                      onClick={startAssimilationTimer}
                      className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.2)] mt-2"
                    >
                      <Play size={18} fill="currentColor" /> Iniciar (2:00)
                    </button>
                  </div>
                )}

                {timerPhase === 'assimilating' && (
                  <div className="flex flex-col items-center gap-4 w-full animate-in fade-in zoom-in">
                    <div className="text-yellow-400 font-medium tracking-wide uppercase text-xs">Explicando em voz alta</div>
                    <div className="text-5xl font-bold font-mono tracking-tighter text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)] my-2">
                      {formatTime(timeLeft)}
                    </div>
                    <button 
                      onClick={() => setTimerPhase('done')}
                      className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      <Square size={16} fill="currentColor" /> Encerrar
                    </button>
                  </div>
                )}

                {timerPhase === 'done' && (
                  <div className="flex flex-col items-center gap-3 w-full animate-in fade-in zoom-in text-center">
                    <div className="p-3 bg-emerald-500/20 rounded-full">
                      <CheckCircle2 size={40} className="text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Fixado!</h3>
                    <p className="text-sm text-slate-300">A técnica de explicar consolidou seu aprendizado.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Footer / Action */}
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
    </div>
  );
}

export default App;
