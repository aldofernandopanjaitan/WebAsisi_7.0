/* --- JADWAL UJIAN, JADWAL HARIAN & MATERI PEMBELAJARAN --- */
function renderJadwalUjian() {
    let html = `
        <div class="flex justify-between items-end mb-6">
            <div>
                <h2 class="text-2xl font-bold text-slate-800">BUAT & KELOLA JADWAL UJIAN</h2>
                <p class="text-sm text-slate-500">Semua jadwal, durasi (jam & menit), dan kode ujian yang disimpan/diedit otomatis tampil di akun Siswa.</p>
            </div>
            <button onclick="renderManajemenSoal()" class="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-lg">
                <i class="fas fa-plus mr-1"></i> BUAT SOAL UJIAN CBT
            </button>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
            <form onsubmit="saveJadwalUjian(event)" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="hidden" id="ju-id" value="">
                <div><label class="text-sm font-bold">Tanggal Ujian</label><input type="date" id="ju-tgl" class="w-full p-2 border rounded" required></div>
                <div><label class="text-sm font-bold">Jam Mulai</label><input type="time" step="1" id="ju-jam" class="w-full p-2 border rounded" required></div>
                <div><label class="text-sm font-bold">Mata Ujian</label><select id="ju-mapel" class="w-full p-2 border rounded" required>${genOptions(listMapel)}</select></div>
                
                <div class="bg-red-50 p-3 rounded-lg border border-red-200">
                    <label class="text-xs font-bold text-primary uppercase block mb-1">Durasi Ujian (Jam)</label>
                    <select id="ju-durasi-jam" class="w-full p-2 border rounded bg-white font-bold" required>
                        <option value="0">0 Jam</option>
                        <option value="1" selected>1 Jam</option>
                        <option value="2">2 Jam</option>
                        <option value="3">3 Jam</option>
                        <option value="4">4 Jam</option>
                    </select>
                </div>
                <div class="bg-red-50 p-3 rounded-lg border border-red-200">
                    <label class="text-xs font-bold text-primary uppercase block mb-1">Durasi Tambahan (Menit)</label>
                    <select id="ju-durasi-menit" class="w-full p-2 border rounded bg-white font-bold" required>
                        <option value="0">0 Menit</option>
                        <option value="10">10 Menit</option>
                        <option value="15">15 Menit</option>
                        <option value="20">20 Menit</option>
                        <option value="30" selected>30 Menit</option>
                        <option value="45">45 Menit</option>
                    </select>
                </div>
                <div class="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <label class="text-xs font-bold text-amber-800 uppercase block mb-1">Kode Ujian / Token</label>
                    <input type="text" id="ju-kode" class="w-full p-2 border rounded bg-white font-mono uppercase" placeholder="Contoh: ASSISI-01" required>
                </div>

                <div><label class="text-sm font-bold">Kelas</label><select id="ju-kelas" class="w-full p-2 border rounded" required>${genOptions(listKelas)}</select></div>
                <div><label class="text-sm font-bold">Ruang (1-100)</label><select id="ju-ruang" class="w-full p-2 border rounded" required>${genNumOptions(1,100)}</select></div>
                <div><label class="text-sm font-bold">Sesi (1-100)</label><select id="ju-sesi" class="w-full p-2 border rounded" required>${genNumOptions(1,100)}</select></div>
                <div><label class="text-sm font-bold">Jml Siswa (1-100)</label><select id="ju-siswa" class="w-full p-2 border rounded" required>${genNumOptions(1,100)}</select></div>
                <div><label class="text-sm font-bold">Pengawas</label><select id="ju-pengawas" class="w-full p-2 border rounded" required>${genOptions(listGuru)}</select></div>
                <div class="flex items-end"><button type="submit" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-2.5 rounded shadow"><i class="fas fa-save"></i> SIMPAN & TERBITKAN KE SISWA</button></div>
            </form>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
            <table>
                <thead><tr><th>Tgl/Jam</th><th>Mapel & Kode</th><th>Durasi Waktu</th><th>Kelas</th><th>Ruang/Sesi</th><th>Jml Siswa</th><th>Pengawas</th><th>Aksi</th></tr></thead>
                <tbody>${db.jadwalUjian.map(j => {
                    let jamDur = parseInt(j.durasiJam || 0);
                    let mntDur = parseInt(j.durasiMenit || 60);
                    let totalMenit = (jamDur * 60) + mntDur;
                    return `
                    <tr>
                        <td>${j.tgl}<br><span class="text-xs font-bold text-primary">${j.jam}</span></td>
                        <td>
                            <span class="font-bold">${j.mapel}</span><br>
                            <span class="text-xs font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Kode: ${j.kodeUjian || '-'}</span>
                        </td>
                        <td>
                            <span class="font-bold text-emerald-700">${jamDur} Jam ${mntDur} Menit</span><br>
                            <span class="text-xs text-slate-400">(Total ${totalMenit} Menit)</span>
                        </td>
                        <td>${j.kelas}</td><td>R.${j.ruang} / S.${j.sesi}</td><td>${j.jmlSiswa}</td><td>${j.pengawas}</td>
                        <td class="space-x-1">
                            <button onclick="editJadwalUjian(${j.id})" class="bg-amber-500 hover:bg-amber-600 text-white px-2 py-1 rounded text-xs font-bold">EDIT</button>
                            <button onclick="hapusData('jadwalUjian', ${j.id}, renderJadwalUjian)" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">HAPUS</button>
                        </td>
                    </tr>
                `}).join('') || `<tr><td colspan="8" class="text-center text-slate-400 py-4">Data Jadwal Ujian Kosong</td></tr>`}
                </tbody>
            </table>
        </div>
    `;
    setContent(html);
}

