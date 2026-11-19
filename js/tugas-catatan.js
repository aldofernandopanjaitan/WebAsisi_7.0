/* --- UPLOAD & TAMPILAN NILAI TUGAS + CATATAN SISWA --- */
function renderUploadNilaiTugas() {
    let html = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-slate-800">Upload Nilai Tugas Untuk Siswa</h2>
            <p class="text-sm text-slate-500">Input nilai tugas harian/praktikum siswa beserta file lampiran penilaian jika ada. Nilai otomatis tampil di akun Siswa.</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
            <form onsubmit="saveNilaiTugas(event)" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="hidden" id="nt-id" value="">
                <div>
                    <label class="block text-sm font-bold mb-1">Tanggal Penilaian</label>
                    <input type="date" id="nt-tgl" value="${new Date().toISOString().split('T')[0]}" class="w-full p-2.5 border rounded-lg" required>
                </div>
                <div>
                    <label class="block text-sm font-bold mb-1">Nama Siswa</label>
                    <input type="text" id="nt-nama-siswa" class="w-full p-2.5 border rounded-lg" placeholder="Masukkan Nama Lengkap Siswa" required>
                </div>
                <div>
                    <label class="block text-sm font-bold mb-1">Kelas</label>
                    <select id="nt-kelas" class="w-full p-2.5 border rounded-lg" required>${genOptions(listKelas)}</select>
                </div>
                <div>
                    <label class="block text-sm font-bold mb-1">Mata Pelajaran</label>
                    <select id="nt-mapel" class="w-full p-2.5 border rounded-lg" required>${genOptions(listMapel)}</select>
                </div>
                <div>
                    <label class="block text-sm font-bold mb-1">Judul Tugas</label>
                    <input type="text" id="nt-judul" class="w-full p-2.5 border rounded-lg" placeholder="Contoh: Tugas 1 - Basis Data" required>
                </div>
                <div>
                    <label class="block text-sm font-bold mb-1">Skor / Nilai Tugas (0 - 100)</label>
                    <input type="number" id="nt-nilai" min="0" max="100" class="w-full p-2.5 border rounded-lg font-bold text-primary" placeholder="0 - 100" required>
                </div>
                <div class="md:col-span-2">
                    <label class="block text-sm font-bold mb-1">Keterangan / Komentar Guru</label>
                    <input type="text" id="nt-ket" class="w-full p-2.5 border rounded-lg" placeholder="Contoh: Sangat baik, tepat waktu">
                </div>
                <div>
                    <label class="block text-sm font-bold mb-1">Lampiran File Tugas/Rubrik (Opsional)</label>
                    <input type="file" id="nt-file" class="w-full p-2 border rounded-lg text-xs">
                </div>
                <div class="md:col-span-3 flex justify-end">
                    <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-lg shadow">
                        <i class="fas fa-upload mr-2"></i> UPLOAD & SIMPAN NILAI TUGAS
                    </button>
                </div>
            </form>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
            <table>
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Nama Siswa</th>
                        <th>Kelas</th>
                        <th>Mata Pelajaran</th>
                        <th>Judul Tugas</th>
                        <th>Nilai</th>
                        <th>Keterangan & File</th>
                        <th>Guru</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    ${db.nilaiTugas.slice().reverse().map(t => `
                        <tr>
                            <td>${t.tgl}</td>
                            <td class="font-bold text-slate-800">${t.namaSiswa}</td>
                            <td>${t.kelas}</td>
                            <td>${t.mapel}</td>
                            <td class="font-semibold text-blue-700">${t.judul}</td>
                            <td><span class="text-lg font-black ${t.nilai >= 75 ? 'text-emerald-600' : 'text-red-600'}">${t.nilai}</span></td>
                            <td>
                                <span class="text-xs block text-slate-600">${t.keterangan || '-'}</span>
                                ${t.fileName ? `<span class="text-[11px] text-blue-600 font-semibold"><i class="fas fa-paperclip"></i> ${t.fileName}</span>` : ''}
                            </td>
                            <td class="text-xs">${t.guru}</td>
                            <td class="space-x-1">
                                <button onclick="editNilaiTugas(${t.id})" class="bg-amber-500 text-white px-2 py-1 rounded text-xs font-bold">EDIT</button>
                                <button onclick="hapusData('nilaiTugas', ${t.id}, renderUploadNilaiTugas)" class="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">HAPUS</button>
                            </td>
                        </tr>
                    `).join('') || `<tr><td colspan="9" class="text-center text-slate-400 py-6">Belum ada nilai tugas yang diupload.</td></tr>`}
                </tbody>
            </table>
        </div>
    `;
    setContent(html);
}

function saveNilaiTugas(e) {
    e.preventDefault();
    const id = document.getElementById('nt-id').value;
    const fileInput = document.getElementById('nt-file');
    const existing = id ? db.nilaiTugas.find(x => x.id == id) : null;
    const fileName = (fileInput.files && fileInput.files[0]) ? fileInput.files[0].name : (existing ? existing.fileName : '');

    const data = {
        id: id ? parseInt(id) : Date.now(),
        tgl: document.getElementById('nt-tgl').value,
        namaSiswa: document.getElementById('nt-nama-siswa').value.trim(),
        kelas: document.getElementById('nt-kelas').value,
        mapel: document.getElementById('nt-mapel').value,
        judul: document.getElementById('nt-judul').value.trim(),
        nilai: parseInt(document.getElementById('nt-nilai').value),
        keterangan: document.getElementById('nt-ket').value.trim(),
        fileName: fileName,
        guru: currentUser.name
    };

    if (id) db.nilaiTugas = db.nilaiTugas.map(x => x.id == id ? data : x);
    else db.nilaiTugas.push(data);
    saveData();
    alert("Nilai tugas siswa berhasil diupload!");
    renderUploadNilaiTugas();
}

function editNilaiTugas(id) {
    const t = db.nilaiTugas.find(x => x.id === id);
    if (!t) return;
    document.getElementById('nt-id').value = t.id;
    document.getElementById('nt-tgl').value = t.tgl;
    document.getElementById('nt-nama-siswa').value = t.namaSiswa;
    document.getElementById('nt-kelas').value = t.kelas;
    document.getElementById('nt-mapel').value = t.mapel;
    document.getElementById('nt-judul').value = t.judul;
    document.getElementById('nt-nilai').value = t.nilai;
    document.getElementById('nt-ket').value = t.keterangan || '';
}

function renderNilaiTugasSiswa() {
    const myTasks = db.nilaiTugas.filter(t =>
        t.namaSiswa.toLowerCase() === currentUser.name.toLowerCase() ||
        t.namaSiswa.toLowerCase() === 'semua siswa'
    );
    let html = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-slate-800">Daftar Nilai Tugas Saya</h2>
            <p class="text-sm text-slate-500">Nilai tugas yang telah diupload oleh Guru mata pelajaran.</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
            <table>
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Mata Pelajaran</th>
                        <th>Judul Tugas</th>
                        <th>Nilai</th>
                        <th>Catatan / Lampiran Guru</th>
                        <th>Guru Penilai</th>
                    </tr>
                </thead>
                <tbody>
                    ${myTasks.slice().reverse().map(t => `
                        <tr>
                            <td>${t.tgl}</td>
                            <td class="font-bold">${t.mapel}</td>
                            <td class="text-blue-700 font-semibold">${t.judul}</td>
                            <td><span class="text-xl font-black ${t.nilai >= 75 ? 'text-emerald-600' : 'text-red-600'}">${t.nilai}</span></td>
                            <td>
                                <span class="text-sm block">${t.keterangan || '-'}</span>
                                ${t.fileName ? `<button onclick="alert('Mengunduh lampiran: ${t.fileName}')" class="mt-1 text-xs bg-slate-100 border px-2 py-0.5 rounded text-blue-600 font-semibold"><i class="fas fa-download"></i> ${t.fileName}</button>` : ''}
                            </td>
                            <td class="text-xs font-semibold">${t.guru}</td>
                        </tr>
                    `).join('') || `<tr><td colspan="6" class="text-center text-slate-400 py-8">Belum ada nilai tugas yang diupload untuk akun Anda (${currentUser.name}).</td></tr>`}
                </tbody>
            </table>
        </div>
    `;
    setContent(html);
}

