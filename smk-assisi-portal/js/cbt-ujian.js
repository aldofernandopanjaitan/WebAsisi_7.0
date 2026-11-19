/* --- SISTEM CBT, BANK SOAL, ANTI-CHEAT & LAPORAN NILAI UJIAN --- */
function renderManajemenSoal() {
    let html = `
        <div class="flex justify-between items-end mb-6">
            <div>
                <h2 class="text-2xl font-bold text-slate-800">Buat & Kelola Soal Ujian (CBT)</h2>
                <p class="text-sm text-slate-500">Tambahkan soal pilihan berganda maupun essay yang terhubung langsung dengan Jadwal Ujian siswa.</p>
            </div>
            <button onclick="renderJadwalUjian()" class="bg-primary hover:bg-primaryDark text-white text-xs font-bold px-4 py-2.5 rounded-lg">
                <i class="fas fa-calendar-check mr-1"></i> ATUR JADWAL & TOKEN UJIAN
            </button>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
            <form onsubmit="saveSoal(event)" class="space-y-4">
                <input type="hidden" id="soal-id" value="">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label class="text-sm font-bold">Mata Ujian</label><select id="soal-mapel" class="w-full p-2 border rounded" required>${genOptions(listMapel)}</select></div>
                    <div><label class="text-sm font-bold">Tipe Soal</label>
                        <select id="soal-tipe" class="w-full p-2 border rounded" required onchange="toggleTipeSoal(this.value)">
                            <option value="PG">Pilihan Berganda (A-E)</option>
                            <option value="Essay">Essay / Isian (100-900 kata)</option>
                        </select>
                    </div>
                </div>
                <div><label class="text-sm font-bold">Pertanyaan</label><textarea id="soal-tanya" class="w-full p-2 border rounded h-20" required></textarea></div>
                
                <div id="soal-opsi-group" class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div><label class="text-xs font-bold">Opsi A</label><input type="text" id="soal-a" class="w-full p-2 border rounded text-sm"></div>
                    <div><label class="text-xs font-bold">Opsi B</label><input type="text" id="soal-b" class="w-full p-2 border rounded text-sm"></div>
                    <div><label class="text-xs font-bold">Opsi C</label><input type="text" id="soal-c" class="w-full p-2 border rounded text-sm"></div>
                    <div><label class="text-xs font-bold">Opsi D</label><input type="text" id="soal-d" class="w-full p-2 border rounded text-sm"></div>
                    <div><label class="text-xs font-bold">Opsi E</label><input type="text" id="soal-e" class="w-full p-2 border rounded text-sm"></div>
                    <div><label class="text-xs font-bold text-emerald-600">Kunci Jawaban PG (A/B/C/D/E)</label><select id="soal-kunci-pg" class="w-full p-2 border rounded text-sm bg-emerald-50"><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option></select></div>
                </div>

                <div id="soal-kunci-essay-group" class="hidden-section">
                    <label class="text-sm font-bold text-emerald-600">Kunci Jawaban Benar (Untuk Isian)</label>
                    <textarea id="soal-kunci-essay" class="w-full p-2 border rounded h-20 bg-emerald-50"></textarea>
                </div>
                
                <button type="submit" class="bg-primary text-white font-bold p-3 rounded">SIMPAN SOAL</button>
            </form>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-4">
            <h3 class="font-bold mb-4">Daftar Soal Tersimpan (${db.soal.length})</h3>
            ${db.soal.map((s, idx) => `
                <div class="border-b pb-3 mb-3 flex justify-between items-start gap-4">
                    <div>
                        <p class="font-bold text-sm">${idx+1}. [${s.mapel}] - ${s.tipe}</p>
                        <p class="text-sm mb-1">${s.tanya}</p>
                        <p class="text-xs text-emerald-600 font-bold">Kunci: ${s.kunci}</p>
                    </div>
                    <div class="space-x-2 shrink-0">
                        <button onclick="editSoal(${s.id})" class="text-amber-600 text-xs font-bold">EDIT</button>
                        <button onclick="hapusData('soal', ${s.id}, renderManajemenSoal)" class="text-red-500 text-xs font-bold">HAPUS</button>
                    </div>
                </div>
            `).join('') || '<p class="text-xs text-slate-500">Soal kosong.</p>'}
        </div>
    `;
    setContent(html);
}

