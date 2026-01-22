
import React, { useState, useEffect } from 'react';
import { ProjectPhase, ProjectData, SystemRequirement, Component } from './types';
import { COMPONENT_CATALOG } from './constants';
import { getAIFeedback, generateArduinoSnippet, analyzeMathModel } from './services/geminiService';
import RequirementCard from './components/RequirementCard';

const App: React.FC = () => {
  const [phase, setPhase] = useState<ProjectPhase>(ProjectPhase.REQUIREMENTS);
  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: '',
    requirements: [],
    selectedComponents: [],
    mathModel: '',
    arduinoCode: '',
    blockDiagramData: ''
  });
  
  const [aiMessage, setAiMessage] = useState<string>('¡Hola! Soy tu tutor de Mecatrónica. Comencemos dándole un nombre a tu proyecto y definiendo los requerimientos de tu sistema.');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [mathInput, setMathInput] = useState('');

  const addRequirement = (type: 'functional' | 'economic' | 'safety') => {
    const newReq: SystemRequirement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      description: '',
      status: 'pending'
    };
    setProjectData(prev => ({ ...prev, requirements: [...prev.requirements, newReq] }));
  };

  const updateRequirement = (id: string, description: string) => {
    setProjectData(prev => ({
      ...prev,
      requirements: prev.requirements.map(r => r.id === id ? { ...r, description } : r)
    }));
  };

  const removeRequirement = (id: string) => {
    setProjectData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(r => r.id !== id)
    }));
  };

  const toggleComponent = (comp: Component) => {
    setProjectData(prev => {
      const exists = prev.selectedComponents.find(c => c.id === comp.id);
      if (exists) {
        return { ...prev, selectedComponents: prev.selectedComponents.filter(c => c.id !== comp.id) };
      }
      return { ...prev, selectedComponents: [...prev.selectedComponents, comp] };
    });
  };

  const askAI = async (prompt: string) => {
    setIsAiLoading(true);
    const feedback = await getAIFeedback(prompt, projectData);
    setAiMessage(feedback || "No pude generar una respuesta.");
    setIsAiLoading(false);
  };

  const handleGenerateCode = async () => {
    setIsAiLoading(true);
    const comps = projectData.selectedComponents.map(c => c.name);
    const code = await generateArduinoSnippet(comps, "Control de flujo basado en sensores seleccionados");
    setProjectData(prev => ({ ...prev, arduinoCode: code || '' }));
    setAiMessage("He generado un borrador de código para tu sistema. Revísalo en la pestaña de programación.");
    setIsAiLoading(false);
  };

  const handleMathAnalysis = async () => {
    setIsAiLoading(true);
    const analysis = await analyzeMathModel(mathInput);
    setProjectData(prev => ({ ...prev, mathModel: analysis || '' }));
    setAiMessage("He analizado el modelo matemático. Las derivadas e integrales son clave para el control PID o la dinámica del sistema.");
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">MecaMaster Lab</h1>
              <p className="text-xs text-slate-400">Plataforma Educativa de Mecatrónica</p>
            </div>
          </div>
          
          <nav className="flex bg-slate-800 rounded-full p-1 overflow-x-auto max-w-full">
            {Object.values(ProjectPhase).map((p) => (
              <button
                key={p}
                onClick={() => setPhase(p)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${phase === p ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Workspace Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {phase === ProjectPhase.REQUIREMENTS && (
            <div className="space-y-6">
              {/* Project Name Section */}
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-widest">Identidad del Proyecto</h2>
                <div className="flex flex-col gap-2">
                  <label htmlFor="projectName" className="text-xs font-semibold text-slate-400">Nombre del Proyecto Mecatrónico</label>
                  <input
                    id="projectName"
                    type="text"
                    value={projectData.projectName}
                    onChange={(e) => setProjectData(prev => ({ ...prev, projectName: e.target.value }))}
                    placeholder="Ej. Brazo Robótico Clasificador, Tanque de Nivel..."
                    className="text-2xl font-bold text-slate-800 border-b-2 border-slate-100 focus:border-indigo-500 outline-none pb-2 transition-colors"
                  />
                </div>
              </section>

              <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Análisis de Requerimientos</h2>
                  <div className="flex gap-2">
                    <button onClick={() => addRequirement('functional')} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors">+ Funcional</button>
                    <button onClick={() => addRequirement('economic')} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-200 transition-colors">+ Económico</button>
                    <button onClick={() => addRequirement('safety')} className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-semibold hover:bg-amber-200 transition-colors">+ Seguridad</button>
                  </div>
                </div>
                
                {projectData.requirements.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                    <p className="text-slate-500">No hay requerimientos definidos. Haz clic en los botones de arriba para empezar.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projectData.requirements.map(req => (
                      <RequirementCard key={req.id} req={req} onUpdate={updateRequirement} onRemove={removeRequirement} />
                    ))}
                  </div>
                )}

                <div className="mt-8 p-4 bg-slate-50 rounded-xl">
                  <h3 className="text-sm font-bold text-slate-600 mb-2 uppercase">Validación de Requerimientos</h3>
                  <button 
                    onClick={() => askAI("Evalúa mis requerimientos actuales. ¿Son específicos, medibles y realistas para un sistema mecatrónico?")}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Consultar al Tutor IA
                  </button>
                </div>
              </section>
            </div>
          )}

          {phase === ProjectPhase.COMPONENTS && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Selección de Componentes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {COMPONENT_CATALOG.map(comp => {
                  const isSelected = projectData.selectedComponents.some(c => c.id === comp.id);
                  return (
                    <div 
                      key={comp.id} 
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${isSelected ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-100 hover:border-slate-300'}`}
                      onClick={() => toggleComponent(comp)}
                    >
                      <div className="flex gap-4">
                        <img src={comp.image} className="w-20 h-20 rounded-lg object-cover" alt={comp.name} />
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900">{comp.name}</h3>
                          <p className="text-xs text-slate-500 mb-2 line-clamp-2">{comp.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(comp.specifications).map(([k, v]) => (
                              <span key={k} className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200">{k}: {v}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-indigo-600">${comp.cost.toFixed(2)}</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                          {isSelected ? '✓' : '+'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8 flex justify-between items-center p-4 bg-slate-900 text-white rounded-xl">
                <div>
                  <p className="text-xs text-slate-400 uppercase">Presupuesto Estimado</p>
                  <p className="text-2xl font-bold">${projectData.selectedComponents.reduce((acc, curr) => acc + curr.cost, 0).toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => askAI("¿Esta combinación de componentes es compatible para mi proyecto?")}
                  className="px-6 py-2 bg-indigo-500 rounded-lg font-bold hover:bg-indigo-400"
                >
                  Validar Selección
                </button>
              </div>
            </section>
          )}

          {phase === ProjectPhase.MODELING && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Modelación y Física</h2>
              <div className="space-y-4">
                <p className="text-slate-600 text-sm">Ingresa el concepto físico o la ecuación que deseas modelar (ej: "Dinámica de un motor DC", "Llenado de tanque con integral").</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={mathInput}
                    onChange={(e) => setMathInput(e.target.value)}
                    placeholder="Escribe el concepto aquí..."
                    className="flex-1 p-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button 
                    onClick={handleMathAnalysis}
                    className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all"
                  >
                    Analizar
                  </button>
                </div>

                {projectData.mathModel && (
                  <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 prose prose-slate max-w-none">
                    <div className="whitespace-pre-wrap font-serif leading-relaxed text-slate-800">
                      {projectData.mathModel}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {phase === ProjectPhase.PROGRAMMING && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Lógica de Control (Arduino)</h2>
                <button 
                  onClick={handleGenerateCode}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-bold hover:bg-indigo-600 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  Generar Base de Código
                </button>
              </div>

              <div className="bg-slate-900 rounded-2xl p-4 overflow-hidden shadow-inner">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-slate-500 ml-4 font-mono">sketch_mechamaster.ino</span>
                </div>
                <textarea
                  className="w-full h-[400px] bg-transparent text-indigo-300 font-mono text-sm p-2 outline-none resize-none"
                  value={projectData.arduinoCode}
                  onChange={(e) => setProjectData(prev => ({ ...prev, arduinoCode: e.target.value }))}
                  spellCheck={false}
                  placeholder="// El código generado aparecerá aquí..."
                />
              </div>
              <p className="mt-4 text-xs text-slate-500 italic">* Recuerda validar siempre el código en un simulador como Tinkercad o Wokwi antes de implementarlo en hardware real.</p>
            </section>
          )}

          {phase === ProjectPhase.REPORT && (
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{projectData.projectName || 'Reporte de Diseño Mecatrónico'}</h1>
                  <p className="text-slate-500">Documento de Integración y Selección de Componentes</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold border-b border-slate-200 pb-2 text-slate-800 mb-3 uppercase tracking-tight">1. Análisis de Requerimientos</h3>
                    <div className="space-y-2">
                      {projectData.requirements.map(r => (
                        <div key={r.id} className="flex gap-3 text-sm">
                          <span className="font-bold text-slate-400 w-24">[{r.type}]</span>
                          <span className="text-slate-700">{r.description || 'No definido'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold border-b border-slate-200 pb-2 text-slate-800 mb-3 uppercase tracking-tight">2. Lista de Componentes Seleccionados</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {projectData.selectedComponents.map(c => (
                        <div key={c.id} className="p-3 bg-slate-50 rounded-lg text-sm border border-slate-100">
                          <p className="font-bold">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.category}</p>
                          <p className="text-xs font-semibold mt-1">${c.cost.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold border-b border-slate-200 pb-2 text-slate-800 mb-3 uppercase tracking-tight">3. Modelo Matemático</h3>
                    <div className="p-4 bg-slate-50 rounded-lg text-sm font-serif italic text-slate-700">
                      {projectData.mathModel ? "Análisis IA incluido en el reporte final." : "No se ha generado modelo matemático."}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex justify-center">
                  <button className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Descargar Reporte Completo (PDF)
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* AI Tutor Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-200px)] lg:sticky lg:top-24">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Tutor de Mecatrónica</h3>
                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase">Online (Gemini 3)</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="bg-indigo-50 p-4 rounded-2xl rounded-tl-none border border-indigo-100">
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {isAiLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Analizando el sistema...
                    </span>
                  ) : aiMessage}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Escribe tu duda..."
                  className="flex-1 text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value;
                      if (val) {
                        askAI(val);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Escribe tu duda..."]') as HTMLInputElement;
                    if (input.value) {
                      askAI(input.value);
                      input.value = '';
                    }
                  }}
                  className="p-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => askAI("¿Cómo aplico una integral para calcular el volumen en un tanque?")} className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded-full hover:bg-slate-100 transition-colors">¿Integral de volumen?</button>
                <button onClick={() => askAI("Dime qué requisitos de seguridad faltan en mi diseño.")} className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded-full hover:bg-slate-100 transition-colors">¿Seguridad?</button>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer Status Bar */}
      <footer className="bg-slate-100 border-t border-slate-200 p-3 text-[10px] text-slate-500 font-medium">
        <div className="container mx-auto flex justify-between">
          <div className="flex gap-4">
            <span>PROYECTO: {(projectData.projectName || 'Sin Nombre').toUpperCase()}</span>
            <span>PHASE: {phase.toUpperCase()}</span>
          </div>
          <div>POWERED BY GOOGLE GEMINI 3 & MECHATRONICS LAB</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
