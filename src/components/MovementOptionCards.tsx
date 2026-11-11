import React, { useState } from 'react';

interface MovementOptionCardsProps {
  highlightAnswer?: boolean | null; // null: normal state, true: highlight BERDIRI, false: highlight DUDUK
  interactive?: boolean;
  onSelectOption?: (val: boolean) => void;
}

export const MovementOptionCards: React.FC<MovementOptionCardsProps> = ({
  highlightAnswer = null,
  interactive = false,
  onSelectOption,
}) => {
  const [standingImgError, setStandingImgError] = useState(false);
  const [sittingImgError, setSittingImgError] = useState(false);

  const isStandingActive = highlightAnswer === true;
  const isSittingActive = highlightAnswer === false;
  const isDimmedStanding = highlightAnswer === false;
  const isDimmedSitting = highlightAnswer === true;

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 my-3">
      {/* OPSI BENAR = BERDIRI */}
      <div
        onClick={() => interactive && onSelectOption?.(true)}
        className={`relative rounded-3xl p-4 sm:p-5 md:p-6 transition-all duration-300 border-4 overflow-hidden ${
          isStandingActive
            ? 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 border-amber-300 shadow-2xl scale-[1.02] ring-4 ring-amber-300'
            : isDimmedStanding
            ? 'bg-gradient-to-b from-emerald-800/60 to-emerald-950/70 border-emerald-900/40 opacity-40 grayscale-[40%]'
            : 'bg-gradient-to-b from-emerald-400 to-emerald-600 border-white shadow-xl hover:shadow-2xl'
        } ${interactive ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
      >
        {/* Soft Background Radial Light */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 rounded-full bg-white/15 pointer-events-none blur-xl" />

        <div className="flex items-center justify-between gap-2 sm:gap-4 relative z-10 w-full">
          <div className="text-left flex-1 min-w-0">
            <span className="inline-block bg-emerald-900/60 text-emerald-100 text-xs sm:text-sm font-black uppercase px-3 py-1 rounded-full shadow-inner tracking-wider">
              JIKA BENAR
            </span>

            {/* Ukuran tulisan disesuaikan agar proporsional dan tidak menutupi gambar siswa */}
            <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-black mt-1.5 text-yellow-300 font-title drop-shadow-md tracking-normal">
              BERDIRI
            </h3>
          </div>

          {/* Student Illustration (BERDIRI) - Tampak utuh tanpa terpotong dan tanpa kotak luar */}
          <div className="w-24 sm:w-28 md:w-36 h-36 sm:h-40 md:h-48 flex items-center justify-center shrink-0 pr-1">
            {!standingImgError ? (
              <img
                src="/student_standing.png"
                alt="Siswa Berdiri"
                referrerPolicy="no-referrer"
                onError={() => setStandingImgError(true)}
                className="w-auto h-full max-h-[145px] sm:max-h-[165px] md:max-h-[185px] object-contain filter drop-shadow-lg transform hover:scale-105 transition-transform"
              />
            ) : (
              /* Fallback SVG */
              <svg viewBox="0 0 120 150" className="w-full h-full drop-shadow">
                <circle cx="60" cy="30" r="18" fill="#FDBA74" />
                <path d="M 40 28 C 38 12, 82 12, 80 28 Z" fill="#1E293B" />
                <path d="M 38 48 L 82 48 L 76 88 L 44 88 Z" fill="#60A5FA" />
                <path d="M 44 92 L 76 92 L 74 135 L 46 135 Z" fill="#1E3A8A" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* OPSI SALAH = DUDUK */}
      <div
        onClick={() => interactive && onSelectOption?.(false)}
        className={`relative rounded-3xl p-4 sm:p-5 md:p-6 transition-all duration-300 border-4 overflow-hidden ${
          isSittingActive
            ? 'bg-gradient-to-b from-rose-400 via-rose-500 to-rose-600 border-amber-300 shadow-2xl scale-[1.02] ring-4 ring-amber-300'
            : isDimmedSitting
            ? 'bg-gradient-to-b from-rose-950/60 to-rose-950/70 border-rose-900/40 opacity-40 grayscale-[40%]'
            : 'bg-gradient-to-b from-rose-400 to-rose-600 border-white shadow-xl hover:shadow-2xl'
        } ${interactive ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
      >
        {/* Soft Background Radial Light */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 rounded-full bg-white/15 pointer-events-none blur-xl" />

        <div className="flex items-center justify-between gap-2 sm:gap-4 relative z-10 w-full">
          <div className="text-left flex-1 min-w-0">
            <span className="inline-block bg-rose-950/60 text-rose-100 text-xs sm:text-sm font-black uppercase px-3 py-1 rounded-full shadow-inner tracking-wider">
              JIKA SALAH
            </span>

            {/* Ukuran tulisan disesuaikan agar proporsional dan tidak menutupi gambar siswa */}
            <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-black mt-1.5 text-yellow-300 font-title drop-shadow-md tracking-normal">
              DUDUK
            </h3>
          </div>

          {/* Student Illustration (DUDUK) - Tampak utuh tanpa terpotong dan tanpa kotak luar */}
          <div className="w-24 sm:w-28 md:w-36 h-36 sm:h-40 md:h-48 flex items-center justify-center shrink-0 pr-1">
            {!sittingImgError ? (
              <img
                src="/student_sitting.png"
                alt="Siswa Duduk"
                referrerPolicy="no-referrer"
                onError={() => setSittingImgError(true)}
                className="w-auto h-full max-h-[145px] sm:max-h-[165px] md:max-h-[185px] object-contain filter drop-shadow-lg transform hover:scale-105 transition-transform"
              />
            ) : (
              /* Fallback SVG */
              <svg viewBox="0 0 120 150" className="w-full h-full drop-shadow">
                <circle cx="60" cy="30" r="17" fill="#FDBA74" />
                <path d="M 42 46 L 78 46 L 74 78 L 46 78 Z" fill="#60A5FA" />
                <rect x="20" y="72" width="80" height="10" rx="2" fill="#F59E0B" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