function toggleTipeSoal(val) {
    document.getElementById('soal-opsi-group').classList.toggle('hidden-section', val === 'Essay');
    document.getElementById('soal-kunci-essay-group').classList.toggle('hidden-section', val === 'PG');
}

function saveSoal(e) {
    e.preventDefault();
    let id = document.getElementById('soal-id').value;
    let tipe = document.getElementById('soal-tipe').value;
    let data = {
        id: id ? parseInt(id) : Date.now(),
        mapel: document.getElementById('soal-mapel').value,
        tipe: tipe,
        tanya: document.getElementById('soal-tanya').value,
        opsi: tipe === 'PG' ? {
            A: document.getElementById('soal-a').value, B: document.getElementById('soal-b').value,
            C: document.getElementById('soal-c').value, D: document.getElementById('soal-d').value,
            E: document.getElementById('soal-e').value
        } : null,
        kunci: tipe === 'PG' ? document.getElementById('soal-kunci-pg').value : document.getElementById('soal-kunci-essay').value
    };
    if (id) db.soal = db.soal.map(x => x.id == id ? data : x);
    else db.soal.push(data);
    saveData();
    renderManajemenSoal();
}

function editSoal(id) {
    let s = db.soal.find(x => x.id === id);
    if (!s) return;
    document.getElementById('soal-id').value = s.id;
    document.getElementById('soal-mapel').value = s.mapel;
    document.getElementById('soal-tipe').value = s.tipe;
    toggleTipeSoal(s.tipe);
    document.getElementById('soal-tanya').value = s.tanya;
    if (s.tipe === 'PG' && s.opsi) {
        document.getElementById('soal-a').value = s.opsi.A || '';
        document.getElementById('soal-b').value = s.opsi.B || '';
        document.getElementById('soal-c').value = s.opsi.C || '';
        document.getElementById('soal-d').value = s.opsi.D || '';
        document.getElementById('soal-e').value = s.opsi.E || '';
        document.getElementById('soal-kunci-pg').value = s.kunci;
    } else {
        document.getElementById('soal-kunci-essay').value = s.kunci;
    }
}

