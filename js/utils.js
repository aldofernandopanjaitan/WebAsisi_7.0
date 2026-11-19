/* --- FUNGSI BANTUAN UMUM, JAM REAL-TIME & MEDIA --- */
function stopMediaResources() {
    if (html5QrScanner) {
        try {
            html5QrScanner.stop().then(() => html5QrScanner.clear()).catch(() => {});
        } catch (e) {}
        html5QrScanner = null;
    }
    if (activeCameraStream) {
        activeCameraStream.getTracks().forEach(track => track.stop());
        activeCameraStream = null;
    }
}

function startLiveClock() {
    if (liveClockInterval) clearInterval(liveClockInterval);
    const updateClock = () => {
        const now = new Date();
        const jamStr = now.toLocaleTimeString('id-ID', { hour12: false });
        const elTopbar = document.getElementById('live-clock-display');
        const elDash = document.getElementById('dashboard-live-clock');
        if (elTopbar) elTopbar.innerText = jamStr + ' WIB';
        if (elDash) elDash.innerText = jamStr + ' WIB';
    };
    updateClock();
    liveClockInterval = setInterval(updateClock, 1000);
}

function setContent(html) {
    if (isExamActive) {
        picuAntiCheat("Dilarang berpindah menu selama ujian berlangsung!");
        return;
    }
    stopMediaResources();
    document.getElementById('content-area').innerHTML = `<div class="fade-in">${html}</div>`;
}

function genOptions(arr) {
    return arr.map(a => `<option value="${a}">${a}</option>`).join('');
}

function genNumOptions(start, end) {
    let res = '';
    for (let i = start; i <= end; i++) {
        res += `<option value="${i}">${i}</option>`;
    }
    return res;
}

function hapusData(tabel, id, callback) {
    if (confirm('Yakin ingin menghapus data ini?')) {
        db[tabel] = db[tabel].filter(x => x.id !== id);
        saveData();
        callback();
    }
}

function viewImage(base64) {
    let overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.onclick = () => document.body.removeChild(overlay);
    overlay.innerHTML = `<img src="${base64}" class="max-w-[90%] max-h-[90%] border-4 border-white rounded shadow-2xl">`;
    document.body.appendChild(overlay);
}