function saveJadwalUjian(e) {
    e.preventDefault();
    let id = document.getElementById('ju-id').value;
    let dJam = parseInt(document.getElementById('ju-durasi-jam').value) || 0;
    let dMenit = parseInt(document.getElementById('ju-durasi-menit').value) || 0;
    if (dJam === 0 && dMenit === 0) {
        alert("Durasi ujian minimal harus lebih dari 0 menit!");
        return;
    }

    let data = {
        id: id ? parseInt(id) : Date.now(),
        tgl: document.getElementById('ju-tgl').value,
        jam: document.getElementById('ju-jam').value,
        mapel: document.getElementById('ju-mapel').value,
        durasiJam: dJam,
        durasiMenit: dMenit,
        kodeUjian: document.getElementById('ju-kode').value.trim().toUpperCase(),
        kelas: document.getElementById('ju-kelas').value,
        ruang: document.getElementById('ju-ruang').value,
        sesi: document.getElementById('ju-sesi').value,
        jmlSiswa: document.getElementById('ju-siswa').value,
        pengawas: document.getElementById('ju-pengawas').value,
        lokasi: "SMK SWASTA ASSISI"
    };
    if (id) db.jadwalUjian = db.jadwalUjian.map(x => x.id == id ? data : x);
    else db.jadwalUjian.push(data);
    saveData();
    renderJadwalUjian();
}

function editJadwalUjian(id) {
    let data = db.jadwalUjian.find(x => x.id === id);
    if (!data) return;
    document.getElementById('ju-id').value = data.id;
    document.getElementById('ju-tgl').value = data.tgl;
    document.getElementById('ju-jam').value = data.jam;
    document.getElementById('ju-mapel').value = data.mapel;
    document.getElementById('ju-durasi-jam').value = data.durasiJam !== undefined ? data.durasiJam : 1;
    document.getElementById('ju-durasi-menit').value = data.durasiMenit !== undefined ? data.durasiMenit : 0;
    document.getElementById('ju-kode').value = data.kodeUjian || '';
    document.getElementById('ju-kelas').value = data.kelas;
    document.getElementById('ju-ruang').value = data.ruang;
    document.getElementById('ju-sesi').value = data.sesi;
    document.getElementById('ju-siswa').value = data.jmlSiswa;
    document.getElementById('ju-pengawas').value = data.pengawas;
}

