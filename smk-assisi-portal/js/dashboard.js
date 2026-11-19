/* --- BERANDA / DASHBOARD UTAMA --- */
function renderDashboard() {
    const isSiswa = currentUser.role === 'Siswa';
    const isGuru = currentUser.role === 'Guru';
    const myPresensiCount = db.presensi.filter(p => p.nama.toLowerCase() === currentUser.name.toLowerCase()).length;

    setContent(`
        <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap justify-between items-center gap-4">
            <div>
                <h2 class="text-3xl font-bold text-slate-800 mb-2">Selamat Datang, ${currentUser.name}!</h2>
                <p class="text-slate-500">Anda login sebagai <span class="font-bold text-primary">${currentUser.role}</span> di Sistem Akademik SMK Swasta Assisi.</p>
            </div>
            <div class="bg-slate-900 text-white px-5 py-3 rounded-xl text-right">
                <span class="text-[11px] uppercase tracking-wider text-slate-400 block">Waktu Server Saat Ini</span>
                <span id="dashboard-live-clock" class="text-xl font-mono font-bold text-emerald-400">--:--:-- WIB</span>
            </div>
        </div>

        ${(isSiswa || isGuru) ? `
        <div class="bg-gradient-to-r from-primary to-red-700 text-white p-6 rounded-xl shadow-md mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
                <span class="text-xs uppercase font-bold bg-white/20 px-2.5 py-1 rounded">Presensi Digital & Kamera Bukti</span>
                <h3 class="text-xl font-bold mt-2">Scan QR Kehadiran ${currentUser.role} (Sehari-Hari & Ujian)</h3>
                <p class="text-sm text-red-100 mt-1">Lakukan scan QR kehadiran beserta pengambilan bukti foto kehadiran secara langsung.</p>
            </div>
            <button onclick="renderPresensiScanForm('${currentUser.role}')" class="bg-white text-primary hover:bg-slate-100 font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2">
                <i class="fas fa-qrcode text-lg"></i> BUKA SCANNER QR & FOTO BUKTI
            </button>
        </div>
        ` : ''}

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p class="text-xs font-bold text-slate-400 uppercase">Jadwal Ujian Aktif</p>
                <p class="text-3xl font-bold text-primary mt-1">${db.jadwalUjian.length}</p>
                <p class="text-xs text-slate-500 mt-1">Ditetapkan Admin/Guru</p>
            </div>
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p class="text-xs font-bold text-slate-400 uppercase">${isSiswa ? 'Nilai Tugas Saya' : 'Total Nilai Tugas'}</p>
                <p class="text-3xl font-bold text-blue-600 mt-1">${isSiswa ? db.nilaiTugas.filter(t => t.namaSiswa.toLowerCase() === currentUser.name.toLowerCase()).length : db.nilaiTugas.length}</p>
                <p class="text-xs text-slate-500 mt-1">Tersinkronisasi otomatis</p>
            </div>
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p class="text-xs font-bold text-slate-400 uppercase">${isSiswa ? 'Catatan Untuk Saya' : 'Total Catatan Siswa'}</p>
                <p class="text-3xl font-bold text-emerald-600 mt-1">${isSiswa ? db.catatanSiswa.filter(c => c.namaSiswa.toLowerCase() === currentUser.name.toLowerCase() || c.namaSiswa.toLowerCase() === 'semua siswa').length : db.catatanSiswa.length}</p>
                <p class="text-xs text-slate-500 mt-1">Catatan perkembangan & evaluasi</p>
            </div>
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p class="text-xs font-bold text-slate-400 uppercase">${isSiswa || isGuru ? 'Presensi & Foto Saya' : 'Total Rekap Presensi'}</p>
                <p class="text-3xl font-bold text-amber-500 mt-1">${isSiswa || isGuru ? myPresensiCount : db.presensi.length}</p>
                <p class="text-xs text-slate-500 mt-1">Harian & Ujian dengan bukti foto</p>
            </div>
        </div>
    `);
}
