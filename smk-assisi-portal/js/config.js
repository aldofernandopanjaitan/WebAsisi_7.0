/* --- STATE GLOBAL & DATABASE LOKAL (LocalStorage) --- */
let currentUser = { role: '', name: '' };
let isExamActive = false;
let examTimer = null;
let liveClockInterval = null;
let activeExamSubject = '';
let html5QrScanner = null;
let activeCameraStream = null;

let db = {
    jadwalUjian: JSON.parse(localStorage.getItem('db_jadwalUjian')) || [],
    jadwalHarian: JSON.parse(localStorage.getItem('db_jadwalHarian')) || [],
    presensi: JSON.parse(localStorage.getItem('db_presensi')) || [],
    materi: JSON.parse(localStorage.getItem('db_materi')) || [],
    soal: JSON.parse(localStorage.getItem('db_soal')) || [],
    hasilUjian: JSON.parse(localStorage.getItem('db_hasilUjian')) || [],
    nilaiTugas: JSON.parse(localStorage.getItem('db_nilaiTugas')) || [],
    catatanSiswa: JSON.parse(localStorage.getItem('db_catatanSiswa')) || [],
    sesiQR: JSON.parse(localStorage.getItem('db_sesiQR')) || []
};

const listKelas = ["10 RPL", "10 TB", "10 AK", "11 RPL", "11 TB", "11 AK", "12 RPL", "12 TB", "12 AK"];
const listMapel = ["Agama", "PKN", "Bahasa Indonesia", "Matematika", "Bahasa Inggris", "Kejuruan RPL", "Kejuruan TB", "Kejuruan AK", "IPA", "IPS"];
const listGuru = [
    "Sr.Gaudensia Silalahi", "H.Tindaon", "P.Tambunan", "E.Sirait",
    "E.Silalahi", "A.Lumbantobing", "M.Haloho", "E.Nainggolan",
    "L.Panggabean", "E.Gultom", "K.Silitonga", "O.Nadeak"
];

function saveData() {
    localStorage.setItem('db_jadwalUjian', JSON.stringify(db.jadwalUjian));
    localStorage.setItem('db_jadwalHarian', JSON.stringify(db.jadwalHarian));
    localStorage.setItem('db_presensi', JSON.stringify(db.presensi));
    localStorage.setItem('db_materi', JSON.stringify(db.materi));
    localStorage.setItem('db_soal', JSON.stringify(db.soal));
    localStorage.setItem('db_hasilUjian', JSON.stringify(db.hasilUjian));
    localStorage.setItem('db_nilaiTugas', JSON.stringify(db.nilaiTugas));
    localStorage.setItem('db_catatanSiswa', JSON.stringify(db.catatanSiswa));
    localStorage.setItem('db_sesiQR', JSON.stringify(db.sesiQR));
}
