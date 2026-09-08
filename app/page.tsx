'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  Clock3,
  Database,
  GraduationCap,
  Lightbulb,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type Question = {
  area: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

const questions: Question[] = [
  { area: 'Bases de datos', prompt: '¿Qué propiedad garantiza que una transacción se complete por entero o no produzca ningún cambio?', options: ['Atomicidad', 'Disponibilidad', 'Normalización', 'Indexación'], answer: 0, explanation: 'La atomicidad es la A de ACID: una transacción se aplica completamente o se revierte.' },
  { area: 'Bases de datos avanzadas', prompt: '¿Para qué sirve principalmente un índice en una tabla?', options: ['Cifrar los registros', 'Acelerar la búsqueda de datos', 'Evitar toda duplicación', 'Crear copias de seguridad'], answer: 1, explanation: 'Los índices mejoran el acceso a datos, aunque ocupan espacio y pueden encarecer escrituras.' },
  { area: 'Programación web', prompt: '¿Cuál es el propósito principal de HTML?', options: ['Dar estilo a una página', 'Estructurar el contenido', 'Consultar una base de datos', 'Controlar un servidor'], answer: 1, explanation: 'HTML describe la estructura y el significado del contenido; CSS define su presentación.' },
  { area: 'Programación web avanzada', prompt: 'En una API REST, ¿qué método se usa normalmente para actualizar parcialmente un recurso?', options: ['GET', 'POST', 'PATCH', 'DELETE'], answer: 2, explanation: 'PATCH se emplea para actualizaciones parciales; PUT suele reemplazar la representación completa.' },
  { area: 'Redes y telecomunicaciones', prompt: '¿Qué protocolo asigna automáticamente una dirección IP a un dispositivo?', options: ['DNS', 'DHCP', 'HTTP', 'FTP'], answer: 1, explanation: 'DHCP entrega configuración de red, como dirección IP, puerta de enlace y DNS.' },
  { area: 'Análisis de datos', prompt: '¿Qué medida es más resistente a valores extremos?', options: ['Media aritmética', 'Mediana', 'Rango', 'Varianza'], answer: 1, explanation: 'La mediana separa los datos ordenados en dos mitades y cambia poco ante valores atípicos.' },
  { area: 'Análisis de sistemas', prompt: '¿Qué diagrama UML muestra interacciones entre objetos ordenadas en el tiempo?', options: ['Diagrama de clases', 'Diagrama de secuencia', 'Diagrama de componentes', 'Diagrama de despliegue'], answer: 1, explanation: 'El diagrama de secuencia representa mensajes entre participantes a lo largo del tiempo.' },
  { area: 'Diseño de interfaces', prompt: '¿Cuál es una buena práctica de accesibilidad para controles con iconos?', options: ['Usar solo color', 'Ocultar el control', 'Añadir una etiqueta accesible', 'Usar texto de 10 px'], answer: 2, explanation: 'Un nombre accesible permite que lectores de pantalla comuniquen el propósito del control.' },
  { area: 'Calidad de software', prompt: '¿Qué prueba comprueba una unidad pequeña de código de forma aislada?', options: ['Prueba de aceptación', 'Prueba unitaria', 'Prueba de carga', 'Prueba de regresión'], answer: 1, explanation: 'Las pruebas unitarias verifican funciones, métodos o componentes pequeños de manera aislada.' },
  { area: 'Metodologías', prompt: 'En Scrum, ¿quién prioriza el Product Backlog?', options: ['Scrum Master', 'Equipo de desarrollo', 'Product Owner', 'Cliente técnico'], answer: 2, explanation: 'El Product Owner es responsable de ordenar y maximizar el valor del Product Backlog.' },
  { area: 'Matemática discreta', prompt: 'Si un conjunto A tiene 3 elementos y B tiene 4, ¿cuántos pares ordenados tiene A × B?', options: ['7', '12', '16', '64'], answer: 1, explanation: 'El producto cartesiano contiene |A| × |B| pares: 3 × 4 = 12.' },
  { area: 'Estadística', prompt: 'Una correlación cercana a −1 indica:', options: ['Relación lineal negativa fuerte', 'Ausencia de relación', 'Relación causal segura', 'Relación positiva débil'], answer: 0, explanation: 'Una correlación de −1 representa una relación lineal negativa perfecta; no demuestra causalidad.' },
  { area: 'Ofimática', prompt: 'En una hoja de cálculo, ¿qué referencia permanece fija al copiar una fórmula?', options: ['A1', '$A$1', 'A:A', '1:1'], answer: 1, explanation: 'Los signos $ bloquean la columna y la fila, por eso $A$1 es una referencia absoluta.' },
  { area: 'Emprendimiento', prompt: '¿Qué describe mejor una propuesta de valor?', options: ['El horario de atención', 'El beneficio específico para un cliente', 'La lista de proveedores', 'El organigrama'], answer: 1, explanation: 'La propuesta de valor explica por qué una solución es útil y preferible para un segmento de clientes.' },
  { area: 'Expresión oral y escrita', prompt: '¿Cuál mejora más la claridad de un texto académico?', options: ['Usar ideas sin conectar', 'Sustentar afirmaciones con fuentes', 'Repetir la misma idea', 'Usar oraciones muy largas'], answer: 1, explanation: 'Las fuentes confiables y una estructura coherente hacen verificable y claro un texto académico.' },
  { area: 'Inglés A1–A2', prompt: 'Complete: “She ___ to class every day.”', options: ['go', 'goes', 'going', 'gone'], answer: 1, explanation: 'En presente simple, he/she/it usa la forma goes.' },
  { area: 'Proyecto de investigación', prompt: '¿Qué elemento plantea lo que una investigación busca lograr?', options: ['Objetivo general', 'Bibliografía', 'Cronograma', 'Anexo'], answer: 0, explanation: 'El objetivo general expresa el propósito principal de la investigación.' },
  { area: 'Tendencias tecnológicas', prompt: '¿Cuál es un uso responsable de IA en un proyecto académico?', options: ['Presentar textos sin revisarlos', 'Verificar resultados y citar según las reglas aplicables', 'Compartir datos sensibles', 'Evitar toda revisión humana'], answer: 1, explanation: 'La IA requiere supervisión, verificación y cuidado con la privacidad y las normas académicas.' },
];

const areas = [...new Set(questions.map((question) => question.area))];
const formatTime = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export default function Home() {
  const [screen, setScreen] = useState<'setup' | 'quiz' | 'result'>('setup');
  const [selectedArea, setSelectedArea] = useState('Todas las áreas');
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState(0);
  const [seconds, setSeconds] = useState(20 * 60);
  const [review, setReview] = useState(false);

  useEffect(() => {
    if (screen !== 'quiz' || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [screen, seconds]);
  useEffect(() => { if (seconds === 0 && screen === 'quiz') setScreen('result'); }, [seconds, screen]);

  const score = useMemo(() => quiz.reduce((total, item, index) => total + (answers[index] === item.answer ? 1 : 0), 0), [answers, quiz]);
  const startQuiz = (area = selectedArea) => {
    const pool = area === 'Todas las áreas' ? questions : questions.filter((item) => item.area === area);
    const randomized = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(10, pool.length));
    setSelectedArea(area); setQuiz(randomized); setAnswers({}); setCurrent(0); setSeconds(Math.max(randomized.length * 120, 5 * 60)); setReview(false); setScreen('quiz');
  };

  useEffect(() => {
    const context = (document as typeof document & { modelContext?: { registerTool: (tool: { name: string; title: string; description: string; inputSchema: object; annotations: object; execute: (input: unknown) => unknown }, options: { signal: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const inputSchema = { type: 'object', properties: { area: { type: 'string', enum: ['Todas las áreas', ...areas] } }, additionalProperties: false };
    try {
      void Promise.resolve(context.registerTool({
        name: 'start_complexivo_practice',
        title: 'Iniciar práctica complexiva',
        description: 'Inicia una práctica de preguntas del simulador, opcionalmente filtrada por área.',
        inputSchema,
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const requested = (input as { area?: string } | null)?.area ?? 'Todas las áreas';
          if (!['Todas las áreas', ...areas].includes(requested)) throw new Error('Área no disponible.');
          startQuiz(requested);
          return { started: true, area: requested, questionCount: Math.min(10, requested === 'Todas las áreas' ? questions.length : questions.filter((item) => item.area === requested).length) };
        },
      }, { signal: lifecycle.signal })).catch(() => undefined);
    } catch { /* El simulador sigue funcionando si el navegador no admite WebMCP. */ }
    return () => lifecycle.abort();
  }, [selectedArea]);

  if (screen === 'setup') return <main className="min-h-screen bg-[#f5f7fb] text-slate-950"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-blue-700 text-white"><GraduationCap className="size-5" /></div><div><p className="font-bold tracking-tight">Pelileo · Complexivo</p><p className="text-xs text-slate-500">Espacio personal de práctica</p></div></div><div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex"><BookOpen className="size-4" /> Banco inicial: {questions.length} preguntas</div></div></header><section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16"><div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center"><div><span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800"><Lightbulb className="size-4" /> Práctica guiada</span><h1 className="mt-5 max-w-2xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Prepárate con intención, no solo con memoria.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">Simulador inicial para tus áreas de tecnología. Responde, revisa tus errores y vuelve a intentarlo hasta sentirte seguro.</p><div className="mt-8 flex flex-wrap gap-3"><div className="rounded-xl border border-slate-200 bg-white px-4 py-3"><Clock3 className="mb-1 size-5 text-blue-700" /><p className="font-bold">2 min por pregunta</p><p className="text-sm text-slate-500">Tiempo sugerido</p></div><div className="rounded-xl border border-slate-200 bg-white px-4 py-3"><CircleHelp className="mb-1 size-5 text-blue-700" /><p className="font-bold">Opción múltiple</p><p className="text-sm text-slate-500">Una respuesta correcta</p></div></div></div><div className="rounded-3xl bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300 sm:p-8"><p className="text-sm font-semibold uppercase tracking-[.16em] text-blue-300">Configura tu práctica</p><h2 className="mt-2 text-2xl font-bold">¿Qué quieres repasar hoy?</h2><label className="mt-6 block text-sm font-semibold text-slate-200" htmlFor="area">Área de estudio</label><select id="area" value={selectedArea} onChange={(event) => setSelectedArea(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-400"><option>Todas las áreas</option>{areas.map((area) => <option key={area}>{area}</option>)}</select><div className="mt-5 rounded-xl bg-white/10 p-4 text-sm leading-6 text-slate-300"><span className="font-semibold text-white">Nota:</span> este banco se creó con las materias que recuerdas. Lo ajustaremos cuando tengas el temario oficial.</div><Button onClick={startQuiz} size="lg" className="mt-6 h-12 w-full bg-blue-500 text-base font-bold hover:bg-blue-400">Iniciar simulador <ArrowRight /></Button></div></div><div className="mt-14"><p className="text-sm font-bold uppercase tracking-[.14em] text-slate-500">Áreas incluidas</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{areas.map((area, index) => <div key={area} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"><span className="grid size-8 place-items-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">{index + 1}</span><span className="text-sm font-semibold text-slate-700">{area}</span></div>)}</div></div></section></main>;

  if (screen === 'result') {
    const percentage = quiz.length ? Math.round((score / quiz.length) * 100) : 0;
    return <main className="min-h-screen bg-[#f5f7fb] px-5 py-10 text-slate-950 sm:px-8"><div className="mx-auto max-w-3xl"><button onClick={() => setScreen('setup')} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"><ArrowLeft className="size-4" /> Volver al inicio</button><section className="mt-6 overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200"><div className="bg-slate-950 p-8 text-white sm:p-10"><Trophy className="size-10 text-amber-300" /><p className="mt-5 text-blue-200">Resultado de tu simulación</p><h1 className="mt-1 text-4xl font-black">{score} de {quiz.length} correctas</h1><p className="mt-3 text-slate-300">Obtuviste {percentage}%. {percentage >= 70 ? 'Vas por buen camino.' : 'Cada intento revela qué reforzar.'}</p></div><div className="p-6 sm:p-8"><Progress value={percentage} className="[&_[data-slot=progress-indicator]]:bg-blue-600" /><div className="mt-7 flex flex-wrap gap-3"><Button onClick={() => { setReview(true); setScreen('quiz'); setCurrent(0); }} className="h-11 bg-slate-950 px-5"><BookOpen /> Revisar respuestas</Button><Button onClick={startQuiz} variant="outline" className="h-11 px-5"><RotateCcw /> Intentar otra vez</Button></div><p className="mt-7 text-sm leading-6 text-slate-500">Consejo: revisa las explicaciones y anota los temas que se repiten.</p></div></section></div></main>;
  }

  const question = quiz[current];
  const answered = Object.keys(answers).length;
  return <main className="min-h-screen bg-[#f5f7fb] text-slate-950"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-blue-700 text-white"><Database className="size-4" /></div><div><p className="text-sm font-bold">Simulador Complexivo</p><p className="text-xs text-slate-500">{review ? 'Modo revisión' : `Respondidas: ${answered}/${quiz.length}`}</p></div></div><div className="rounded-lg bg-slate-950 px-3 py-2 font-mono text-sm font-bold text-white"><Clock3 className="mr-2 inline size-4 text-blue-300" />{formatTime(seconds)}</div></div></header><div className="mx-auto max-w-5xl px-5 py-7 sm:px-8"><div className="mb-7 flex items-center justify-between gap-4"><p className="text-sm font-semibold text-slate-600">Pregunta {current + 1} de {quiz.length}</p><p className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">{question.area}</p></div><Progress value={((current + 1) / quiz.length) * 100} className="[&_[data-slot=progress-indicator]]:bg-blue-600" /><section className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-9"><h1 className="max-w-3xl text-2xl font-bold leading-9 sm:text-3xl">{question.prompt}</h1><div className="mt-8 grid gap-3">{question.options.map((option, index) => { const selected = answers[current] === index; const correct = question.answer === index; const showState = review && answers[current] !== undefined; return <button key={option} disabled={review} onClick={() => setAnswers((value) => ({ ...value, [current]: index }))} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${showState && correct ? 'border-emerald-400 bg-emerald-50' : showState && selected ? 'border-rose-300 bg-rose-50' : selected ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}><span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${showState && correct ? 'bg-emerald-500 text-white' : showState && selected ? 'bg-rose-500 text-white' : selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{showState && correct ? <CheckCircle2 className="size-4" /> : String.fromCharCode(65 + index)}</span><span className="font-medium">{option}</span></button>; })}</div>{review && answers[current] !== undefined && <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950"><span className="font-bold">Explicación: </span>{question.explanation}</div>}</section><div className="mt-6 flex flex-wrap items-center justify-between gap-3"><Button variant="outline" onClick={() => setCurrent((value) => Math.max(0, value - 1))} disabled={current === 0}><ArrowLeft /> Anterior</Button>{current < quiz.length - 1 ? <Button onClick={() => setCurrent((value) => value + 1)} className="bg-slate-950">Siguiente <ArrowRight /></Button> : <Button onClick={() => setScreen('result')} className="bg-blue-600 hover:bg-blue-700">Finalizar <Trophy /></Button>}</div></div></main>;
}
