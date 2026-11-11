import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Bell, Sparkles, X, Check } from 'lucide-react';
import { soundEngine, BGM_TRACKS, BgmTrackId } from '../utils/audioEngine';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBgmPlaying: boolean;
  setIsBgmPlaying: (val: boolean) => void;
  currentTrack: BgmTrackId;
  setCurrentTrack: (track: BgmTrackId) => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  isOpen,
  onClose,
  isBgmPlaying,
  setIsBgmPlaying,
  currentTrack,
  setCurrentTrack,
}) => {
  const [bgmVol, setBgmVol] = useState(35);
  const [sfxVol, setSfxVol] = useState(70);

  if (!isOpen) return null;

  const handleToggleBgm = () => {
    if (isBgmPlaying) {
      soundEngine.stopBGM();
      setIsBgmPlaying(false);
    } else {
      soundEngine.startBGM(currentTrack);
      setIsBgmPlaying(true);
    }
  };

  const handleSelectTrack = (trackId: BgmTrackId) => {
    soundEngine.playClick();
    setCurrentTrack(trackId);
    soundEngine.setTrack(trackId);
    if (!isBgmPlaying) {
      soundEngine.startBGM(trackId);
      setIsBgmPlaying(true);
    }
  };

  const handleBgmVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setBgmVol(val);
    soundEngine.setVolumes(val / 100, sfxVol / 100);
  };

  const handleSfxVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSfxVol(val);
    soundEngine.setVolumes(bgmVol / 100, val / 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 border-4 border-amber-300 shadow-2xl relative">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 font-title">Pengaturan Backsound & Audio</h3>
              <p className="text-xs text-slate-500 font-medium">Pilih musik seru dan sesuaikan volume kelas</p>
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

        {/* Content */}
        <div className="mt-5 space-y-5">
          {/* Main BGM Switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center gap-3">
              {isBgmPlaying ? (
                <Volume2 className="w-6 h-6 text-amber-600 animate-pulse" />
              ) : (
                <VolumeX className="w-6 h-6 text-slate-400" />
              )}
              <div>
                <div className="font-bold text-slate-800 text-sm">Musik Latar (BGM)</div>
                <div className="text-xs text-slate-500">
                  {isBgmPlaying ? 'Sedang dimainkan di latar kuis' : 'Musik dinonaktifkan'}
                </div>
              </div>
            </div>
            <button
              onClick={handleToggleBgm}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isBgmPlaying
                  ? 'bg-amber-500 text-white shadow-md hover:bg-amber-600'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {isBgmPlaying ? 'Nyala 🎵' : 'Mati 🔇'}
            </button>
          </div>

          {/* Track Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Pilihan Lagu Seru
            </label>
            <div className="grid grid-cols-1 gap-2">
              {BGM_TRACKS.map(track => {
                const isSelected = currentTrack === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => handleSelectTrack(track.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50/80 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                        <span>{track.name}</span>
                        <span className="text-[11px] font-normal text-slate-500">({track.tempo} BPM)</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{track.description}</div>
                    </div>
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume Sliders */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-amber-500" />
                  Volume Musik
                </span>
                <span>{bgmVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={bgmVol}
                onChange={handleBgmVolChange}
                className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-emerald-500" />
                  Volume Efek Suara (Ting / Fanfare / Boing)
                </span>
                <span>{sfxVol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sfxVol}
                onChange={handleSfxVolChange}
                className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Test SFX Buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tes Efek Suara:</span>
            <div className="flex gap-2">
              <button
                onClick={() => soundEngine.playVictoryFanfare()}
                className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold hover:bg-emerald-200 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Benar
              </button>
              <button
                onClick={() => soundEngine.playWrongBoing()}
                className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 text-xs font-bold hover:bg-rose-200 transition-colors"
              >
                Salah
              </button>
              <button
                onClick={() => soundEngine.playCountdownTick(1)}
                className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold hover:bg-amber-200 transition-colors"
              >
                Detik
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-right">
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="w-full bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black py-3 rounded-2xl btn-bubble shadow-md"
          >
            Selesai & Lanjutkan Kuis
          </button>
        </div>
      </div>
    </div>
  );
};
