/* --- GENERATOR QR, SCANNER QR, KAMERA SELFIE & REKAP PRESENSI --- */
function renderGeneratorQR() {
    let html = `
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-slate-800">Buat & Cetak QR Code Kehadiran</h2>
            <p class="text-sm text-slate-500">Buat QR Code resmi untuk discan oleh Guru maupun Siswa pada kehadiran sehari-hari atau kehadiran ujian.</p>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 class="font-bold text-slate-800 mb-4 border-b pb-2"><i class="fas fa-plus-circle text-primary mr-2"></i>Pengaturan QR Code Baru</h3>
                <form onsubmit="buatSesiQR(event)" class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold mb-1">Target Pengguna Scan QR</label>
                        <select id="qr-target-peran" class="w-full p-2.5 border rounded-lg" required>
                            <option value="Siswa">Kehadiran Siswa</option>
                            <option value="Guru">Kehadiran Guru</option>
                            <option value="Semua">Umum (Guru & Siswa)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold mb-1">Kategori Kehadiran</label>
                        <select id="qr-kategori" class="w-full p-2.5 border rounded-lg" required>
                            <option value="Sehari-hari">Kehadiran Sehari-Hari (Harian)</option>
                            <option value="Ujian">Kehadiran Ujian</option>
                        </select>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-sm font-bold mb-1">Kelas / Ruangan</label>
                            <select id="qr-kelas" class="w-full p-2.5 border rounded-lg">
                                <option value="Semua Kelas / Ruang Guru">Semua Kelas / Ruang Guru</option>
                                ${genOptions(listKelas)}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-bold mb-1">Mata Pelajaran / Ujian</label>
                            <select id="qr-mapel" class="w-full p-2.5 border rounded-lg">
                                <option value="Absensi Umum">Absensi Umum</option>
                                ${genOptions(listMapel)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-bold mb-1">Tanggal Berlaku</label>
                        <input type="date" id="qr-tgl" value="${new Date().toISOString().split('T')[0]}" class="w-full p-2.5 border rounded-lg" required>
                    </div>
                    <button type="submit" class="w-full bg-primary hover:bg-primaryDark text-white font-bold py-3 rounded-lg shadow">
                        <i class="fas fa-qrcode mr-2"></i> GENERATE QR CODE SEKARANG
                    </button>
                </form>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                <h3 class="font-bold text-slate-800 mb-2">Tampilan QR Code Aktif</h3>
                <p id="qr-caption" class="text-xs text-slate-500 mb-4">Klik "Generate QR Code" untuk menampilkan QR siap scan</p>
                <div id="qrcode-container" class="p-4 bg-white border-2 border-slate-200 rounded-xl shadow-inner min-h-[220px] min-w-[220px] flex items-center justify-center">
                    <span class="text-xs text-slate-400">Belum ada QR dipilih</span>
                </div>
                <p id="qr-code-text" class="font-mono text-xs font-bold bg-slate-100 px-3 py-1.5 rounded mt-3 text-slate-700"></p>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
            <div class="px-5 py-3 bg-slate-800 text-white font-bold text-sm">Daftar Sesi QR Code Tersimpan</div>
            <div class="overflow-x-auto">
                <table>
                    <thead><tr><th>Kode QR</th><th>Target</th><th>Kategori</th><th>Kelas & Mapel</th><th>Tanggal</th><th>Aksi</th></tr></thead>
                    <tbody>
                        ${db.sesiQR.map(q => `
                            <tr>
                                <td class="font-mono font-bold text-primary">${q.kode}</td>
                                <td><span class="px-2 py-0.5 rounded text-xs font-bold bg-slate-100">${q.targetPeran}</span></td>
                                <td><span class="px-2 py-0.5 rounded text-xs font-bold ${q.kategori === 'Ujian' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}">${q.kategori}</span></td>
                                <td>${q.kelas} — ${q.mapel}</td>
                                <td>${q.tgl}</td>
                                <td class="space-x-1">
                                    <button onclick="tampilkanQR('${q.kode}', '${q.targetPeran} - ${q.kategori} (${q.kelas})')" class="bg-emerald-600 text-white px-2.5 py-1 rounded text-xs font-bold">TAMPILKAN QR</button>
                                    <button onclick="hapusData('sesiQR', ${q.id}, renderGeneratorQR)" class="bg-red-500 text-white px-2 py-1 rounded text-xs">HAPUS</button>
                                </td>
                            </tr>
                        `).join('') || `<tr><td colspan="6" class="text-center text-slate-400 py-4">Belum ada QR Code yang dibuat.</td></tr>`}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    setContent(html);
    if (db.sesiQR.length > 0) {
        const last = db.sesiQR[db.sesiQR.length - 1];
        tampilkanQR(last.kode, `${last.targetPeran} - ${last.kategori} (${last.kelas})`);
    }
}

function buatSesiQR(e) {
    e.preventDefault();
    const targetPeran = document.getElementById('qr-target-peran').value;
    const kategori = document.getElementById('qr-kategori').value;
    const kelas = document.getElementById('qr-kelas').value;
    const mapel = document.getElementById('qr-mapel').value;
    const tgl = document.getElementById('qr-tgl').value;
    const kode = `ASSISI-${targetPeran.toUpperCase()}-${kategori === 'Ujian' ? 'UJIAN' : 'HARIAN'}-${Math.floor(1000 + Math.random() * 9000)}`;

    const sesi = { id: Date.now(), kode, targetPeran, kategori, kelas, mapel, tgl, pembuat: currentUser.name };
    db.sesiQR.push(sesi);
    saveData();
    renderGeneratorQR();
}

function tampilkanQR(kode, caption) {
    const container = document.getElementById('qrcode-container');
    const capEl = document.getElementById('qr-caption');
    const textEl = document.getElementById('qr-code-text');
    if (!container) return;
    container.innerHTML = '';
    new QRCode(container, { text: kode, width: 200, height: 200 });
    if (capEl) capEl.innerText = caption;
    if (textEl) textEl.innerText = kode;
}

function renderPresensiScanForm(peranTarget) {
    const peran = peranTarget || currentUser.role;
    let myPresensi = db.presensi.filter(p => p.nama.toLowerCase() === currentUser.name.toLowerCase());

    let html = `
        <div class="mb-6 flex flex-wrap justify-between items-center gap-3">
            <div>
                <h2 class="text-2xl font-bold text-slate-800">Scan QR & Bukti Foto Kehadiran ${peran}</h2>
                <p class="text-sm text-slate-500">Mendukung presensi kehadiran <strong>Sehari-hari</strong> dan kehadiran <strong>Ujian</strong> dengan Scan QR + Bukti Foto Kamera/Galeri.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-5">
                <form onsubmit="savePresensiLengkap(event)" class="space-y-4">
                    <input type="hidden" id="pres-peran-val" value="${peran}">

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-sm font-bold mb-1">Jenis Kehadiran ${peran}</label>
                            <select id="pres-tipe" class="w-full p-2.5 border rounded-lg font-semibold bg-slate-50" required>
                                <option value="Sehari-hari">Kehadiran ${peran} Sehari-hari</option>
                                <option value="Ujian">Kehadiran ${peran} Ujian</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-bold mb-1">${peran === 'Siswa' ? 'Kelas' : 'Keterangan Tugas / Ruang'}</label>
                            ${peran === 'Siswa' 
                                ? `<select id="pres-kelas" class="w-full p-2.5 border rounded-lg">${genOptions(listKelas)}</select>`
                                : `<input type="text" id="pres-kelas" class="w-full p-2.5 border rounded-lg" placeholder="Contoh: Ruang Guru / Pengawas R.1" required>`
                            }
                        </div>
                    </div>

                    <div class="p-4 rounded-xl border-2 border-blue-200 bg-blue-50/50 space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-bold text-blue-900"><i class="fas fa-qrcode mr-1.5"></i>1. Scan QR Code Kehadiran</span>
                            <div class="space-x-1">
                                <button type="button" onclick="mulaiKameraQR()" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                                    <i class="fas fa-video mr-1"></i> Buka Kamera Scan QR
                                </button>
                                <button type="button" onclick="hentikanKameraQR()" id="btn-stop-qr" class="hidden-section bg-slate-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg">
                                    Tutup
                                </button>
                            </div>
                        </div>

                        <div id="qr-reader-box" class="hidden-section rounded-lg overflow-hidden border bg-black">
                            <div id="qr-reader" style="width: 100%;"></div>
                        </div>

                        <div>
                            <label class="block text-xs font-semibold text-slate-600 mb-1">Hasil Scan QR (atau pilih/ketik kode QR sesi aktif):</label>
                            <div class="flex gap-2">
                                <input type="text" id="pres-qr-code" class="flex-1 p-2.5 border rounded-lg font-mono text-sm bg-white uppercase" placeholder="Hasil scan QR muncul otomatis di sini..." required>
                                ${db.sesiQR.length > 0 ? `
                                    <select onchange="if(this.value) document.getElementById('pres-qr-code').value=this.value" class="p-2 border rounded-lg text-xs bg-white max-w-[160px]">
                                        <option value="">-- Pilih QR Aktif --</option>
                                        ${db.sesiQR.map(q => `<option value="${q.kode}">${q.kode}</option>`).join('')}
                                    </select>
                                ` : ''}
                            </div>
                        </div>
                    </div>

                    <div class="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-bold text-emerald-900"><i class="fas fa-camera mr-1.5"></i>2. Bukti Foto Kehadiran ${peran} (Wajib)</span>
                            <button type="button" onclick="bukaKameraSelfie()" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                                <i class="fas fa-camera mr-1"></i> Ambil Foto Kamera
                            </button>
                        </div>

                        <div id="selfie-camera-box" class="hidden-section space-y-2 text-center bg-slate-900 p-3 rounded-lg">
                            <video id="selfie-video" autoplay playsinline class="w-full max-h-56 object-cover rounded mx-auto"></video>
                            <div class="flex justify-center gap-2">
                                <button type="button" onclick="jepretFotoSelfie()" class="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg shadow">
                                    <i class="fas fa-circle mr-1"></i> JEPRET BUKTI FOTO
                                </button>
                                <button type="button" onclick="tutupKameraSelfie()" class="bg-slate-600 text-white text-xs font-bold px-3 py-2 rounded-lg">
                                    Batal
                                </button>
                            </div>
                        </div>

                        <div class="border-2 border-dashed border-emerald-300 p-4 text-center rounded-lg bg-white relative cursor-pointer hover:bg-emerald-50">
                            <i class="fas fa-cloud-upload-alt text-2xl text-emerald-600 mb-1"></i><br>
                            <span class="text-xs font-bold text-slate-700">Atau Unggah File Bukti Foto Kehadiran</span>
                            <input type="file" id="pres-foto" accept="image/*" capture="user" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onchange="previewUpload(this, 'pres-preview')">
                        </div>

                        <div id="pres-preview" class="text-center hidden-section bg-white p-3 rounded-lg border">
                            <p class="text-xs text-emerald-700 font-bold mb-1"><i class="fas fa-check-circle"></i> Bukti Foto Kehadiran Siap Dikirim</p>
                            <img id="pres-img-element" src="" class="mx-auto max-h-40 rounded border shadow-sm">
                        </div>
                    </div>

                    <button type="submit" class="w-full bg-primary hover:bg-primaryDark text-white font-bold py-3.5 rounded-xl shadow-md transition">
                        <i class="fas fa-paper-plane mr-2"></i> SIMPAN PRESENSI QR & BUKTI FOTO
                    </button>
                </form>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 class="font-bold text-slate-800 mb-4 border-b pb-2">Riwayat Kehadiran & Bukti Foto Saya (${myPresensi.length})</h3>
                <div class="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                    ${myPresensi.slice().reverse().map(p => `
                        <div class="flex items-center justify-between p-3.5 border rounded-xl bg-slate-50 gap-3">
                            <div class="space-y-1">
                                <div class="flex flex-wrap items-center gap-1.5">
                                    <span class="text-xs font-bold px-2 py-0.5 rounded ${p.tipe === 'Ujian' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}">
                                        ${p.peran} • ${p.tipe}
                                    </span>
                                    <span class="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">${p.kelas || '-'}</span>
                                </div>
                                <p class="text-sm font-bold text-slate-800">${p.tgl} • ${p.jam} WIB</p>
                                <p class="text-xs font-mono text-slate-500">QR: ${p.qrCode || 'Terverifikasi'}</p>
                            </div>
                            <div class="text-center shrink-0">
                                <img src="${p.foto}" alt="Bukti Foto" class="w-16 h-16 object-cover rounded-lg border-2 border-white shadow cursor-pointer" onclick="viewImage('${p.foto}')">
                                <span class="text-[10px] text-blue-600 font-semibold block mt-0.5">Lihat Foto</span>
                            </div>
                        </div>
                    `).join('') || `<p class="text-sm text-slate-400 text-center py-8">Belum ada riwayat presensi QR & bukti foto.</p>`}
                </div>
            </div>
        </div>
    `;
    setContent(html);
}

