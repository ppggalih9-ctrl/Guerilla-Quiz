import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, XCircle, RotateCcw, Download, Upload } from 'lucide-react';
import { QuestionItem, QuestionPack, DEFAULT_PACKS } from '../types';
import { soundEngine } from '../utils/audioEngine';

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuestionItem[];
  setQuestions: (q: QuestionItem[]) => void;
  activePackId: string;
  setActivePackId: (id: string) => void;
  setCurrentIndex: (idx: number) => void;
}

export const EditorModal: React.FC<EditorModalProps> = ({
  isOpen,
  onClose,
  questions,
  setQuestions,
  activePackId,
  setActivePackId,
  setCurrentIndex,
}) => {
  const [localQuestions, setLocalQuestions] = useState<QuestionItem[]>(questions);

  // Sync when opened
  React.useEffect(() => {
    if (isOpen) {
      setLocalQuestions(JSON.parse(JSON.stringify(questions)));
    }
  }, [isOpen, questions]);

  if (!isOpen) return null;

  const handleTextChange = (idx: number, newText: string) => {
    const updated = [...localQuestions];
    updated[idx].q = newText;
    setLocalQuestions(updated);
  };

  const handleExplanationChange = (idx: number, newExp: string) => {
    const updated = [...localQuestions];
    updated[idx].explanation = newExp;
    setLocalQuestions(updated);
  };

  const handleAnswerChange = (idx: number, newAnswer: boolean) => {
    soundEngine.playClick();
    const updated = [...localQuestions];
    updated[idx].a = newAnswer;
    setLocalQuestions(updated);
  };

  const handleAddQuestion = () => {
    soundEngine.playClick();
    const newQ: QuestionItem = {
      id: 'custom_' + Date.now(),
      q: 'Tuliskan pernyataan soal di sini...',
      a: true,
      explanation: 'Penjelasan singkat jawaban.',
    };
    setLocalQuestions([...localQuestions, newQ]);
  };

  const handleDelete = (idx: number) => {
    soundEngine.playClick();
    if (localQuestions.length <= 1) {
      alert('Minimal harus ada 1 pertanyaan!');
      return;
    }
    const updated = localQuestions.filter((_, i) => i !== idx);
    setLocalQuestions(updated);
  };

  const handleSelectPack = (pack: QuestionPack) => {
    soundEngine.playClick();
    setActivePackId(pack.id);
    setLocalQuestions(JSON.parse(JSON.stringify(pack.questions)));
  };

  const handleSave = () => {
    soundEngine.playVictoryFanfare();
    setQuestions(localQuestions);
    setCurrentIndex(0);
    onClose();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(localQuestions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kuis_gerilya_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLocalQuestions(parsed);
          alert(`Berhasil memuat ${parsed.length} soal!`);
        }
      } catch {
        alert('Format file JSON tidak valid!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 border-4 border-sky-300 shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 font-title flex items-center gap-2">
              ⚙️ Pengelola Soal & Paket Kuis
            </h3>
            <p className="text-xs text-slate-500 font-medium">Ubah soal, kunci jawaban (Berdiri / Duduk), atau pilih paket</p>
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

        {/* Preset Packs Selector */}
        <div className="py-3 border-b border-slate-100 shrink-0">
          <div className="text-xs font-bold text-slate-600 mb-2">Pilih Paket Bawaan:</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {DEFAULT_PACKS.map(pack => (
              <button
                key={pack.id}
                onClick={() => handleSelectPack(pack)}
                className={`p-2.5 rounded-xl border text-left transition-all text-xs font-bold ${
                  activePackId === pack.id
                    ? 'border-sky-500 bg-sky-50 text-sky-900 shadow-sm'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>{pack.title}</div>
                <div className="text-[10px] text-slate-500 font-normal">{pack.questions.length} Soal</div>
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          {localQuestions.map((q, idx) => (
            <div
              key={q.id || idx}
              className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-xs text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  Soal #{idx + 1}
                </span>
                <button
                  onClick={() => handleDelete(idx)}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Hapus
                </button>
              </div>

              {/* Text Input */}
              <textarea
                value={q.q}
                onChange={e => handleTextChange(idx, e.target.value)}
                rows={2}
                placeholder="Tuliskan pernyataan soal..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
              />

              {/* Answer Toggle */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                <span className="text-xs font-bold text-slate-600">Kunci Jawaban Gerakan:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAnswerChange(idx, true)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                      q.a
                        ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-300'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    BENAR (Berdiri 🧍)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAnswerChange(idx, false)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                      !q.a
                        ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-300'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    SALAH (Duduk 🪑)
                  </button>
                </div>
              </div>

              {/* Teacher Explanation */}
              <div className="pt-1">
                <input
                  type="text"
                  value={q.explanation || ''}
                  onChange={e => handleExplanationChange(idx, e.target.value)}
                  placeholder="Catatan / Pembahasan edukasi untuk guru..."
                  className="w-full px-2.5 py-1.5 bg-white/70 border border-slate-200 rounded-lg text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-300"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Action Controls & Footer */}
        <div className="pt-3 border-t border-slate-100 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleAddQuestion}
              className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm btn-bubble"
            >
              <Plus className="w-4 h-4" />
              Tambah Soal
            </button>

            <button
              onClick={handleExportJSON}
              title="Unduh soal sebagai JSON"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              <Download className="w-4 h-4" />
            </button>

            <label
              title="Impor soal dari file JSON"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold"
            >
              Batal
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white text-xs font-black shadow-md btn-bubble"
            >
              Simpan & Terapkan ({localQuestions.length} Soal)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
