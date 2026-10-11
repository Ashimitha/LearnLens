import React, { useState, useEffect } from 'react';
import { VisualScene, LessonExplanation } from '../../types';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize2, RotateCcw, CheckCircle2 } from 'lucide-react';
import { MathRenderer } from '../common/MathRenderer';

interface VisualLessonPlayerProps {
  lesson: LessonExplanation;
  onClose?: () => void;
}

export const VisualLessonPlayer: React.FC<VisualLessonPlayerProps> = ({ lesson, onClose }) => {
  const scenes = lesson.visualScenes && lesson.visualScenes.length > 0 ? lesson.visualScenes : [
    {
      id: 1,
      title: 'Scene 1: Introduction to Phenomenon',
      narration: `Examining ${lesson.topic}: Observe how initial conditions set the stage for physical interaction.`,
      diagramType: 'optics' as const,
      bulletPoints: ['Initial Medium State', 'Boundary Interface', 'Reference System'],
      formula: lesson.keyFormulas[0],
    },
    {
      id: 2,
      title: 'Scene 2: Core Mechanism at Work',
      narration: lesson.coreConcept,
      diagramType: 'optics' as const,
      bulletPoints: ['Conservation Laws', 'Equilibrium Force', 'Phase Transition'],
      formula: lesson.keyFormulas[1] || lesson.keyFormulas[0],
    },
    {
      id: 3,
      title: 'Scene 3: Step-by-Step Evolution',
      narration: 'Watch as variables change across the boundary, causing predictable physical deviations.',
      diagramType: 'optics' as const,
      bulletPoints: ['Rate of change', 'Mathematical alignment', 'Observable deviation'],
    },
    {
      id: 4,
      title: 'Scene 4: Key Synthesis',
      narration: lesson.shortAnswer,
      diagramType: 'optics' as const,
      bulletPoints: ['Core takeaway', 'Exam readiness', 'Ready for quiz assessment'],
    },
  ];

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [opticsAngle, setOpticsAngle] = useState<number>(35); // degrees
  const [parabolaA, setParabolaA] = useState<number>(1);
  const [parabolaC, setParabolaC] = useState<number>(-4);

  const activeScene = scenes[currentSceneIndex] || scenes[0];

  // Auto-advance scenes when playing
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      const durationMs = (7000 / playbackSpeed);
      timer = setTimeout(() => {
        if (currentSceneIndex < scenes.length - 1) {
          setCurrentSceneIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, durationMs);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentSceneIndex, scenes.length, playbackSpeed]);

  // Speech Narration synthesis when scene changes
  useEffect(() => {
    if (isPlaying && !isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeScene.narration);
      utterance.rate = playbackSpeed;
      window.speechSynthesis.speak(utterance);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentSceneIndex, isPlaying, isMuted, activeScene.narration, playbackSpeed]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
    }
  };

  const handleReset = () => {
    setCurrentSceneIndex(0);
    setIsPlaying(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Determine diagram rendering based on subject and scene
  const renderInteractiveDiagram = () => {
    const isOptics = lesson.subject === 'Physics' || activeScene.diagramType === 'optics' || lesson.topic.includes('Light');
    const isBio = lesson.subject === 'Biology' || activeScene.diagramType === 'photosynthesis' || lesson.topic.includes('Photo');
    const isMath = lesson.subject === 'Mathematics' || activeScene.diagramType === 'geometry' || lesson.topic.includes('Quad');

    if (isOptics) {
      // Calculate refraction angle: n1*sin(theta1) = n2*sin(theta2)
      // Water to air: n1=1.33, n2=1.00
      const theta1Rad = (opticsAngle * Math.PI) / 180;
      const sinTheta2 = 1.33 * Math.sin(theta1Rad);
      const isTotalInternal = sinTheta2 > 1.0;
      const theta2Deg = isTotalInternal ? 90 : Math.round((Math.asin(sinTheta2) * 180) / Math.PI);

      return (
        <div className="relative w-full h-80 bg-slate-900 rounded-xl overflow-hidden flex flex-col justify-between p-4 select-none">
          {/* Simulation Header */}
          <div className="flex items-center justify-between text-xs text-slate-300 z-10">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white">Interactive Optics Bench</span>
              <span>·</span>
              <span>Snell's Law: $n_1 \sin\theta_1 = n_2 \sin\theta_2$</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-slate-400">Incident Angle $\theta_1$:</label>
              <input
                type="range"
                min="10"
                max="48"
                value={opticsAngle}
                onChange={(e) => setOpticsAngle(parseInt(e.target.value, 10))}
                className="w-24 accent-indigo-500 cursor-pointer"
              />
              <span className="font-mono text-indigo-400 font-semibold">{opticsAngle}°</span>
            </div>
          </div>

          {/* SVG Visual Stage */}
          <svg className="w-full h-56 my-auto" viewBox="0 0 500 240">
            {/* Air medium top half */}
            <rect x="0" y="0" width="500" height="120" fill="#0f172a" />
            <text x="20" y="30" fill="#94a3b8" fontSize="12" fontWeight="600">Air Medium ($n_2 = 1.00$)</text>

            {/* Water medium bottom half */}
            <rect x="0" y="120" width="500" height="120" fill="#0369a1" fillOpacity="0.25" />
            <text x="20" y="220" fill="#38bdf8" fontSize="12" fontWeight="600">Water Tank ($n_1 = 1.33$)</text>

            {/* Water surface interface line */}
            <line x1="0" y1="120" x2="500" y2="120" stroke="#0284c7" strokeWidth="2" strokeDasharray="4,2" />

            {/* Normal dashed line */}
            <line x1="250" y1="20" x2="250" y2="220" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="255" y="35" fill="#64748b" fontSize="10">Normal Line</text>

            {/* Submerged object / light source */}
            {/* Angle math: (250, 120) is interface origin */}
            {(() => {
              const rayLen = 90;
              const sourceX = 250 - rayLen * Math.sin(theta1Rad);
              const sourceY = 120 + rayLen * Math.cos(theta1Rad);

              // Refracted ray into air
              const refrRad = (theta2Deg * Math.PI) / 180;
              const refrX = 250 + 100 * Math.sin(refrRad);
              const refrY = 120 - 100 * Math.cos(refrRad);

              // Virtual backward line (apparent depth)
              const virtX = 250 - 80 * Math.sin(refrRad);
              const virtY = 120 + 80 * Math.cos(refrRad);

              return (
                <g>
                  {/* Submerged incident beam */}
                  <line x1={sourceX} y1={sourceY} x2="250" y2="120" stroke="#f59e0b" strokeWidth="3" />
                  <circle cx={sourceX} cy={sourceY} r="4" fill="#f59e0b" />
                  <text x={sourceX - 25} y={sourceY + 15} fill="#f59e0b" fontSize="11" fontWeight="600">Pencil Tip</text>

                  {/* Refracted beam exiting water */}
                  <line x1="250" y1="120" x2={refrX} y2={refrY} stroke="#38bdf8" strokeWidth="3" />
                  <circle cx={refrX} cy={refrY} r="4" fill="#38bdf8" />
                  <text x={refrX + 6} y={refrY} fill="#38bdf8" fontSize="11">To Observer Eye</text>

                  {/* Virtual apparent ray (dotted pink) */}
                  <line x1="250" y1="120" x2={virtX} y2={virtY} stroke="#f43f5e" strokeWidth="2" strokeDasharray="4,4" />
                  <circle cx={virtX} cy={virtY} r="4" fill="#f43f5e" fillOpacity="0.7" />
                  <text x={virtX - 70} y={virtY} fill="#f43f5e" fontSize="10" fontWeight="600">Apparent Image (Bent)</text>

                  {/* Angles arcs */}
                  <text x="235" y="155" fill="#f59e0b" fontSize="10 font-mono">$\theta_1={opticsAngle}°$</text>
                  <text x="260" y="95" fill="#38bdf8" fontSize="10 font-mono">$\theta_2={theta2Deg}°$</text>
                </g>
              );
            })()}
          </svg>

          {/* Status Kicker */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
            <span><MathRenderer content="Velocity in Water: $2.25 \times 10^8\text{ m/s}$" /></span>
            <span className="text-emerald-400 font-medium"><MathRenderer content="Bending Away From Normal ($\theta_2 > \theta_1$)" /></span>
            <span><MathRenderer content="Velocity in Air: $3.00 \times 10^8\text{ m/s}$" /></span>
          </div>
        </div>
      );
    }

    if (isBio) {
      return (
        <div className="relative w-full h-80 bg-slate-900 rounded-xl overflow-hidden flex flex-col justify-between p-4 select-none">
          <div className="flex items-center justify-between text-xs text-slate-300 z-10">
            <span className="font-semibold text-emerald-400">Chloroplast Biochemical Cycle Visualizer</span>
            <span className="text-slate-400">Photosystem II &amp; Calvin Cycle (6CO2 + 6H2O &rarr; C6H12O6 + 6O2)</span>
          </div>

          <svg className="w-full h-56 my-auto" viewBox="0 0 500 240">
            {/* Outer Chloroplast */}
            <rect x="20" y="20" width="460" height="200" rx="30" fill="#064e3b" fillOpacity="0.25" stroke="#059669" strokeWidth="1.5" />
            <text x="40" y="45" fill="#34d399" fontSize="12" fontWeight="600">Outer &amp; Inner Stroma Compartment</text>

            {/* Thylakoid Grana (Light Reactions) */}
            <rect x="50" y="70" width="160" height="120" rx="12" fill="#047857" fillOpacity="0.5" stroke="#10b981" strokeWidth="2" />
            <text x="65" y="95" fill="#ecfdf5" fontSize="11" fontWeight="700">Light Reactions</text>
            <text x="65" y="112" fill="#a7f3d0" fontSize="10">Thylakoid Membrane</text>

            {/* Sunlight Input */}
            <path d="M 15 80 L 45 100" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#arrow)" />
            <text x="10" y="75" fill="#fbbf24" fontSize="10" fontWeight="600">Light hv</text>

            {/* Water input & Oxygen output */}
            <text x="70" y="145" fill="#38bdf8" fontSize="10">H2O In &rarr; O2 Out</text>
            <text x="70" y="165" fill="#facc15" fontSize="10" fontWeight="700">ATP + NADPH Generated</text>

            {/* Energy Carrier Arrows to Calvin Cycle */}
            <path d="M 215 100 C 250 80, 270 80, 295 100" stroke="#facc15" strokeWidth="2" strokeDasharray="3,3" fill="none" />
            <text x="240" y="75" fill="#fde047" fontSize="10" fontFamily="monospace">ATP &amp; NADPH</text>

            <path d="M 295 150 C 270 170, 250 170, 215 150" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3,3" fill="none" />
            <text x="240" y="185" fill="#cbd5e1" fontSize="10" fontFamily="monospace">ADP + NADP+</text>

            {/* Calvin Cycle (Dark Reactions) */}
            <circle cx="370" cy="130" r="55" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <text x="335" y="125" fill="#e0f2fe" fontSize="11" fontWeight="700">Calvin Cycle</text>
            <text x="345" y="142" fill="#7dd3fc" fontSize="10">Stroma Matrix</text>

            {/* CO2 in and Glucose Out */}
            <text x="340" y="60" fill="#e2e8f0" fontSize="10">CO2 Fixation In</text>
            <text x="330" y="210" fill="#34d399" fontSize="10" fontWeight="700">Glucose (C6H12O6) Out</text>
          </svg>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
            <span>Photolysis of H2O releases Oxygen</span>
            <span className="text-emerald-400 font-medium">Chemical Energy Synthesized</span>
            <span>RuBisCO fixes Atmospheric CO2</span>
          </div>
        </div>
      );
    }

    // Mathematical Parabola Coordinate Plane
    return (
      <div className="relative w-full h-80 bg-slate-900 rounded-xl overflow-hidden flex flex-col justify-between p-4 select-none">
        <div className="flex items-center justify-between text-xs text-slate-300 z-10">
          <span className="font-semibold text-indigo-400">Cartesian Parabola Interactive Plotter</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Curve: $y = ax^2 + c$</span>
            <button
              onClick={() => setParabolaC(parabolaC === -4 ? 1 : -4)}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded border border-slate-700"
            >
              Toggle Discriminant ({parabolaC < 0 ? 'Δ > 0 (2 Roots)' : 'Δ < 0 (No Real Roots)'})
            </button>
          </div>
        </div>

        <svg className="w-full h-56 my-auto" viewBox="0 0 500 240">
          {/* Coordinate Axes */}
          <line x1="50" y1="120" x2="450" y2="120" stroke="#475569" strokeWidth="1.5" />
          <line x1="250" y1="20" x2="250" y2="220" stroke="#475569" strokeWidth="1.5" />
          <text x="440" y="115" fill="#64748b" fontSize="10">X</text>
          <text x="255" y="30" fill="#64748b" fontSize="10">Y</text>

          {/* Parabola curve points: center is at (250, 120) */}
          {/* equation: Y_canvas = 120 - (a*(x_unit)^2 + c)*scale */}
          {(() => {
            const scaleX = 25;
            const scaleY = 12;
            const points: string[] = [];
            for (let x = -7; x <= 7; x += 0.5) {
              const y = parabolaA * (x * x) + parabolaC;
              const cx = 250 + x * scaleX;
              const cy = 120 - y * scaleY;
              points.push(`${cx},${cy}`);
            }
            return (
              <polyline
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                points={points.join(' ')}
              />
            );
          })()}

          {/* Roots Indicators if parabolaC < 0 */}
          {parabolaC < 0 && (
            <g>
              <circle cx="200" cy="120" r="5" fill="#ec4899" />
              <text x="180" y="140" fill="#ec4899" fontSize="10 font-bold">Root $x_1$</text>

              <circle cx="300" cy="120" r="5" fill="#ec4899" />
              <text x="295" y="140" fill="#ec4899" fontSize="10 font-bold">Root $x_2$</text>
            </g>
          )}

          {/* Vertex point */}
          <circle cx="250" cy={120 - parabolaC * 12} r="4" fill="#facc15" />
          <text x="258" y={120 - parabolaC * 12 + 5} fill="#facc15" fontSize="10">Vertex $(0, c)$</text>
        </svg>

        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
          <span>Discriminant: $\Delta = b^2 - 4ac$</span>
          <span className={parabolaC < 0 ? 'text-pink-400 font-medium' : 'text-amber-400 font-medium'}>
            {parabolaC < 0 ? 'Real & Distinct Roots (Intersects x-axis)' : 'Complex Roots (Floating Parabola)'}
          </span>
          <span><MathRenderer content="Formula: $x = \frac{-b \pm \sqrt{\Delta}}{2a}$" /></span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 text-white shadow-xl">
      {/* Top Deck: Scene Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-1">
            <span>Visual Concept Walkthrough</span>
            <span>·</span>
            <span>{lesson.subject}</span>
            <span>·</span>
            <span className="text-slate-400">{lesson.topic}</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            {activeScene.title}
          </h3>
        </div>

        {/* Scene progress indicators */}
        <div className="flex items-center gap-1.5">
          {scenes.map((s, idx) => (
            <button
              key={s.id || idx}
              onClick={() => {
                setCurrentSceneIndex(idx);
                setIsPlaying(false);
              }}
              className={`h-2 rounded-full transition-all ${
                currentSceneIndex === idx
                  ? 'w-8 bg-indigo-500'
                  : idx < currentSceneIndex
                  ? 'w-4 bg-indigo-700'
                  : 'w-4 bg-slate-700'
              }`}
              title={s.title}
            />
          ))}
        </div>
      </div>

      {/* Main Two-Zone Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-stretch">
        {/* Left Zone: Interactive Simulation / Dynamic Diagram Stage */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          {renderInteractiveDiagram()}
        </div>

        {/* Right Zone: Script Narration & Concept Annotations */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-slate-850/80 rounded-xl p-4 border border-slate-800">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Narration & Scene Script
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              <MathRenderer content={activeScene.narration} />
            </p>

            {activeScene.formula && (
              <div className="mt-4 p-2.5 bg-slate-800/90 rounded-lg border border-slate-700/60 text-center">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Active Mathematical Equation</div>
                <div className="text-indigo-300 font-mono text-sm">
                  <MathRenderer content={activeScene.formula} block />
                </div>
              </div>
            )}

            {/* Bullet Highlights */}
            {activeScene.bulletPoints && activeScene.bulletPoints.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Scene Highlights</div>
                {activeScene.bulletPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span><MathRenderer content={pt} /></span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Scene {currentSceneIndex + 1} of {scenes.length}</span>
            <span>Speed: {playbackSpeed}x</span>
          </div>
        </div>
      </div>

      {/* Bottom Deck: Media Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentSceneIndex === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
            title="Previous Scene"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlaying ? 'Pause Lesson' : 'Play Lesson'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentSceneIndex === scenes.length - 1}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
            title="Next Scene"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors ml-1"
            title="Replay from Scene 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Audio Voiceover & Speed Settings */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isMuted
                ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{isMuted ? 'Voice Muted' : 'Voice Narration'}</span>
          </button>

          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-xs text-slate-300">
            {[1, 1.25, 1.5].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  playbackSpeed === spd ? 'bg-indigo-600 text-white font-semibold' : 'hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
            >
              Close Visualizer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