function mulaiKameraQR() {
    const box = document.getElementById('qr-reader-box');
    const btnStop = document.getElementById('btn-stop-qr');
    if (!box) return;
    box.classList.remove('hidden-section');
    if (btnStop) btnStop.classList.remove('hidden-section');

    try {
        html5QrScanner = new Html5Qrcode("qr-reader");
        html5QrScanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 220, height: 220 } },
            (decodedText) => {
                document.getElementById('pres-qr-code').value = decodedText;
                if (decodedText.toUpperCase().includes('UJIAN')) {
                    document.getElementById('pres-tipe').value = 'Ujian';
                } else if (decodedText.toUpperCase().includes('HARIAN')) {
                    document.getElementById('pres-tipe').value = 'Sehari-hari';
                }
                hentikanKameraQR();
                alert("QR Code berhasil terbaca: " + decodedText);
            },
            () => {}
        ).catch(() => {
            alert("Kamera QR tidak dapat diakses di browser ini. Silakan pilih kode QR aktif atau ketik kode QR secara manual.");
            hentikanKameraQR();
        });
    } catch (e) {
        alert("Pemindai kamera tidak tersedia. Gunakan pilihan QR aktif di kolom bawah.");
        hentikanKameraQR();
    }
}

function hentikanKameraQR() {
    const box = document.getElementById('qr-reader-box');
    const btnStop = document.getElementById('btn-stop-qr');
    if (html5QrScanner) {
        try { html5QrScanner.stop().then(() => html5QrScanner.clear()).catch(() => {}); } catch (e) {}
        html5QrScanner = null;
    }
    if (box) box.classList.add('hidden-section');
    if (btnStop) btnStop.classList.add('hidden-section');
}

