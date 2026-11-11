export interface QuestionItem {
  id: string;
  q: string;
  a: boolean; // true = BENAR (BERDIRI), false = SALAH (DUDUK)
  explanation?: string;
}

export interface QuestionPack {
  id: string;
  title: string;
  badge: string;
  description: string;
  questions: QuestionItem[];
}

export const DEFAULT_PACKS: QuestionPack[] = [
  {
    id: 'beruang',
    title: '🐾 Cerita Beruang Liar (Bawaan)',
    badge: 'Video & Literasi',
    description: 'Soal pemahaman video tentang beruang liar yang masuk ke permukiman warga',
    questions: [
      { id: 'b1', q: "Beruang dalam video memanjat pagar rumah warga pada malam hari.", a: true, explanation: "Benar, beruang biasanya beraktivitas mencari makan saat suasana sepi di malam hari." },
      { id: 'b2', q: "Beruang masuk permukiman karena sengaja ingin mengganggu warga.", a: false, explanation: "Salah! Beruang biasanya masuk permukiman karena habitat alaminya rusak atau kekurangan sumber makanan di hutan." },
      { id: 'b3', q: "Beruang itu hewan jahat yang harus segera dibasmi.", a: false, explanation: "Salah! Beruang adalah satwa liar yang dilindungi dan bagian penting dari ekosistem hutan." },
      { id: 'b4', q: "Jika ada hewan liar masuk kampung, warga boleh mendekatinya dan memberinya makan.", a: false, explanation: "Salah! Hewan liar berbahaya dan tidak terbiasa dengan manusia, segera lapor pihak berwenang / BKSDA." },
      { id: 'b5', q: "Kejadian seperti dalam video bisa membahayakan hewan dan juga warga.", a: true, explanation: "Benar, konflik satwa dan manusia berisiko mencelakai kedua belah pihak." }
    ]
  },
  {
    id: 'sains',
    title: '🔬 Sains & Dunia Hewan Seru',
    badge: 'IPA Kelas',
    description: 'Fakta unik seputar alam, tubuh manusia, dan satwa',
    questions: [
      { id: 's1', q: "Matahari terbit dari arah barat dan tenggelam di arah timur.", a: false, explanation: "Salah! Karena rotasi Bumi, Matahari tampak terbit dari timur dan tenggelam di barat." },
      { id: 's2', q: "Lumba-lumba adalah mamalia yang bernapas menggunakan paru-paru.", a: true, explanation: "Benar, lumba-lumba bukan ikan, melainkan mamalia laut yang sesekali naik ke permukaan untuk bernapas." },
      { id: 's3', q: "Tumbuhan menghasilkan oksigen melalui proses fotosintesis pada siang hari.", a: true, explanation: "Benar, klorofil memanfaatkan cahaya matahari untuk mengolah air dan karbon dioksida menjadi glukosa dan oksigen." },
      { id: 's4', q: "Air laut rasanya asin karena ada penambang garam di dasar samudera.", a: false, explanation: "Salah! Rasa asin berasal dari mineral dan garam bebatuan yang terkikis oleh aliran sungai selama jutaan tahun." },
      { id: 's5', q: "Bunglon mengubah warna kulitnya hanya saat sedang lapar.", a: false, explanation: "Salah! Bunglon mengubah warna untuk kamuflase, mengatur suhu tubuh, dan mengekspresikan suasana hati." }
    ]
  },
  {
    id: 'kebangsaan',
    title: '🇮🇩 Wawasan & Budaya Nusantara',
    badge: 'Pengetahuan Umum',
    description: 'Kuis seru seputar kekayaan geografi dan budaya Indonesia',
    questions: [
      { id: 'k1', q: "Lagu kebangsaan negara Indonesia adalah 'Indonesia Raya' ciptaan W.R. Supratman.", a: true, explanation: "Benar, pertama kali diperdengarkan secara resmi pada Kongres Pemuda II tahun 1928." },
      { id: 'k2', q: "Candi Borobudur terletak di provinsi Bali.", a: false, explanation: "Salah! Candi Borobudur terletak di Magelang, Jawa Tengah." },
      { id: 'k3', q: "Komodo adalah kadal terbesar di dunia yang merupakan satwa endemik Indonesia.", a: true, explanation: "Benar, komodo secara alami hanya hidup di kepulauan Nusa Tenggara Timur." },
      { id: 'k4', q: "Warna bendera Indonesia adalah Merah di bagian bawah dan Putih di bagian atas.", a: false, explanation: "Salah! Sang Saka Merah Putih: Merah di atas dan Putih di bawah." },
      { id: 'k5', q: "Semboyan 'Bhinneka Tunggal Ika' bermakna berbeda-beda tetapi tetap satu jua.", a: true, explanation: "Benar, berasal dari kitab Sutasoma karya Mpu Tantular." }
    ]
  }
];
