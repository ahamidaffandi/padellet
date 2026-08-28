# IKA FH USAKTI Padel Tournament 2026 — Bracket Manager (Netlify)

4 file saja, semuanya sejajar di satu folder (tidak ada subfolder lagi):

- `index.html` — halaman utama (jadwal, fase grup, bagan).
- `state.mjs` — Netlify Function, backend penyimpan skor (pakai Netlify Blobs, otomatis
  tersedia di Netlify, tidak perlu setup database apa pun).
- `netlify.toml` — konfigurasi build.
- `package.json` — dependency untuk `state.mjs`.

Tidak ada PIN. Tombol **"Mode Admin"** di kanan atas cuma toggle biasa — siapa pun yang
klik langsung bisa input skor, dan skornya kesimpan untuk semua orang yang buka link yang
sama (auto-refresh tiap ~20 detik). Tombol **"Mode Player"** balikin ke tampilan read-only.

## Cara deploy (GitHub import — paling gampang)

1. Bikin repo GitHub baru (boleh kosong).
2. Klik **Add file → Upload files**, drag ke-4 file di atas (boleh pilih satu-satu lewat
   dialog, tidak perlu drag folder — semuanya memang sudah rata di satu level). Commit.
3. Di Netlify: **Add new site → Import an existing project → Deploy with GitHub**, pilih
   repo itu. Biarkan **Build command** kosong, **Publish directory** akan otomatis kebaca
   dari `netlify.toml`. Klik Deploy.
4. Selesai — tidak perlu set environment variable apa pun.

## Cara cek Function-nya sudah aktif

Buka `https://<nama-site>.netlify.app/.netlify/functions/state` langsung di browser:
- Muncul teks JSON kayak `{"groupScores":{...},"koScores":{}}` → sudah aktif, beres.
- Muncul halaman 404 → Function belum ke-deploy, coba **Trigger deploy** ulang di tab
  Deploys, atau cek file `state.mjs` benar-benar ada di repo (bukan ke-skip pas upload).

## Kalau backend belum aktif

Selama Function belum aktif, tombol simpan skor tetap jalan tapi cuma tersimpan di
browser yang lagi dipakai (tidak sinkron ke perangkat lain) — ada notifikasi kuning kalau
ini terjadi, supaya kelihatan bedanya.

## Catatan

- Jadwal/roster turnamen sudah "dibakar" ke dalam `index.html` saat file ini dibuat. Kalau
  ada perubahan pairing atau jadwal court lagi, minta Claude generate ulang file ini (bukan
  edit HTML manual).