function bukaKameraSelfie() {
    const camBox = document.getElementById('selfie-camera-box');
    const video = document.getElementById('selfie-video');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Browser tidak mendukung akses kamera langsung. Silakan gunakan tombol unggah foto di bawahnya.");
        return;
    }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then(stream => {
            activeCameraStream = stream;
            video.srcObject = stream;
            camBox.classList.remove('hidden-section');
        })
        .catch(() => {
            alert("Izin kamera ditolak atau tidak tersedia. Silakan unggah file foto bukti kehadiran.");
        });
}

function jepretFotoSelfie() {
    const video = document.getElementById('selfie-video');
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = 360;
    canvas.height = 270;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, canvas.height - 28, canvas.width, 28);
    ctx.fillStyle = "#ffffff";
    ctx.font = "11px sans-serif";
    ctx.fillText(`${currentUser.name} (${currentUser.role}) • ${new Date().toLocaleString('id-ID')}`, 8, canvas.height - 10);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
    const imgEl = document.getElementById('pres-img-element');
    imgEl.src = dataUrl;
    imgEl.dataset.base64 = dataUrl;
    document.getElementById('pres-preview').classList.remove('hidden-section');
    tutupKameraSelfie();
}

function tutupKameraSelfie() {
    if (activeCameraStream) {
        activeCameraStream.getTracks().forEach(t => t.stop());
        activeCameraStream = null;
    }
    const camBox = document.getElementById('selfie-camera-box');
    if (camBox) camBox.classList.add('hidden-section');
}

