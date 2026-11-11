import React from 'react';
import { X, CheckCircle2, AlertTriangle, Users, Trophy } from 'lucide-react';
import { soundEngine } from '../utils/audioEngine';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 border-4 border-sky-300 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 font-black text-xl">
              🎯
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 font-title">Aturan Main Guerilla Class Quiz</h3>
              <p className="text-xs text-slate-500 font-medium">Ice Breaking Gerak & Edukasi Seru di Kelas</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="mt-5 space-y-4 text-slate-700">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100">
            <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center font-black text-sm shrink-0">
              1
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-sky-900">Membaca Pernyataan Soal</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Guru menampilkan soal di layar proyektor atau membacakan dengan suara lantang ke seluruh siswa.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-sm shrink-0">
              2
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-amber-900">Hitung Mundur 5 Detik</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Saat tombol <span className="font-bold text-amber-700">"SIAP BERGERAK!"</span> ditekan, timer 5 detik berbunyi. Semua siswa bersiap menentukan posisi tubuhnya!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🧍‍♂️</span>
              <span className="text-xs font-bold uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full mb-1">
                JIKA BENAR
              </span>
              <h5 className="font-black text-xl text-emerald-700">BERDIRI</h5>
              <p className="text-[11px] text-slate-600 mt-1">
                Siswa yang yakin pernyataan itu <strong>BENAR</strong> harus langsung berdiri.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 flex flex-col items-center text-center">
              <span className="text-2xl mb-1">🪑</span>
              <span className="text-xs font-bold uppercase text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full mb-1">
                JIKA SALAH
              </span>
              <h5 className="font-black text-xl text-rose-700">DUDUK</h5>
              <p className="text-[11px] text-slate-600 mt-1">
                Siswa yang yakin pernyataan itu <strong>SALAH</strong> harus tetap duduk di kursi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100">
            <div className="w-7 h-7 rounded-full bg-purple-500 text-white flex items-center justify-center font-black text-sm shrink-0">
              3
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-purple-900">Pengumuman & Pembahasan</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Kunci jawaban dibuka. Siswa yang gerakannya tepat merayakan kemenangan, dan guru dapat membaca penjelasan edukatif yang tertera!
              </p>
            </div>
          </div>
        </div>

        {/* Tips for Teachers */}
        <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-xs font-black text-slate-700 mb-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            Tips Seru Guru di Kelas:
          </div>
          <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
            <li>Nyalakan speaker komputer agar suara musik dan efek hitungan terdengar jelas.</li>
            <li>Gunakan tombol <kbd className="px-1.5 py-0.5 bg-white border rounded text-[10px] font-mono">Spasi</kbd> untuk mulai bergerak dengan cepat.</li>
            <li>Siswa yang salah posisi bisa diberi tantangan lucu, seperti tepuk pramuka atau memimpin yel-yel!</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-right">
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="w-full bg-gradient-to-b from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-white font-black py-3 rounded-2xl btn-bubble shadow-md"
          >
            Mengerti & Mulai Bermain! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
