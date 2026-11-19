/* --- AUTENTIKASI LOGIN, LOGOUT & MENU SIDEBAR --- */
function prosesLogin() {
    let role = document.getElementById('login-role').value;
    let name = document.getElementById('login-username').value.trim();
    if (!name) {
        alert('Nama pengguna wajib diisi!');
        return;
    }

    currentUser = { role, name };
    document.getElementById('view-login').classList.add('hidden-section');
    document.getElementById('sidebar').classList.remove('hidden-section');
    document.getElementById('main-content').classList.remove('hidden-section');

    document.getElementById('badge-role').innerText = role;
    document.getElementById('display-name').innerText = name;

    startLiveClock();
    renderMenu();
    renderDashboard();
}

function prosesLogout() {
    if (isExamActive) {
        picuAntiCheat("Sistem menolak logout. Anda masih dalam sesi ujian aktif!");
        return;
    }
    stopMediaResources();
    location.reload();
}

function renderMenu() {
    const menu = document.getElementById('nav-menu');
    let html = `<button onclick="renderDashboard()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary transition-colors"><i class="fas fa-home w-5"></i> Beranda</button>`;

    if (currentUser.role === 'Admin') {
        html += `
            <button onclick="renderJadwalUjian()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-calendar-check w-5"></i> Buat & Jadwal Ujian</button>
            <button onclick="renderJadwalHarian()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-calendar-alt w-5"></i> Jadwal Harian</button>
            <button onclick="renderGeneratorQR()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-qrcode w-5"></i> Buat Kode QR Presensi</button>
            <button onclick="renderPresensi()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-camera-retro w-5"></i> Rekap Presensi & Foto</button>
            <button onclick="renderMateri()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-book w-5"></i> Manajemen Materi</button>
            <button onclick="renderManajemenSoal()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-file-alt w-5"></i> Buat Soal Ujian CBT</button>
            <button onclick="renderUploadNilaiTugas()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-upload w-5"></i> Upload Nilai Tugas</button>
            <button onclick="renderUploadCatatanSiswa()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-sticky-note w-5"></i> Upload Catatan Siswa</button>
            <button onclick="renderLaporan()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-chart-bar w-5"></i> Laporan Nilai Ujian</button>
        `;
    } else if (currentUser.role === 'Guru') {
        html += `
            <button onclick="renderPresensiScanForm('Guru')" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold rounded-lg bg-red-50 text-primary hover:bg-red-100 transition-colors"><i class="fas fa-qrcode w-5"></i> Scan QR & Bukti Foto Guru</button>
            <button onclick="renderJadwalUjian()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-calendar-check w-5"></i> Buat Jadwal Ujian</button>
            <button onclick="renderManajemenSoal()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-file-alt w-5"></i> Buat Soal Ujian CBT</button>
            <button onclick="renderJadwalHarian()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-calendar-alt w-5"></i> Jadwal Harian</button>
            <button onclick="renderGeneratorQR()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-qrcode w-5"></i> Buat QR Absen Siswa</button>
            <button onclick="renderPresensi()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-camera-retro w-5"></i> Rekap Kehadiran & Foto</button>
            <button onclick="renderUploadNilaiTugas()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-upload w-5"></i> Upload Nilai Tugas</button>
            <button onclick="renderUploadCatatanSiswa()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-sticky-note w-5"></i> Upload Catatan Siswa</button>
            <button onclick="renderMateri()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-book w-5"></i> Manajemen Materi</button>
            <button onclick="renderLaporan()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-chart-bar w-5"></i> Laporan Nilai Ujian</button>
        `;
    } else if (currentUser.role === 'Siswa') {
        html += `
            <button onclick="renderPresensiScanForm('Siswa')" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold rounded-lg bg-red-50 text-primary hover:bg-red-100 transition-colors"><i class="fas fa-qrcode w-5"></i> Scan QR & Bukti Foto</button>
            <button onclick="renderJadwalSiswa()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-calendar w-5"></i> Jadwal Saya</button>
            <button onclick="renderUjianSiswa()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-laptop-code w-5"></i> Portal Ujian</button>
            <button onclick="renderNilaiTugasSiswa()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-tasks w-5"></i> Nilai Tugas Saya</button>
            <button onclick="renderCatatanSiswaView()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-clipboard-list w-5"></i> Catatan Guru Untuk Saya</button>
            <button onclick="renderMateriSiswa()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-book w-5"></i> Materi Pembelajaran</button>
            <button onclick="renderNilaiSiswa()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-50 hover:text-primary"><i class="fas fa-award w-5"></i> Hasil & Nilai Ujian</button>
        `;
    }
    menu.innerHTML = html;
}