function renderJadwalHarian() {
    let html = `
        <h2 class="text-2xl font-bold text-slate-800 mb-6">Manajemen Jadwal Les Harian (1-10)</h2>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
            <form onsubmit="saveJadwalHarian(event)" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="hidden" id="jh-id" value="">
                <div><label class="text-sm font-bold">Tanggal</label><input type="date" id="jh-tgl" class="w-full p-2 border rounded" required></div>
                <div><label class="text-sm font-bold">Jam Les (Misal 08:00:00)</label><input type="time" step="1" id="jh-jam" class="w-full p-2 border rounded" required></div>
                <div><label class="text-sm font-bold">Mata Pelajaran</label><select id="jh-mapel" class="w-full p-2 border rounded" required>${genOptions(listMapel)}</select></div>
                <div><label class="text-sm font-bold">Kelas</label><select id="jh-kelas" class="w-full p-2 border rounded" required>${genOptions(listKelas)}</select></div>
                <div><label class="text-sm font-bold">Jml Siswa</label><select id="jh-siswa" class="w-full p-2 border rounded" required>${genNumOptions(1,100)}</select></div>
                <div><label class="text-sm font-bold">Pengajar</label><select id="jh-pengajar" class="w-full p-2 border rounded" required>${genOptions(listGuru)}</select></div>
                <div class="col-span-1 md:col-span-3 flex justify-end"><button type="submit" class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded"><i class="fas fa-save"></i> SIMPAN JADWAL</button></div>
            </form>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table>
                <thead><tr><th>Tgl/Jam</th><th>Mapel</th><th>Kelas</th><th>Jml Siswa</th><th>Pengajar</th><th>Aksi</th></tr></thead>
                <tbody>${db.jadwalHarian.map(j => `
                    <tr>
                        <td>${j.tgl}<br><span class="text-xs font-bold text-primary">${j.jam}</span></td>
                        <td>${j.mapel}</td><td>${j.kelas}</td><td>${j.jmlSiswa}</td><td>${j.pengajar}</td>
                        <td class="space-x-1">
                            <button onclick="editJadwalHarian(${j.id})" class="bg-amber-500 text-white px-2 py-1 rounded text-xs">EDIT</button>
                            <button onclick="hapusData('jadwalHarian', ${j.id}, renderJadwalHarian)" class="bg-red-500 text-white px-2 py-1 rounded text-xs">HAPUS</button>
                        </td>
                    </tr>
                `).join('') || `<tr><td colspan="6" class="text-center text-slate-400 py-4">Data Kosong</td></tr>`}
                </tbody>
            </table>
        </div>
    `;
    setContent(html);
}

function saveJadwalHarian(e) {
    e.preventDefault();
    let id = document.getElementById('jh-id').value;
    let data = {
        id: id ? parseInt(id) : Date.now(),
        tgl: document.getElementById('jh-tgl').value,
        jam: document.getElementById('jh-jam').value,
        mapel: document.getElementById('jh-mapel').value,
        kelas: document.getElementById('jh-kelas').value,
        jmlSiswa: document.getElementById('jh-siswa').value,
        pengajar: document.getElementById('jh-pengajar').value,
        lokasi: "SMK SWASTA ASSISI"
    };
    if (id) db.jadwalHarian = db.jadwalHarian.map(x => x.id == id ? data : x);
    else db.jadwalHarian.push(data);
    saveData();
    renderJadwalHarian();
}

function editJadwalHarian(id) {
    let data = db.jadwalHarian.find(x => x.id === id);
    if (!data) return;
    document.getElementById('jh-id').value = data.id;
    document.getElementById('jh-tgl').value = data.tgl;
    document.getElementById('jh-jam').value = data.jam;
    document.getElementById('jh-mapel').value = data.mapel;
    document.getElementById('jh-kelas').value = data.kelas;
    document.getElementById('jh-siswa').value = data.jmlSiswa;
    document.getElementById('jh-pengajar').value = data.pengajar;
}

