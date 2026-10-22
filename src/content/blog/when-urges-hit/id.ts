import type { BlogArticle } from '../types';

/**
 * Indonesian version of the urge-hour data piece. Same numbers as en.ts (re-pull
 * before changing any of them); conversational register, "PMO" as the community
 * says it. Target queries: "jam rawan PMO", "dorongan PMO malam hari",
 * "kapan nafsu paling kuat".
 */
const HOURS = [81, 72, 35, 45, 33, 43, 32, 39, 37, 43, 61, 57, 70, 62, 47, 69, 52, 56, 51, 50, 85, 75, 73, 97];

const article: BlogArticle = {
  slug: 'when-urges-hit',
  lang: 'id',
  title: 'Kapan Dorongan PMO Paling Kuat? Kami Memetakan 1.365 Tekanan Tombol Panik per Jam',
  seoTitle: 'Kapan Dorongan PMO Paling Kuat? 1.365 Tombol Panik per Jam',
  description:
    'Kami menghitung setiap tekanan tombol panik di aplikasi AXIOM selama 90 hari. Jam paling rawan adalah jam 11 malam, bukan jam 2 pagi, dan jam 2 pagi justru salah satu jam paling sepi.',
  datePublished: '2026-10-22',
  dateModified: '2026-10-22',
  readingMinutes: 6,
  ctaLabel: 'Lihat cara kerja AXIOM',
  ctaText:
    'Tombol panik di AXIOM terbuka untuk semua orang, berbayar atau tidak. Dibuat untuk sepuluh menit setelah jam 11 malam.',
  blocks: [
    {
      kind: 'p',
      text: 'Kami kira jawabannya jam 2 pagi. Itu jam yang selalu disebut semua orang, dan jam yang disebut di halaman aplikasi kami sendiri di app store. Lalu kami menghitung. Jam ketika orang benar-benar mencari pertolongan adalah jam 11 malam, dan jam 2 pagi ternyata salah satu jam paling sepi sepanjang hari.',
    },
    {
      kind: 'callout',
      title: 'Versi singkatnya',
      text: 'Dari 1.365 tekanan tombol panik dalam 90 hari, jam tersibuk adalah jam 11 malam. Lima jam dari jam 8 malam sampai jam 1 pagi menampung 30% dari semua tekanan. Jam 2 pagi punya lebih sedikit tekanan daripada hampir semua jam lain. Kalau kamu menyiapkan diri untuk saat yang berat, siapkan untuk malam hari, bukan tengah malam buta.',
    },
    { kind: 'h2', text: 'Apa yang kami hitung' },
    {
      kind: 'p',
      text: 'AXIOM adalah aplikasi untuk berhenti nonton porno dengan tombol panik: satu ketukan, dari mana saja di dalam aplikasi, membuka layar yang dibuat untuk membantumu melewati beberapa menit ke depan. Tombol itu terbuka untuk semua orang, baik yang membayar maupun tidak. Setiap kali seseorang membukanya, aplikasi mencatat jam di ponselnya. Tidak ada hal lain dari momen itu yang dicatat.',
    },
    {
      kind: 'p',
      text: 'Kami mengambil setiap tekanan dari 24 Juli sampai 21 Oktober 2026, tanpa ponsel kami sendiri dan perangkat uji. Hasilnya 1.365 tekanan dari 767 orang di puluhan negara. Setiap tekanan masuk ke jam saat ia terjadi, menurut waktu lokal orang tersebut.',
    },
    {
      kind: 'hourChart',
      caption: 'Tekanan tombol panik per jam lokal, aplikasi AXIOM, 24 Juli sampai 21 Oktober 2026 (1.365 tekanan, 767 orang). Disorot: jam 8 malam sampai jam 1 pagi.',
      summary: 'Diagram batang 1.365 tekanan tombol panik menurut jam. Tekanan naik mulai jam 8 malam, memuncak pada jam 11 malam dengan 97 tekanan, tetap tinggi sampai jam 1 pagi, lalu turun ke titik terendah antara jam 2 pagi dan jam 9 pagi.',
      values: HOURS,
      peak: [20, 21, 22, 23, 0],
      tableLabel: 'Lihat setiap jam',
      hourHeader: 'Jam',
      valueHeader: 'Tekanan',
    },
    { kind: 'h2', text: 'Tiga hal yang terlihat dari diagram ini' },
    { kind: 'h3', text: '1. Malam hari itu tembok, bukan tanjakan' },
    {
      kind: 'p',
      text: 'Jam 7 malam ada 50 tekanan. Jam 8 malam ada 85. Lonjakannya semendadak itu, dan angkanya tetap tinggi sampai jam 1 pagi. Jam tersibuk adalah jam 11 malam, dengan 97 tekanan, sekitar 1,7 kali rata-rata satu jam. Kalau semua 1.365 tekanan dibagi rata ke 24 jam, setiap jam akan mendapat sekitar 57.',
    },
    { kind: 'h3', text: '2. Jam 2 pagi itu sepi' },
    {
      kind: 'p',
      text: 'Jam 2 pagi punya 35 tekanan. Hanya jam 4 dan jam 6 pagi yang lebih sedikit. Itu tidak berarti jam 2 pagi aman untuk semua orang. Bisa jadi pada jam 2 pagi kebanyakan orang sudah tidur, atau malam itu sudah terlanjur diputuskan, ke arah mana pun. Bagaimanapun juga, saat yang perlu kamu siapkan datang lebih awal daripada yang diceritakan orang.',
    },
    { kind: 'h3', text: '3. Ada tonjolan kecil di siang hari' },
    {
      kind: 'p',
      text: 'Jam 12 siang (70 tekanan) dan jam 3 sore (69) menonjol dibanding jam-jam di sekitarnya. Itu jam istirahat makan siang dan siang hari yang panjang: sendirian di meja, bosan, ponsel di tangan. Lebih kecil daripada malam hari, tapi nyata.',
    },
    { kind: 'h2', text: 'Kenapa malam hari' },
    {
      kind: 'p',
      text: 'Ini hasil hitungan, bukan eksperimen, jadi tidak bisa membuktikan sebabnya. Tapi malam hari adalah saat beberapa hal datang bersamaan. Kamu lelah setelah seharian membuat keputusan. Kamu sering sendirian, dan tidak akan ada yang tahu. Tidak ada yang bersaing merebut perhatianmu. Dan ponsel, seluruh jalur pengirimannya, sudah ada di tanganmu di atas kasur.',
    },
    {
      kind: 'p',
      text: 'Semua itu bukan cacat karakter. Itu soal susunan keadaan. Dan susunan keadaan bisa diubah, dengan cara yang tidak bisa dilakukan oleh tekad jam 11 malam.',
    },
    { kind: 'h2', text: 'Apa yang bisa kamu lakukan dengan data ini' },
    {
      kind: 'list',
      items: [
        'Sebut jam rawanmu. Rata-rata kami jam 11 malam, tapi jam rawanmu milikmu sendiri. Tuliskan, lalu tuliskan satu hal yang akan kamu lakukan saat jam itu datang.',
        'Isi daya ponsel di luar kamar tidur, dan colokkan sebelum jam 10.30 malam. Jarak antara dorongan dan layar adalah hal termurah yang bisa kamu ubah.',
        'Rencanakan sepuluh menit ke depan, bukan semalaman. Dorongan naik lalu turun. Mandi, jalan ke dapur, kirim pesan ke teman, atau tombol panik, semuanya membeli menit-menit itu.',
        'Atur ulang harimu. Kalau malam hari adalah saat semuanya diputuskan, pindahkan sesuatu yang kamu tunggu-tunggu ke jam itu.',
      ],
    },
    {
      kind: 'p',
      text: 'Satu angka lagi dari 90 hari yang sama. Dalam 526 dari 1.365 sesi itu, orangnya menutup layar panik dengan mengetuk tombol yang menyatakan dorongannya sudah lewat. Itu bukan bukti bahwa tombolnya berhasil, dan kami tidak akan mengklaimnya. Itu catatan 526 kali seseorang datang di saat yang buruk dan pergi dengan mengatakan dirinya sudah tenang.',
    },
    { kind: 'h2', text: 'Kalau kamu ikut No Nut November' },
    {
      kind: 'p',
      text: 'No Nut November mulai 1 November, dan kebanyakan orang merencanakannya sebagai ujian sebulan penuh. Diagram ini bilang: rencanakan sebagai ujian malam hari. Siang hari biasanya beres sendiri. Anggap jam 8 malam sampai jam 1 pagi sebagai tantangan yang sebenarnya, terutama di minggu pertama, sebelum rutinitas baru terbentuk.',
    },
    { kind: 'h2', text: 'Yang tidak bisa diceritakan angka-angka ini' },
    {
      kind: 'list',
      items: [
        'Data ini hanya mencakup orang yang membuka aplikasi pemulihan. Orang yang sama sekali tidak mencari pertolongan tidak ada di sini.',
        'Satu tekanan bukan satu dorongan. Banyak dorongan terjadi tanpa tekanan, dan sebagian orang relapse tanpa pernah membuka aplikasi. Diagram ini menunjukkan kapan orang mencari pertolongan.',
        'Ini pengguna satu aplikasi. Kelompok terbesar ada di Indonesia dan India, dengan banyak lagi di Afrika, Amerika, dan Eropa. Negaramu, jadwalmu, dan usiamu akan menggeser kurvamu sendiri.',
        'Ini bukan studi ilmiah. Ini hitungan, dipublikasikan supaya kamu bisa membuat rencana berdasarkan data ini.',
      ],
    },
    {
      kind: 'faq',
      items: [
        {
          q: 'Jam berapa dorongan PMO paling kuat?',
          a: 'Menurut data kami, malam hari. Dari 1.365 tekanan tombol panik di aplikasi AXIOM, jam tersibuk adalah jam 11 malam, dan lima jam dari jam 8 malam sampai jam 1 pagi menampung 30% dari semua tekanan.',
        },
        {
          q: 'Apakah jam 2 pagi waktu paling rawan?',
          a: 'Tidak menurut data kami. Jam 2 pagi punya 35 tekanan, lebih sedikit daripada hampir semua jam lain. Bagian tersulit malam datang lebih awal, antara jam 8 malam dan jam 1 pagi.',
        },
        {
          q: 'Berapa lama dorongan bertahan?',
          a: 'Berbeda untuk tiap orang, tapi dorongan naik lalu turun, tidak terus membesar. Karena itu rencana untuk sepuluh menit ke depan lebih berhasil daripada rencana untuk semalaman.',
        },
        {
          q: 'Bagaimana data ini dikumpulkan?',
          a: 'Aplikasi AXIOM mencatat jam lokal setiap kali seseorang membuka tombol paniknya. Kami menghitung setiap tekanan dari 24 Juli sampai 21 Oktober 2026, tanpa perangkat kami sendiri dan perangkat uji. Yang dipublikasikan hanya jumlah, tidak pernah apa pun tentang satu orang.',
        },
      ],
    },
    {
      kind: 'links',
      title: 'Baca berikutnya',
      items: [
        { label: 'Kenapa dorongan paling kuat di malam hari, dan apa yang berhasil', href: '/axiom/blog/id/night-urges/' },
        { label: 'Aturan No Nut November 2026: yang boleh dan tidak boleh', href: '/axiom/blog/id/no-nut-november-rules/' },
        { label: 'Flatline: kenapa kamu tidak merasakan apa-apa setelah berhenti PMO', href: '/axiom/blog/id/flatline/' },
      ],
    },
    {
      kind: 'sources',
      items: [{ label: 'Kebijakan privasi AXIOM (bahasa Inggris): apa yang dicatat aplikasi dan apa yang tidak pernah', url: 'https://lunamaze.com/axiom/privacy/' }],
    },
  ],
};

export default article;
