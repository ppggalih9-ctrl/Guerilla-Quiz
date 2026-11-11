/**
 * Guerilla Class Quiz - Interactive Ice Breaking Classroom Game
 * Features:
 * - Real illustration updates for Standing (Berdiri) & Sitting (Duduk) students in blue uniform (tanpa kotak luar)
 * - Exciting procedural Web Audio synthesizer with multiple lively BGM tracks & sound effects
 * - 5-second animated countdown tension mode
 * - Pop-up modal reveal for answers immediately after countdown ends
 * - Fullscreen mode, Question editor, and built-in educational question packs
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Sliders,
  HelpCircle,
  Settings,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  Trophy,
  Eye,
  EyeOff
} from 'lucide-react';
import { QuestionItem, DEFAULT_PACKS } from './types';
import { soundEngine, BgmTrackId } from './utils/audioEngine';
import { AudioSettingsModal } from './components/AudioSettingsModal';
import { RulesModal } from './components/RulesModal';
import { EditorModal } from './components/EditorModal';
import { MovementOptionCards } from './components/MovementOptionCards';
import { AnswerModal } from './components/AnswerModal';

type GamePhase = 'question' | 'countdown' | 'finished';

export default function App() {
  // State
  const [questions, setQuestions] = useState<QuestionItem[]>(DEFAULT_PACKS[0].questions);
  const [activePackId, setActivePackId] = useState<string>('beruang');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [phase, setPhase] = useState<GamePhase>('question');
  const [countdownSeconds, setCountdownSeconds] = useState<number>(5);
  
  // Audio state - Default to super seru 'karnaval'
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<BgmTrackId>('karnaval');

  // Modals & UI toggles
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState<boolean>(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState<boolean>(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showTeacherHint, setShowTeacherHint] = useState<boolean>(false);

  const countdownTimerRef = useRef<number | null>(null);
  const currentQuestion = questions[currentIndex] || questions[0];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Fullscreen toggle
  const toggleFullscreen = () => {
    soundEngine.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Toggle BGM quickly from header
  const handleToggleBgm = () => {
    const isNowPlaying = soundEngine.toggleMute();
    setIsBgmPlaying(isNowPlaying);
  };

  // Reveal Answer in Pop-up Modal
  const revealAnswerPopUp = useCallback(() => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setPhase('question');
    setIsAnswerModalOpen(true);

    if (currentQuestion.a) {
      soundEngine.playVictoryFanfare();
    } else {
      soundEngine.playWrongBoing();
    }
  }, [currentQuestion]);

  // Start 5-second countdown phase
  const startCountdown = useCallback(() => {
    soundEngine.playClick();
    if (!isBgmPlaying) {
      soundEngine.startBGM(currentTrack);
      setIsBgmPlaying(true);
    }

    setPhase('countdown');
    setCountdownSeconds(5);
    soundEngine.playCountdownTick(5);

    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    let sec = 5;
    countdownTimerRef.current = window.setInterval(() => {
      sec -= 1;
      setCountdownSeconds(sec);

      if (sec > 0) {
        soundEngine.playCountdownTick(sec);
      } else {
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        // Buka Pop-Up Jawaban tepat setelah hitungan habis!
        revealAnswerPopUp();
      }
    }, 1000);
  }, [currentTrack, isBgmPlaying, revealAnswerPopUp]);

  // Next Question
  const handleNextQuestion = useCallback(() => {
    soundEngine.playClick();
    setIsAnswerModalOpen(false);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setPhase('question');
    } else {
      setPhase('finished');
      soundEngine.playVictoryFanfare();
    }
  }, [currentIndex, questions.length]);

  // Previous Question
  const handlePrevQuestion = useCallback(() => {
    soundEngine.playClick();
    setIsAnswerModalOpen(false);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setPhase('question');
    }
  }, [currentIndex]);

  // Repeat current question
  const handleRepeatQuestion = useCallback(() => {
    soundEngine.playClick();
    setIsAnswerModalOpen(false);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setPhase('question');
  }, []);

  // Restart Quiz
  const handleRestartQuiz = () => {
    soundEngine.playClick();
    setIsAnswerModalOpen(false);
    setCurrentIndex(0);
    setPhase('question');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing inside modal textarea or input
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      // Handle Answer Modal space / enter / escape
      if (isAnswerModalOpen) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleNextQuestion();
        } else if (e.key === 'Escape') {
          setIsAnswerModalOpen(false);
        }
        return;
      }

      if (isAudioModalOpen || isRulesModalOpen || isEditorModalOpen) {
        if (e.key === 'Escape') {
          setIsAudioModalOpen(false);
          setIsRulesModalOpen(false);
          setIsEditorModalOpen(false);
        }
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (phase === 'question') {
          startCountdown();
        } else if (phase === 'countdown') {
          revealAnswerPopUp();
        } else if (phase === 'finished') {
          handleRestartQuiz();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextQuestion();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevQuestion();
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        handleToggleBgm();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    phase,
    isAnswerModalOpen,
    isAudioModalOpen,
    isRulesModalOpen,
    isEditorModalOpen,
    startCountdown,
    revealAnswerPopUp,
    handleNextQuestion,
    handlePrevQuestion
  ]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      soundEngine.stopBGM();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between p-3 md:p-6 text-slate-800 select-none relative overflow-x-hidden bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-200">
      
      {/* BACKGROUND DECORATIONS (Cartoon Clouds, Hills, Flowers) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Sun Ray */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-amber-200/40 rounded-full blur-3xl" />
        
        {/* Floating Clouds */}
        <div className="absolute top-6 left-12 text-6xl opacity-80 animate-cloud-slow">☁️</div>
        <div className="absolute top-16 right-20 text-7xl opacity-85 animate-cloud-fast">☁️</div>
        <div className="absolute top-8 left-1/2 text-5xl opacity-60 animate-cloud-slow">☁️</div>

        {/* Grass Hills at bottom */}
        <div className="absolute bottom-0 w-full h-32 bg-emerald-400 rounded-t-[100%] scale-x-125 translate-y-12" />
        <div className="absolute bottom-0 w-full h-24 bg-green-500 rounded-t-[80%] scale-x-150 translate-y-8 opacity-90" />
        
        {/* Flowers & Butterflies */}
        <div className="absolute bottom-3 left-8 text-2xl md:text-3xl">🌸 🌼 🌺</div>
        <div className="absolute bottom-4 right-10 text-2xl md:text-3xl">🦋 🌼 🌸</div>
        <div className="absolute top-1/3 left-6 text-2xl opacity-75">🦋</div>
        <div className="absolute top-1/2 right-6 text-2xl opacity-75">🦋</div>
      </div>

      {/* TOP BAR / GAME CONTROLS */}
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center relative z-20 mb-3 gap-2">
        {/* Left: Audio & Counter */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick BGM Button */}
          <button
            onClick={handleToggleBgm}
            className={`w-11 h-11 md:w-13 md:h-13 rounded-full border-4 border-white flex items-center justify-center text-lg md:text-xl shadow-lg btn-bubble transition-all ${
              isBgmPlaying
                ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950 ring-2 ring-amber-300'
                : 'bg-slate-300 text-slate-600'
            }`}
            title="Klik untuk Nyalakan/Matikan Musik (M)"
          >
            {isBgmPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Audio Settings Button */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsAudioModalOpen(true);
            }}
            className="w-10 h-10 md:w-11 md:h-11 bg-white/80 hover:bg-white text-slate-700 rounded-2xl border-2 border-amber-300 flex items-center justify-center shadow-md btn-bubble"
            title="Pengaturan Musik Seru & Volume"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Question Counter Card */}
          <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 md:px-4 md:py-2 rounded-2xl border-2 border-sky-300 shadow-md">
            <span className="text-[10px] text-sky-700 font-extrabold uppercase tracking-wide block">
              ICE BREAKING CLASS
            </span>
            <span className="text-sm md:text-base font-black text-amber-600">
              Soal {currentIndex + 1} / {questions.length}
            </span>
          </div>
        </div>

        {/* Center: Title Brand */}
        <div className="text-center hidden sm:block">
          <h1 className="text-2xl md:text-3xl font-black font-title tracking-wide text-amber-500 drop-shadow-[0_2px_2px_rgba(255,255,255,1)]">
            GUERILLA QUIZ
          </h1>
          <span className="text-[11px] font-bold text-slate-600 bg-white/70 px-2.5 py-0.5 rounded-full border border-sky-200">
            Gerak Cepat · Berdiri atau Duduk!
          </span>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Rules / Tutorial */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsRulesModalOpen(true);
            }}
            className="w-10 h-10 md:w-11 md:h-11 bg-white/90 hover:bg-white text-sky-700 rounded-2xl border-2 border-sky-300 flex items-center justify-center shadow-md btn-bubble"
            title="Cara Main Kuis Gerilya"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Question Editor */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsEditorModalOpen(true);
            }}
            className="w-11 h-11 md:w-13 md:h-13 bg-gradient-to-b from-sky-400 to-sky-600 hover:from-sky-300 hover:to-sky-500 text-white rounded-full border-4 border-white flex items-center justify-center text-lg md:text-xl shadow-lg btn-bubble"
            title="Edit Daftar Soal (⚙️)"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 md:w-11 md:h-11 bg-white/90 hover:bg-white text-slate-700 rounded-2xl border-2 border-slate-300 flex items-center justify-center shadow-md btn-bubble hidden md:flex"
            title="Layar Penuh (F)"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* MAIN GAME CARD CONTAINER */}
      <main className="w-full max-w-4xl mx-auto my-auto relative z-10 bg-white/92 backdrop-blur-md rounded-3xl p-5 md:p-9 border-8 border-amber-300 shadow-2xl transition-all">
        
        {/* =========================================
            SLIDE 1: QUESTION PHASE
            ========================================= */}
        {phase === 'question' && (
          <div className="flex flex-col items-center text-center animate-in fade-in duration-200">
            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-black px-5 py-1.5 rounded-full text-xs md:text-sm shadow-md border-2 border-white uppercase tracking-wider flex items-center gap-1.5">
                📝 PERTANYAAN #{currentIndex + 1}
              </span>

              {/* Teacher Hint Toggle */}
              <button
                onClick={() => setShowTeacherHint(!showTeacherHint)}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
                title="Kunci jawaban rahasia untuk guru"
              >
                {showTeacherHint ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showTeacherHint ? `Kunci: ${currentQuestion.a ? 'BENAR' : 'SALAH'}` : 'Kunci Guru'}
              </button>
            </div>

            {/* Question Text Box */}
            <div className="min-h-[110px] md:min-h-[130px] flex items-center justify-center w-full px-2 md:px-6 my-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight font-title">
                "{currentQuestion.q}"
              </h2>
            </div>

            {/* MOVEMENT OPTION CARDS (TANPA KOTAK LUAR / HANYA BERDIRI & DUDUK) */}
            <MovementOptionCards highlightAnswer={null} />

            {/* BIG PLAY BUTTON */}
            <button
              onClick={startCountdown}
              className="mt-4 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-amber-950 font-black text-xl sm:text-2xl md:text-3xl px-8 sm:px-12 py-4 md:py-5 rounded-full border-4 border-white shadow-xl btn-bubble flex items-center gap-3 transform active:scale-95"
            >
              <span className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-amber-600 text-lg shadow-inner">
                <Play className="w-5 h-5 fill-amber-600 ml-0.5" />
              </span>
              <span>SIAP BERGERAK! (5 DETIK)</span>
            </button>

            <p className="mt-3 text-slate-400 text-xs font-bold">
              Tekan <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded font-mono text-[10px]">Spasi</kbd> untuk mulai countdown
            </p>
          </div>
        )}

        {/* =========================================
            SLIDE 2: COUNTDOWN 5 SECONDS PHASE
            ========================================= */}
        {phase === 'countdown' && (
          <div className="w-full flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95 duration-200">
            <span className="bg-amber-100 text-amber-800 font-black text-xs md:text-sm px-4 py-1 rounded-full uppercase tracking-wider mb-2 border border-amber-300">
              ⏱️ WAKTU BERPIKIR & BERSIAP
            </span>

            <h3 className="text-3xl md:text-4xl font-black text-amber-600 mb-2 font-title">
              SIAP-SIAP... BERGERAK!
            </h3>
            <p className="text-slate-600 text-sm md:text-base font-extrabold mb-5">
              <span className="text-emerald-700">BERDIRI</span> jika Benar · <span className="text-rose-700">DUDUK</span> jika Salah!
            </p>

            {/* Big Playful Animated Countdown Circle */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 flex items-center justify-center bg-gradient-to-b from-amber-50 to-amber-200 rounded-full border-8 border-amber-400 shadow-2xl my-3">
              {/* Spinning progress ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="rgba(245, 158, 11, 0.2)"
                  strokeWidth="8"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="8"
                  strokeDasharray="500"
                  strokeDashoffset={500 - (500 * (countdownSeconds / 5))}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>

              <span className="text-8xl sm:text-9xl font-black text-rose-500 animate-pulse-scale drop-shadow-md">
                {countdownSeconds}
              </span>
            </div>

            <p className="mt-4 text-slate-600 font-extrabold text-sm sm:text-base">
              Ayo kompak seluruh kelas! 🏃‍♀️🏃‍♂️ Jangan sampai salah posisi!
            </p>

            {/* Skip Countdown early -> Langsung Buka Pop-Up Jawaban */}
            <button
              onClick={revealAnswerPopUp}
              className="mt-5 text-xs text-slate-500 hover:text-slate-800 bg-white/80 border border-slate-300 hover:bg-white px-3.5 py-1.5 rounded-full font-bold transition-colors"
            >
              Langsung Buka Jawaban ⏩
            </button>
          </div>
        )}

        {/* =========================================
            SLIDE 3: FINISHED PHASE
            ========================================= */}
        {phase === 'finished' && (
          <div className="w-full flex flex-col items-center text-center py-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-400 text-amber-600 flex items-center justify-center text-4xl shadow-lg mb-4 animate-bounce">
              <Trophy className="w-10 h-10 text-amber-500" />
            </div>

            <h3 className="text-3xl md:text-5xl font-black text-amber-600 font-title mb-2">
              Kuis Selesai! 🎉
            </h3>
            <p className="text-slate-600 font-extrabold text-base md:text-lg max-w-lg mb-6">
              Luar biasa! Seluruh siswa telah menyelesaikan {questions.length} soal ice-breaking dengan penuh semangat.
            </p>

            {/* Summary Illustration Showcase - Tanpa kotak luar siswa */}
            <div className="p-4 bg-sky-50 rounded-3xl border-2 border-sky-200 max-w-md w-full mb-6 flex items-center justify-around">
              <div className="flex flex-col items-center">
                <img src="/student_standing.png" alt="Standing student" className="h-28 object-contain" />
                <span className="text-xs font-bold text-emerald-700 mt-1">BERDIRI (Benar)</span>
              </div>
              <div className="text-2xl font-black text-amber-500">✨</div>
              <div className="flex flex-col items-center">
                <img src="/student_sitting.png" alt="Sitting student" className="h-28 object-contain" />
                <span className="text-xs font-bold text-rose-700 mt-1">DUDUK (Salah)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <button
                onClick={handleRestartQuiz}
                className="flex-1 bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-white font-black py-4 rounded-2xl btn-bubble shadow-lg text-lg flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Mainkan Lagi
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setIsEditorModalOpen(true);
                }}
                className="flex-1 bg-gradient-to-b from-sky-400 to-sky-600 hover:from-sky-300 hover:to-sky-500 text-white font-black py-4 rounded-2xl btn-bubble shadow-lg text-lg flex items-center justify-center gap-2"
              >
                <Settings className="w-5 h-5" />
                Ganti Paket Soal
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION BAR */}
        <div className="mt-8 pt-4 border-t-4 border-amber-100 flex justify-between items-center flex-wrap gap-2">
          <button
            onClick={handlePrevQuestion}
            disabled={currentIndex === 0 || phase === 'countdown'}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2.5 rounded-2xl font-black btn-bubble disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 text-xs sm:text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </button>

          {/* Keyboard hint */}
          <span className="text-slate-400 font-bold text-xs hidden md:inline">
            Gunakan Spasi / Enter ⌨️ · Mute (M) · Layar Penuh (F)
          </span>

          <button
            onClick={handleNextQuestion}
            disabled={phase === 'countdown'}
            className="bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-white px-5 py-2.5 rounded-2xl font-black btn-bubble flex items-center gap-1.5 text-xs sm:text-sm shadow-md"
          >
            {currentIndex === questions.length - 1 ? 'Selesai 🏁' : 'Berikutnya'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </main>

      {/* FOOTER INFO */}
      <footer className="w-full max-w-4xl mx-auto text-center mt-3 relative z-10 text-xs font-bold text-emerald-950/70">
        Guerilla Class Quiz · Media Edukasi Interaktif Kelas Berbasis Gerak Tubuh
      </footer>

      {/* =========================================
          POP-UP MODAL JAWABAN (SETELAH HITUNGAN HABIS)
          ========================================= */}
      <AnswerModal
        isOpen={isAnswerModalOpen}
        onClose={() => setIsAnswerModalOpen(false)}
        onNext={handleNextQuestion}
        onRepeat={handleRepeatQuestion}
        question={currentQuestion}
        isLastQuestion={isLastQuestion}
      />

      {/* MODALS LAINNYA */}
      <AudioSettingsModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        isBgmPlaying={isBgmPlaying}
        setIsBgmPlaying={setIsBgmPlaying}
        currentTrack={currentTrack}
        setCurrentTrack={setCurrentTrack}
      />

      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />

      <EditorModal
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        questions={questions}
        setQuestions={setQuestions}
        activePackId={activePackId}
        setActivePackId={setActivePackId}
        setCurrentIndex={setCurrentIndex}
      />

    </div>
  );
}