function renderUploadCatatanSiswa() {
    let html = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-slate-800">Upload Catatan Untuk Siswa</h2>
            <p class="text-sm text-slate-500">Kirim catatan pembelajaran, rangkuman materi, bimbingan akademik, atau file catatan untuk siswa tertentu maupun seluruh kelas.</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
            <form onsubmit="saveCatatanSiswa(event)" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="hidden" id="cat-id" value="">
                <div>
                    <label class="block text-sm font-bold mb-1">Tanggal</label>
                    <input type="date" id="cat-tgl" value="${new Date().toISOString().split('T')[0]}" class="w-full p-2.5 border rounded-lg" required>
                </div>
                <div>
                    <label class="block text-sm font-bold mb-1">Nama Siswa Penerima</label>
                    <input type="text" id="cat-nama-siswa" class="w-full p-2.5 border rounded-lg" placeholder="Ketik Nama Siswa atau 'Semua Siswa'" required>
                </div>
                <div>
                    <label class="block text-sm font-bold mb-1">Kelas</label>
                    <select id="cat-kelas" class="w-full p-2.5 border rounded-lg" required>${genOptions(listKelas)}</select>
                </div>
                <div>
                    <label class="block text-sm font-bold mb-1">Mata Pelajaran</label>
                    <select id="cat-mapel" class="w-full p-2.5 border rounded-lg" required>${genOptions(listMapel)}</select>
                </div>
                <div>
                    <label class="block text-sm font-bold mb-1">Judul Catatan</label>
                    <input type="text" id="cat-judul" class="w-full p-2.5 border rounded-lg" placeholder="Contoh: Rangkuman Bab 2 / Catatan Bimbingan" required>
                </div>
                <div>
                    <label class="block text-sm font-bold mb-1">Upload File Catatan (PDF/Word/Gambar)</label>
                    <input type="file" id="cat-file" class="w-full p-2 border rounded-lg text-xs">
                </div>
                <div class="md:col-span-3">
                    <label class="block text-sm font-bold mb-1">Isi Catatan Untuk Siswa</label>
                    <textarea id="cat-isi" rows="3" class="w-full p-2.5 border rounded-lg" placeholder="Tuliskan catatan materi, instruksi tugas, atau pesan evaluasi untuk siswa..." required></textarea>
                </div>
                <div class="md:col-span-3 flex justify-end">
                    <button type="submit" class="bg-primary hover:bg-primaryDark text-white font-bold py-2.5 px-6 rounded-lg shadow">
                        <i class="fas fa-paper-plane mr-2"></i> UPLOAD & KIRIM CATATAN KE SISWA
                    </button>
                </div>
            </form>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
            <table>
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Penerima (Siswa / Kelas)</th>
                        <th>Mapel & Judul</th>
                        <th>Isi Catatan</th>
                        <th>File Lampiran</th>
                        <th>Pengirim</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    ${db.catatanSiswa.slice().reverse().map(c => `
                        <tr>
                            <td>${c.tgl}</td>
                            <td><strong>${c.namaSiswa}</strong><br><span class="text-xs text-slate-500">${c.kelas}</span></td>
                            <td><span class="text-xs font-bold text-primary block">${c.mapel}</span><strong>${c.judul}</strong></td>
                            <td class="max-w-xs text-xs text-slate-600">${c.isi}</td>
                            <td>${c.fileName ? `<span class="bg-slate-100 px-2 py-1 rounded text-xs border"><i class="fas fa-file-alt"></i> ${c.fileName}</span>` : '-'}</td>
                            <td class="text-xs font-semibold">${c.guru}</td>
                            <td class="space-x-1">
                                <button onclick="editCatatanSiswa(${c.id})" class="bg-amber-500 text-white px-2 py-1 rounded text-xs font-bold">EDIT</button>
                                <button onclick="hapusData('catatanSiswa', ${c.id}, renderUploadCatatanSiswa)" class="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">HAPUS</button>
                            </td>
                        </tr>
                    `).join('') || `<tr><td colspan="7" class="text-center text-slate-400 py-6">Belum ada catatan untuk siswa yang diupload.</td></tr>`}
                </tbody>
            </table>
        </div>
    `;
    setContent(html);
}

function saveCatatanSiswa(e) {
    e.preventDefault();
    const id = document.getElementById('cat-id').value;
    const fileInput = document.getElementById('cat-file');
    const existing = id ? db.catatanSiswa.find(x => x.id == id) : null;
    const fileName = (fileInput.files && fileInput.files[0]) ? fileInput.files[0].name : (existing ? existing.fileName : '');

    const data = {
        id: id ? parseInt(id) : Date.now(),
        tgl: document.getElementById('cat-tgl').value,
        namaSiswa: document.getElementById('cat-nama-siswa').value.trim(),
        kelas: document.getElementById('cat-kelas').value,
        mapel: document.getElementById('cat-mapel').value,
        judul: document.getElementById('cat-judul').value.trim(),
        isi: document.getElementById('cat-isi').value.trim(),
        fileName: fileName,
        guru: currentUser.name
    };

    if (id) db.catatanSiswa = db.catatanSiswa.map(x => x.id == id ? data : x);
    else db.catatanSiswa.push(data);
    saveData();
    alert("Catatan untuk siswa berhasil diupload!");
    renderUploadCatatanSiswa();
}

function editCatatanSiswa(id) {
    const c = db.catatanSiswa.find(x => x.id === id);
    if (!c) return;
    document.getElementById('cat-id').value = c.id;
    document.getElementById('cat-tgl').value = c.tgl;
    document.getElementById('cat-nama-siswa').value = c.namaSiswa;
    document.getElementById('cat-kelas').value = c.kelas;
    document.getElementById('cat-mapel').value = c.mapel;
    document.getElementById('cat-judul').value = c.judul;
    document.getElementById('cat-isi').value = c.isi;
}

function renderCatatanSiswaView() {
    const myNotes = db.catatanSiswa.filter(c =>
        c.namaSiswa.toLowerCase() === currentUser.name.toLowerCase() ||
        c.namaSiswa.toLowerCase() === 'semua siswa'
    );
    let html = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-slate-800">Catatan Guru Untuk Saya</h2>
            <p class="text-sm text-slate-500">Catatan pelajaran, rangkuman, dan bimbingan yang diupload oleh Guru.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${myNotes.slice().reverse().map(c => `
                <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-center text-xs text-slate-400 mb-2">
                            <span class="bg-red-50 text-primary font-bold px-2 py-0.5 rounded">${c.mapel} • ${c.kelas}</span>
                            <span>${c.tgl}</span>
                        </div>
                        <h3 class="font-bold text-lg text-slate-800 mb-2">${c.judul}</h3>
                        <p class="text-sm text-slate-600 whitespace-pre-line bg-slate-50 p-3 rounded-lg border">${c.isi}</p>
                    </div>
                    <div class="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                        <span class="text-xs text-slate-500"><i class="fas fa-user-tie mr-1"></i> ${c.guru}</span>
                        ${c.fileName ? `<button onclick="alert('Mengunduh file catatan: ${c.fileName}')" class="bg-slate-800 text-white px-3 py-1 rounded text-xs font-bold"><i class="fas fa-download mr-1"></i> ${c.fileName}</button>` : '<span class="text-xs text-slate-400">Tanpa lampiran</span>'}
                    </div>
                </div>
            `).join('') || `<p class="text-slate-500 col-span-2 bg-white p-8 rounded-xl border text-center">Belum ada catatan yang diupload untuk Anda (${currentUser.name}).</p>`}
        </div>
    `;
    setContent(html);
}