function previewUpload(input, previewBoxId) {
    let file = input.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function(e) {
        let img = new Image();
        img.onload = function() {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            let maxW = 360, maxH = 360;
            let width = img.width, height = img.height;
            if (width > height) { if (width > maxW) { height *= maxW / width; width = maxW; } }
            else { if (height > maxH) { width *= maxH / height; height = maxH; } }
            canvas.width = width; canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            let dataUrl = canvas.toDataURL('image/jpeg', 0.75);
            document.getElementById('pres-img-element').src = dataUrl;
            document.getElementById('pres-img-element').dataset.base64 = dataUrl;
            document.getElementById(previewBoxId).classList.remove('hidden-section');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function savePresensiLengkap(e) {
    e.preventDefault();
    let qrCode = document.getElementById('pres-qr-code').value.trim().toUpperCase();
    let base64Img = document.getElementById('pres-img-element').dataset.base64;
    let peran = document.getElementById('pres-peran-val').value || currentUser.role;
    let tipe = document.getElementById('pres-tipe').value;
    let kelas = document.getElementById('pres-kelas').value;

    if (!qrCode) { alert("Harap scan atau masukkan Kode QR kehadiran terlebih dahulu!"); return; }
    if (!base64Img) { alert("Harap ambil atau unggah Bukti Foto kehadiran terlebih dahulu!"); return; }

    let d = new Date();
    db.presensi.push({
        id: Date.now(),
        tgl: d.toISOString().split('T')[0],
        jam: d.toTimeString().split(' ')[0],
        nama: currentUser.name,
        peran: peran,
        tipe: tipe,
        kelas: kelas,
        qrCode: qrCode,
        foto: base64Img
    });
    saveData();
    alert(`Presensi ${tipe} (${peran}) beserta QR & Bukti Foto berhasil disimpan!`);
    renderPresensiScanForm(peran);
}

function renderPresensi() {
    let html = `
        <div class="mb-6 flex flex-wrap justify-between items-center gap-3">
            <div>
                <h2 class="text-2xl font-bold text-slate-800">Rekap Kehadiran QR & Bukti Foto (Guru & Siswa)</h2>
                <p class="text-sm text-slate-500">Menampilkan seluruh bukti foto dan hasil scan QR kehadiran sehari-hari maupun kehadiran ujian.</p>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
            <table>
                <thead>
                    <tr>
                        <th>Tanggal / Waktu</th>
                        <th>Nama Lengkap</th>
                        <th>Peran & Kategori</th>
                        <th>Kelas / Ruang</th>
                        <th>Kode QR</th>
                        <th>Bukti Foto Kehadiran</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>${db.presensi.slice().reverse().map(p => `
                    <tr>
                        <td><strong>${p.tgl}</strong><br><span class="text-xs text-slate-500">${p.jam} WIB</span></td>
                        <td class="font-bold text-slate-800">${p.nama}</td>
                        <td>
                            <span class="px-2 py-0.5 rounded text-xs font-bold ${p.peran === 'Guru' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-700'}">${p.peran}</span>
                            <span class="px-2 py-0.5 rounded text-xs font-bold ${p.tipe === 'Ujian' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}">${p.tipe}</span>
                        </td>
                        <td>${p.kelas || '-'}</td>
                        <td class="font-mono text-xs font-semibold text-slate-600">${p.qrCode || '-'}</td>
                        <td>
                            <img src="${p.foto}" alt="Bukti Kehadiran" class="w-16 h-16 object-cover border-2 border-slate-200 rounded-lg cursor-pointer hover:scale-105 transition" onclick="viewImage('${p.foto}')">
                        </td>
                        <td><button onclick="hapusData('presensi', ${p.id}, renderPresensi)" class="bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 rounded text-xs font-bold">HAPUS</button></td>
                    </tr>
                `).join('') || `<tr><td colspan="7" class="text-center text-slate-400 py-6">Belum ada data presensi QR & bukti foto</td></tr>`}
                </tbody>
            </table>
        </div>
    `;
    setContent(html);
}