function renderUjianSiswa() {
    let html = `
        <div class="max-w-3xl mx-auto mt-6">
            <div class="text-center mb-6">
                <i class="fas fa-shield-alt text-5xl text-primary mb-3"></i>
                <h2 class="text-3xl font-bold text-slate-800">Portal Ujian CBT</h2>
                <p class="text-slate-600 text-sm mt-1">Pilih jadwal ujian yang telah ditetapkan Admin/Guru. Durasi waktu (Jam & Menit) otomatis mengikuti pengaturan jadwal.</p>
            </div>

            ${db.jadwalUjian.length > 0 ? `
                <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                    <div>
                        <label class="block text-sm font-bold mb-1">Pilih Jadwal Mata Ujian</label>
                        <select id="pilih-jadwal-ujian" class="w-full p-3 border rounded-lg font-semibold" onchange="updateInfoJadwalUjian()">
                            ${db.jadwalUjian.map(j => `
                                <option value="${j.id}">
                                    ${j.mapel} (${j.kelas}) — ${j.tgl} | Durasi: ${j.durasiJam || 0} Jam ${j.durasiMenit || 0} Menit
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <div id="box-info-ujian" class="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm space-y-1"></div>

                    <div>
                        <label class="block text-sm font-bold mb-1">Masukkan Kode Ujian / Token</label>
                        <input type="text" id="input-token-ujian" class="w-full p-3 border rounded-lg font-mono uppercase" placeholder="Masukkan kode dari pengawas/jadwal...">
                    </div>

                    <button onclick="mulaiUjianDariJadwal()" class="w-full bg-primary hover:bg-primaryDark text-white font-bold text-lg py-4 rounded-xl shadow-lg transition">
                        <i class="fas fa-play-circle mr-2"></i> MULAI UJIAN SEKARANG
                    </button>
                </div>
            ` : `
                <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
                    <p class="text-slate-500 font-semibold mb-2">Belum ada Jadwal Ujian yang dibuat oleh Admin atau Guru.</p>
                    <p class="text-xs text-slate-400">Silakan hubungi Admin/Guru untuk menerbitkan jadwal beserta durasi jam & menit ujian.</p>
                </div>
            `}
        </div>
    `;
    setContent(html);
    if (db.jadwalUjian.length > 0) updateInfoJadwalUjian();
}

function updateInfoJadwalUjian() {
    const select = document.getElementById('pilih-jadwal-ujian');
    const box = document.getElementById('box-info-ujian');
    if (!select || !box) return;
    const jadwal = db.jadwalUjian.find(j => j.id == select.value);
    if (!jadwal) return;

    const jmlSoalMapel = db.soal.filter(s => s.mapel === jadwal.mapel).length;
    const totalSoalTersedia = jmlSoalMapel > 0 ? jmlSoalMapel : db.soal.length;

    box.innerHTML = `
        <div class="flex justify-between"><span class="text-slate-500">Mata Ujian:</span><strong>${jadwal.mapel}</strong></div>
        <div class="flex justify-between"><span class="text-slate-500">Pengawas:</span><strong>${jadwal.pengawas}</strong></div>
        <div class="flex justify-between"><span class="text-slate-500">Durasi Ditetapkan:</span><strong class="text-primary">${jadwal.durasiJam || 0} Jam ${jadwal.durasiMenit || 0} Menit</strong></div>
        <div class="flex justify-between"><span class="text-slate-500">Jumlah Soal Siap:</span><strong>${totalSoalTersedia} Soal</strong></div>
    `;
}

function mulaiUjianDariJadwal() {
    const select = document.getElementById('pilih-jadwal-ujian');
    const jadwal = db.jadwalUjian.find(j => j.id == select.value);
    if (!jadwal) return;

    const inputKode = document.getElementById('input-token-ujian').value.trim().toUpperCase();
    if (jadwal.kodeUjian && inputKode !== jadwal.kodeUjian) {
        alert(`Kode Ujian salah! Periksa kembali kode ujian pada jadwal (Petunjuk: ${jadwal.kodeUjian}).`);
        return;
    }

    let daftarSoal = db.soal.filter(s => s.mapel === jadwal.mapel);
    if (daftarSoal.length === 0) daftarSoal = db.soal;

    if (daftarSoal.length === 0) {
        alert("Belum ada soal yang dibuat oleh Guru/Admin!");
        return;
    }

    const durasiJam = parseInt(jadwal.durasiJam || 0);
    const durasiMenit = parseInt(jadwal.durasiMenit || 0);
    let sisaDetik = (durasiJam * 3600) + (durasiMenit * 60);
    if (sisaDetik <= 0) sisaDetik = 3600;

    activeExamSubject = jadwal.mapel;
    isExamActive = true;
    document.getElementById('sidebar').classList.add('hidden-section');
    document.getElementById('topbar-warning').classList.remove('hidden-section');
    document.getElementById('exam-active-mapel').innerText = jadwal.mapel;
    startLiveClock();

    window.currentExamQuestions = daftarSoal;

    let formHtml = daftarSoal.map((s, idx) => {
        let konten = '';
        if (s.tipe === 'PG') {
            for (const [key, val] of Object.entries(s.opsi)) {
                konten += `<label class="block p-3 border rounded mb-2 cursor-pointer hover:bg-slate-50"><input type="radio" name="ans_${s.id}" value="${key}" class="mr-2"> ${key}. ${val}</label>`;
            }
        } else {
            konten = `<textarea name="ans_${s.id}" class="w-full h-32 p-3 border rounded outline-none focus:ring-2 focus:ring-primary" placeholder="Tulis uraian (100-900 kata)..."></textarea>`;
        }
        return `
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-4" id="box_${s.id}">
                <p class="font-bold text-lg mb-4">${idx+1}. ${s.tanya}</p>
                ${konten}
            </div>
        `;
    }).join('');

    let uiHtml = `
        <div class="max-w-4xl mx-auto prevent-select">
            <form id="form-lembar-ujian">
                ${formHtml}
                <button type="button" onclick="kumpulUjian()" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xl py-5 rounded-xl shadow-lg mt-4">SIMPAN & KUMPULKAN JAWABAN</button>
            </form>
        </div>
    `;
    document.getElementById('content-area').innerHTML = uiHtml;

    let display = document.getElementById('timer-display');
    let peringatan1Menit = false;

    const updateCountdown = () => {
        let h = Math.floor(sisaDetik / 3600);
        let m = Math.floor((sisaDetik % 3600) / 60);
        let s = sisaDetik % 60;
        display.innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;

        if (sisaDetik === 60 && !peringatan1Menit) {
            peringatan1Menit = true;
            alert("Waktu tersisa 1 menit! Sistem akan otomatis mengumpulkan jawaban Anda.");
        }
        if (sisaDetik <= 0) {
            clearInterval(examTimer);
            alert("WAKTU HABIS! Sistem melakukan Kumpul Otomatis.");
            kumpulUjian();
        }
        sisaDetik--;
    };

    updateCountdown();
    examTimer = setInterval(updateCountdown, 1000);
}

/* --- ANTI-CHEAT ENGINE --- */
function picuAntiCheat(pesan) {
    try {
        let speech = new SpeechSynthesisUtterance("Peringatan! Pelanggaran Ujian Terdeteksi.");
        speech.lang = 'id-ID';
        window.speechSynthesis.speak(speech);
    } catch (e) {}
    alert("🚨 PELANGGARAN: " + pesan);
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden && isExamActive) picuAntiCheat("Anda dilarang berpindah Tab atau Aplikasi selama ujian!");
});
document.addEventListener("contextmenu", (e) => {
    if (isExamActive) e.preventDefault();
});
document.addEventListener("keydown", (e) => {
    if (isExamActive && (e.key === 'PrintScreen' || (e.ctrlKey && ['c','v','s','p'].includes(e.key.toLowerCase())))) {
        e.preventDefault();
        navigator.clipboard.writeText('');
        picuAntiCheat("Dilarang mengambil foto layar (Screenshot) / Menyalin Soal!");
    }
});

/* --- SUBMIT & HASIL REVIEW --- */
function kumpulUjian() {
    clearInterval(examTimer);
    isExamActive = false;
    document.getElementById('topbar-warning').classList.add('hidden-section');
    document.getElementById('sidebar').classList.remove('hidden-section');

    let form = document.getElementById('form-lembar-ujian');
    let formData = new FormData(form);
    let benar = 0;
    let salah = 0;
    let soalDikerjakan = window.currentExamQuestions || db.soal;

    let reviewHtml = `<div class="max-w-4xl mx-auto"><h2 class="text-3xl font-bold text-slate-800 mb-6">Hasil & Review Ujian (${activeExamSubject})</h2>`;

    soalDikerjakan.forEach((s, idx) => {
        let jwbSiswa = formData.get(`ans_${s.id}`) || "";
        let isBenar = false;

        if (s.tipe === 'PG') {
            isBenar = (jwbSiswa === s.kunci);
        } else {
            isBenar = (jwbSiswa.trim().length > 10);
        }

        if (isBenar) benar++;
        else salah++;

        reviewHtml += `
            <div class="bg-white p-6 rounded-xl shadow-sm border ${isBenar ? 'border-emerald-500' : 'border-red-500'} mb-4">
                <p class="font-bold mb-2">${idx+1}. ${s.tanya}</p>
                <div class="p-3 rounded text-sm ${isBenar ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}">
                    <strong>Jawaban Anda:</strong> ${jwbSiswa || "Tidak Menjawab"}<br>
                    ${!isBenar ? `<span class="mt-2 block font-bold text-emerald-600">Kunci Benar Admin/Guru: ${s.kunci}</span>` : `<span class="mt-2 block font-bold">BENAR</span>`}
                </div>
            </div>
        `;
    });

    let bobot = 100 / soalDikerjakan.length;
    let nilaiAkhir = Math.round(benar * bobot);

    db.hasilUjian.push({
        id: Date.now(),
        nama: currentUser.name,
        mapel: activeExamSubject || 'Umum',
        benar,
        salah,
        nilai: nilaiAkhir,
        tgl: new Date().toLocaleDateString('id-ID')
    });
    saveData();

    reviewHtml += `
        <div class="bg-slate-900 text-white p-6 rounded-xl text-center shadow-xl mt-6">
            <h3 class="text-xl uppercase tracking-widest text-slate-400">Total Nilai Ujian</h3>
            <div class="text-6xl font-bold text-primary my-2">${nilaiAkhir}</div>
            <p>Benar: <span class="text-emerald-400 font-bold">${benar}</span> | Salah: <span class="text-red-400 font-bold">${salah}</span></p>
        </div></div>
    `;
    document.getElementById('content-area').innerHTML = reviewHtml;
}

function renderNilaiSiswa() {
    let myScores = db.hasilUjian.filter(h => h.nama === currentUser.name);
    let html = `
        <h2 class="text-2xl font-bold text-slate-800 mb-6">Hasil & Riwayat Nilai Ujian Saya</h2>
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table>
                <thead><tr><th>Tanggal</th><th>Mata Ujian</th><th>Benar</th><th>Salah</th><th>Nilai Akhir</th></tr></thead>
                <tbody>
                    ${myScores.map(h => `
                        <tr>
                            <td>${h.tgl}</td>
                            <td class="font-bold">${h.mapel || 'Ujian CBT'}</td>
                            <td class="text-emerald-600 font-bold">${h.benar}</td>
                            <td class="text-red-600 font-bold">${h.salah}</td>
                            <td class="text-xl font-black text-primary">${h.nilai}</td>
                        </tr>
                    `).join('') || `<tr><td colspan="5" class="text-center py-6 text-slate-400">Belum ada riwayat nilai ujian.</td></tr>`}
                </tbody>
            </table>
        </div>
    `;
    setContent(html);
}

function renderLaporan() {
    let html = `
        <div class="flex justify-between items-end mb-6">
            <div>
                <h2 class="text-2xl font-bold text-slate-800">Laporan Otomatis Nilai Ujian Siswa</h2>
                <p class="text-sm text-slate-500">Formula: (Benar / Total Soal) * 100</p>
            </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table>
                <thead><tr><th>Tanggal</th><th>Nama Siswa</th><th>Mata Ujian</th><th>Benar</th><th>Salah</th><th>Nilai Akhir</th><th>Aksi</th></tr></thead>
                <tbody>${db.hasilUjian.map(h => `
                    <tr>
                        <td>${h.tgl}</td><td class="font-bold">${h.nama}</td><td>${h.mapel || 'Ujian CBT'}</td><td class="text-emerald-600 font-bold">${h.benar}</td><td class="text-red-600 font-bold">${h.salah}</td>
                        <td class="text-xl font-black text-primary">${h.nilai}</td>
                        <td><button onclick="hapusData('hasilUjian', ${h.id}, renderLaporan)" class="bg-red-500 text-white px-2 py-1 rounded text-xs">HAPUS</button></td>
                    </tr>
                `).join('') || `<tr><td colspan="7" class="text-center py-4">Belum ada data nilai</td></tr>`}
                </tbody>
            </table>
        </div>
    `;
    setContent(html);
}
