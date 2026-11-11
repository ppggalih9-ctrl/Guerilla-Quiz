import React from 'react';
import { X, CheckCircle2, XCircle, RotateCcw, ArrowRight, Lightbulb } from 'lucide-react';
import { QuestionItem } from '../types';
import { soundEngine } from '../utils/audioEngine';

interface AnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onRepeat: () => void;
  question: QuestionItem;
  isLastQuestion: boolean;
}

export const AnswerModal: React.FC<AnswerModalProps> = ({
  isOpen,
  onClose,
  onNext,
  onRepeat,
  question,
  isLastQuestion,
}) => {
  if (!isOpen) return null;

  const isTrue = question.a;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 text-center border-8 border-amber-300 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Soft Background Tint */}
        <div
          className={`absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-40 ${
            isTrue ? 'bg-emerald-300' : 'bg-rose-300'
          }`}
        />

        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Jawaban Badge */}
        <div className="mb-3">
          <div
            className={`inline-flex items-center gap-2 px-7 py-2 rounded-full font-black text-xl md:text-2xl text-white shadow-xl border-4 border-white ${
              isTrue
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 ring-4 ring-emerald-300'
                : 'bg-gradient-to-r from-rose-500 to-rose-600 ring-4 ring-rose-300'
            }`}
          >
            {isTrue ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-yellow-300" />
                JAWABAN: BENAR
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-yellow-300" />
                JAWABAN: SALAH
              </>
            )}
          </div>
        </div>

        {/* Action Movement Card Container */}
        <div
          className={`my-3 p-5 rounded-3xl border-4 flex flex-col items-center justify-center relative ${
            isTrue
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : 'bg-rose-50 border-rose-400 text-rose-950'
          }`}
        >
          <span className="text-xs uppercase font-extrabold tracking-wider opacity-75 block mb-1">
            POSISI GERAKAN:
          </span>

          {/* Heading - Hanya BERDIRI atau DUDUK (Proporsional) */}
          <h3
            className={`text-4xl md:text-5xl font-black font-title tracking-normal mb-2 ${
              isTrue ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {isTrue ? 'BERDIRI' : 'DUDUK'}
          </h3>

          {/* Student Illustration - Tampak utuh tanpa frame atau kotak luar */}
          <div className="w-32 h-44 sm:w-40 sm:h-52 flex items-center justify-center my-2">
            <img
              src={isTrue ? '/student_standing.png' : '/student_sitting.png'}
              alt={isTrue ? 'Siswa Berdiri' : 'Siswa Duduk'}
              referrerPolicy="no-referrer"
              className="w-auto h-full max-h-[180px] sm:max-h-[210px] object-contain filter drop-shadow-xl animate-bounce"
            />
          </div>

          {/* Catatan / Penjelasan Guru */}
          {question.explanation && (
            <div className="mt-3 w-full p-3 bg-white/90 rounded-2xl border border-black/5 text-xs md:text-sm font-semibold text-slate-700 text-left flex items-start gap-2 shadow-xs">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-amber-600 block mb-0.5">Catatan Guru:</span>
                {question.explanation}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={() => {
              soundEngine.playClick();
              onRepeat();
            }}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-2xl btn-bubble border border-slate-300 flex items-center justify-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Ulangi Soal
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onNext();
            }}
            className="flex-1 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-amber-950 font-black text-base md:text-lg py-3 rounded-2xl btn-bubble border-2 border-white shadow-lg flex items-center justify-center gap-2"
          >
            <span>{isLastQuestion ? 'Lihat Hasil 🏁' : 'Lanjut ➡️'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