function renderJadwalSiswa() {
    let html = `
        <h2 class="text-2xl font-bold text-slate-800 mb-2">Jadwal Akademik Saya</h2>
        <p class="text-sm text-slate-500 mb-6">Data jadwal di bawah ini diperbarui secara otomatis oleh Admin dan Guru.</p>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div class="bg-primary text-white px-5 py-3 font-bold flex items-center gap-2">
                <i class="fas fa-file-signature"></i> JADWAL UJIAN RESMI
            </div>
            <div class="overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            <th>Tanggal & Jam</th>
                            <th>Mata Ujian</th>
                            <th>Durasi Ujian</th>
                            <th>Kelas & Ruang</th>
                            <th>Sesi</th>
                            <th>Pengawas</th>
                            <th>Kode Ujian</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${db.jadwalUjian.map(j => `
                            <tr>
                                <td><strong>${j.tgl}</strong><br><span class="text-xs font-bold text-primary">${j.jam} WIB</span></td>
                                <td class="font-bold text-slate-800">${j.mapel}</td>
                                <td><span class="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-bold">${j.durasiJam || 0} Jam ${j.durasiMenit || 0} Menit</span></td>
                                <td>${j.kelas} — Ruang ${j.ruang}</td>
                                <td>Sesi ${j.sesi}</td>
                                <td>${j.pengawas}</td>
                                <td><span class="font-mono font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">${j.kodeUjian || 'UMUM'}</span></td>
                            </tr>
                        `).join('') || `<tr><td colspan="7" class="text-center text-slate-400 py-6">Belum ada jadwal ujian yang diterbitkan oleh Admin/Guru.</td></tr>`}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="bg-slate-800 text-white px-5 py-3 font-bold flex items-center gap-2">
                <i class="fas fa-calendar-day"></i> JADWAL PELAJARAN / LES HARIAN
            </div>
            <div class="overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            <th>Tanggal & Jam</th>
                            <th>Mata Pelajaran</th>
                            <th>Kelas</th>
                            <th>Guru Pengajar</th>
                            <th>Lokasi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${db.jadwalHarian.map(j => `
                            <tr>
                                <td><strong>${j.tgl}</strong><br><span class="text-xs font-bold text-blue-600">${j.jam} WIB</span></td>
                                <td class="font-bold">${j.mapel}</td>
                                <td>${j.kelas}</td>
                                <td>${j.pengajar}</td>
                                <td>${j.lokasi || 'SMK SWASTA ASSISI'}</td>
                            </tr>
                        `).join('') || `<tr><td colspan="5" class="text-center text-slate-400 py-6">Belum ada jadwal harian yang diterbitkan.</td></tr>`}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    setContent(html);
}

function renderMateri() {
    let html = `
        <h2 class="text-2xl font-bold text-slate-800 mb-6">Manajemen Materi Pelajaran</h2>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
            <form onsubmit="saveMateri(event)" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="hidden" id="mat-id" value="">
                <div><label class="text-sm font-bold">Tanggal</label><input type="date" id="mat-tgl" class="w-full p-2 border rounded" required></div>
                <div><label class="text-sm font-bold">Judul Materi</label><input type="text" id="mat-judul" class="w-full p-2 border rounded" required></div>
                <div><label class="text-sm font-bold">Mata Pelajaran</label><select id="mat-mapel" class="w-full p-2 border rounded" required>${genOptions(listMapel)}</select></div>
                <div><label class="text-sm font-bold">Kategori Kelas</label><select id="mat-kelas" class="w-full p-2 border rounded" required>${genOptions(listKelas)}</select></div>
                <div><label class="text-sm font-bold">Nama Guru</label><select id="mat-guru" class="w-full p-2 border rounded" required>${genOptions(listGuru)}</select></div>
                <div>
                    <label class="text-sm font-bold">Unggah File (Word/Excel/PPT/Gambar/Video)</label>
                    <input type="file" id="mat-file" class="w-full p-2 border rounded text-sm">
                </div>
                <div class="col-span-1 md:col-span-2 flex justify-end">
                    <button type="submit" class="bg-emerald-500 text-white font-bold py-2 px-6 rounded">SIMPAN MATERI</button>
                </div>
            </form>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table>
                <thead><tr><th>Tgl</th><th>Judul</th><th>Mapel / Kelas</th><th>File Data</th><th>Guru</th><th>Aksi</th></tr></thead>
                <tbody>${db.materi.map(m => `
                    <tr>
                        <td>${m.tgl}</td><td class="font-bold text-primary">${m.judul}</td><td>${m.mapel}<br><span class="text-xs">${m.kelas}</span></td>
                        <td><span class="bg-slate-100 px-2 py-1 rounded text-xs border"><i class="fas fa-file"></i> ${m.fileName}</span></td>
                        <td>${m.guru}</td>
                        <td class="space-x-1">
                            <button onclick="editMateri(${m.id})" class="bg-amber-500 text-white px-2 py-1 rounded text-xs">EDIT</button>
                            <button onclick="hapusData('materi', ${m.id}, renderMateri)" class="bg-red-500 text-white px-2 py-1 rounded text-xs">HAPUS</button>
                        </td>
                    </tr>
                `).join('') || `<tr><td colspan="6" class="text-center py-4">Belum ada materi</td></tr>`}
                </tbody>
            </table>
        </div>
    `;
    setContent(html);
}

function saveMateri(e) {
    e.preventDefault();
    let id = document.getElementById('mat-id').value;
    let fileInput = document.getElementById('mat-file');
    let existing = id ? db.materi.find(x => x.id == id) : null;
    let fileName = (fileInput.files && fileInput.files[0]) ? fileInput.files[0].name : (existing ? existing.fileName : "Document.pdf");

    let data = {
        id: id ? parseInt(id) : Date.now(),
        tgl: document.getElementById('mat-tgl').value,
        judul: document.getElementById('mat-judul').value,
        mapel: document.getElementById('mat-mapel').value,
        kelas: document.getElementById('mat-kelas').value,
        guru: document.getElementById('mat-guru').value,
        fileName: fileName
    };
    if (id) db.materi = db.materi.map(x => x.id == id ? data : x);
    else db.materi.push(data);
    saveData();
    renderMateri();
}

function editMateri(id) {
    let m = db.materi.find(x => x.id === id);
    if (!m) return;
    document.getElementById('mat-id').value = m.id;
    document.getElementById('mat-tgl').value = m.tgl;
    document.getElementById('mat-judul').value = m.judul;
    document.getElementById('mat-mapel').value = m.mapel;
    document.getElementById('mat-kelas').value = m.kelas;
    document.getElementById('mat-guru').value = m.guru;
}

function renderMateriSiswa() {
    let html = `
        <h2 class="text-2xl font-bold text-slate-800 mb-2">Materi Pembelajaran Saya</h2>
        <p class="text-sm text-slate-500 mb-6">Semua modul dan materi di bawah ini diunggah/diedit oleh Guru & Admin.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${db.materi.map(m => `
                <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition">
                    <div class="text-xs text-slate-400 mb-2">${m.tgl}</div>
                    <h3 class="font-bold text-lg text-primary mb-1">${m.judul}</h3>
                    <p class="text-sm font-semibold text-slate-600">${m.mapel} - ${m.kelas}</p>
                    <p class="text-xs text-slate-500 mt-2"><i class="fas fa-chalkboard-teacher"></i> ${m.guru}</p>
                    <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                        <span class="text-xs truncate max-w-[150px] text-blue-500"><i class="fas fa-file"></i> ${m.fileName}</span>
                        <button class="bg-slate-800 text-white px-3 py-1 rounded text-xs" onclick="alert('Mengunduh file: ${m.fileName}')">UNDUH</button>
                    </div>
                </div>
            `).join('') || `<p class="text-slate-500 col-span-3">Belum ada materi yang dibagikan guru.</p>`}
        </div>
    `;
    setContent(html);
}
