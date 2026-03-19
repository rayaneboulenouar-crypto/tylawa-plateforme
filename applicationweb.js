document.addEventListener('click', function(e) {
    // 1. Détection du clic sur une Sourate (Section 2)
    const surahCard = e.target.closest('.card-item'); 
    if (surahCard) {
        const titleText = surahCard.querySelector('.eng-name').innerText;
        const surahNumber = titleText.split('.')[0].trim(); // Récupère le "1" de "1. Al-Fatihah"
        window.location.href = `appweb.html?surah=${surahNumber}`;
        return;
    }

    // 2. Détection du clic sur un Juz (si tu as une section Juz)
    // Adapte '.juz-card' au nom de ta classe réelle pour les Juz
    const juzCard = e.target.closest('.juz-card'); 
    if (juzCard) {
        const juzNumber = juzCard.innerText.replace(/\D/g, ''); // Extrait juste le numéro
        window.location.href = `appweb.html?juz=${juzNumber}`;
    }
});

document.addEventListener('click', function(e) {
    // On vérifie si on a cliqué sur une carte de sourate
    const card = e.target.closest('.card-item'); 
    
    if (card) {
        // On récupère le texte (ex: "1. Al-Fatihah")
        const surahText = card.querySelector('.eng-name').innerText;
        // On extrait le numéro (ce qui est avant le point)
        const surahNumber = surahText.split('.')[0].trim();

        // On redirige vers l'app
        window.location.href = `appweb.html?surah=${surahNumber}`;
    }
});
        const audio = document.getElementById('quranAudio');
const title = document.getElementById('surahTitle');
const icon = document.getElementById('playIcon');
const progress = document.getElementById('progressFill');

// Liste des sourates (Hussary - Warsh)
const playlist = [
    { name: "Surah Al-Fatihah", id: "001" },
    { name: "Surah Al-Baqarah", id: "002" },
    { name: "Surah Al-Imran", id: "003" },
    // Tu peux ajouter les 114 ici sur le même modèle
];

let currentIndex = 0;

function loadSurah(index) {
    currentIndex = index;
    const surah = playlist[currentIndex];
    title.innerText = surah.name;
    audio.src = `https://server13.mp3quran.net/husr/${surah.id}.mp3`;
    if (!audio.paused) audio.play(); // Joue direct si on change pendant l'écoute
}

// Bouton Play/Pause
document.querySelector('.play-btn').onclick = () => {
    audio.paused ? (audio.play(), icon.className = 'fas fa-pause') : (audio.pause(), icon.className = 'fas fa-play');
};

// Flèche Suivante
document.getElementById('nextBtn').onclick = () => {
    let next = (currentIndex + 1) % playlist.length;
    loadSurah(next);
    audio.play(); icon.className = 'fas fa-pause';
};

// Flèche Précédente
document.getElementById('prevBtn').onclick = () => {
    let prev = (currentIndex - 1 + playlist.length) % playlist.length;
    loadSurah(prev);
    audio.play(); icon.className = 'fas fa-pause';
};

// Barre de progression
audio.ontimeupdate = () => {
    progress.style.width = (audio.currentTime / audio.duration) * 100 + '%';
};
const surahData = [
    { id: "01", eng: "Al-Fatihah", mean: "The Opener", arb: "الفَاتِحَة", verses: "7 Verse" },
    { id: "02", eng: "Al-Baqarah", mean: "The Cow", arb: "البَقَرَة", verses: "286 verses" },
    { id: "03", eng: "Al-Imran", mean: "The Family of Imran", arb: "عِمرَان", verses: "200 verses" },
    { id: "04", eng: "An-Nisa'", mean: "The Women", arb: "النِّسَاء", verses: "176 verses" },
    { id: "05", eng: "Al-Ma'idah", mean: "The Table Spread", arb: "المَائدة", verses: "120 verses" },
    { id: "06", eng: "Al-An'am", mean: "The Cattle", arb: "الأَنعَام", verses: "165 verses" },
    { id: "07", eng: "Al-A'raf", mean: "The Heights", arb: "الأعرَاف", verses: "206 verses" },
    { id: "08", eng: "Al-Anfal", mean: "The Spoils of War", arb: "الأَنفَال", verses: "75 verses" },
    { id: "09", eng: "At-Tawbah", mean: "The Repentance", arb: "التَّوبَة", verses: "129 verses" },
    { id: "10", eng: "Yunus", mean: "Jonah", arb: "يُونُس", verses: "109 verses" },
    { id: "11", eng: "Hud", mean: "Hud", arb: "هُود", verses: "123 verses" },
    { id: "12", eng: "Yusuf", mean: "Joseph", arb: "يُوسُف", verses: "111 verses" },
    { id: "13", eng: "Ar-Ra'd", mean: "The Thunder", arb: "الرَّعد", verses: "43 verses" },
    { id: "14", eng: "Ibrahim", mean: "Abraham", arb: "إِبرَاهِيم", verses: "52 verses" },
    { id: "15", eng: "Al-Hijr", mean: "The Rocky Tract", arb: "الحِجْر", verses: "99 verses" }
];

const container = document.getElementById('mainContentContainer');
const tabs = document.querySelectorAll('.filter-tab');

function renderSurahs(filter = "") {
    const filtered = surahData.filter(s => s.eng.toLowerCase().includes(filter.toLowerCase()));
    container.innerHTML = filtered.map(s => `
        <div class="card-item">
            <div class="left">
                <div class="eng-name">${s.id}. ${s.eng}</div>
                <div class="sub-info">${s.mean}</div>
            </div>
            <div class="right">
                <div class="arb-name">${s.arb}</div>
                <span class="verse-count">${s.verses}</span>
            </div>
        </div>
    `).join('');
}

function renderJuz() {
    let html = "";
    for(let i=1; i<=30; i++) {
        html += `
        <div class="card-item">
            <div class="left">
                <div class="eng-name">Juz ${i}</div>
                <div class="sub-info">Part of the Quran</div>
                <div style="width:100%; height:4px; background:#eee; margin-top:10px; border-radius:2px">
                    <div style="width:${Math.random()*100}%; height:100%; background:#008967; border-radius:2px"></div>
                </div>
            </div>
        </div>`;
    }
    container.innerHTML = html;
}

tabs.forEach(tab => {
    tab.onclick = () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if(tab.dataset.type === 'surah') renderSurahs();
        else if(tab.dataset.type === 'juz') renderJuz();
        else container.innerHTML = `<p style="padding:40px; color:#888; width:100%; text-align:center">Revelation Order Timeline...</p>`;
    };
});

document.getElementById('surahSearch').oninput = (e) => renderSurahs(e.target.value);
renderSurahs();
async function renderAyahs(surahId) {
    // 1. Khbi l-grid o binn l-detail view
    document.querySelector('.surah-section').style.display = 'none';
    const detailView = document.getElementById('surahDetailView');
    detailView.style.display = 'block';

    const ayahsContainer = document.getElementById('ayahsContainer');
    ayahsContainer.innerHTML = "<p style='text-align:center;'>Loading Ayahs...</p>";

    window.scrollTo(0, 0); // Rje3 l-foug

    try {
        // Fetch l-ayat + Translation (Saheeh International)
        const response = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surahId}?translations=131&fields=text_uthmani`);
        const data = await response.json();
        
        const sInfo = surahList.find(s => parseInt(s.id) === parseInt(surahId));
        document.getElementById('detailSurahName').innerText = `Surah ${sInfo.eng}`;
        document.getElementById('detailSurahInfo').innerText = `${sInfo.mean} • ${sInfo.verses}`;

        ayahsContainer.innerHTML = data.verses.map(v => `
            <div class="ayah-card">
                <div class="ayah-top">
                    <div class="ayah-tools">
                        <span style="font-size:14px; color:#008967;">${surahId}:${v.verse_number}</span>
                        <i class="fas fa-play" onclick="playAyah('${surahId}', ${v.verse_number})"></i>
                        <i class="fas fa-book-open" title="Explanation"></i>
                    </div>
                    <div class="ayah-arabic">${v.text_uthmani}</div>
                </div>
                <div class="ayah-translation">${v.translations[0].text}</div>
            </div>
        `).join('');
    } catch (e) {
        ayahsContainer.innerHTML = "Error loading data.";
    }
}

function backToMain() {
    document.getElementById('surahDetailView').style.display = 'none';
    document.querySelector('.surah-section').style.display = 'block';
}

function playAyah(sId, aNum) {
    const s = sId.toString().padStart(3, '0');
    const a = aNum.toString().padStart(3, '0');
    const url = `https://everyayah.com/data/Husary_64kbps/${s}${a}.mp3`;
    const audio = document.getElementById('globalAudio');
    audio.src = url;
    audio.play();
}
const RECITER_CODE = 1;
    const CHAPTERS_COLLECTION = [
        { id: 1, name: "Al-Fatihah", sub: "The Opener", ar: "الفَاتِحَة" },
        { id: 2, name: "Al-Baqarah", sub: "The Cow", ar: "البَقَرَة" },
        { id: 3, name: "Al-Imran", sub: "The Family of Imran", ar: "آل عِمْرَان" },
        { id: 4, name: "An-Nisa'", sub: "The Women", ar: "النِّسَاء" },
        { id: 5, name: "Al-Ma'idah", sub: "The Table Spread", ar: "المَائِدَة" },
        { id: 6, name: "Al-An'am", sub: "The Cattle", ar: "الأَنْعَام" },
    ];

    const menuSurahList = document.getElementById('menuSurahList');
    const displayVerseList = document.getElementById('displayVerseList');
    const coreAudioPlayer = document.getElementById('coreAudioPlayer');
    const triggerPlay = document.getElementById('triggerPlay');
    const iconPlayPause = document.getElementById('iconPlayPause');
    const trackProgress = document.getElementById('trackProgress');
    const labelPlaying = document.getElementById('labelPlaying');

    let storeVerses = [];
    let currentVersePos = 0;
    let currentChapterLabel = "";

    // Sidebar Init
    CHAPTERS_COLLECTION.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = `chapter-card ${index === 0 ? 'is-active' : ''}`;
        row.innerHTML = `<div><h3>${String(item.id).padStart(2,'0')}. ${item.name}</h3><p>${item.sub}</p></div><div class="chapter-ar-name">${item.ar}</div>`;
        row.onclick = () => {
            document.querySelectorAll('.chapter-card').forEach(el => el.classList.remove('is-active'));
            row.classList.add('is-active');
            fetchChapterContent(item.id, item.name);
        };
        menuSurahList.appendChild(row);
    });

    async function fetchChapterContent(id, name) {
        currentChapterLabel = name;
        displayVerseList.innerHTML = '<p style="text-align:center; padding:50px; color:#999;">Chargement...</p>';
        const response = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${id}?translations=136&fields=text_uthmani&per_page=300`);
        const data = await response.json();
        storeVerses = data.verses.map(v => ({ key: v.verse_key, text: v.text_uthmani, trans: v.translations[0].text }));
        
        drawVerses();
        labelPlaying.innerText = `Surah ${currentChapterLabel} - Prête à lire`;
    }

    function drawVerses() {
        displayVerseList.innerHTML = '';
        storeVerses.forEach((verse, idx) => {
            const block = document.createElement('div');
            block.className = 'verse-entry';
            block.id = `verse-id-${idx}`;
            block.innerHTML = `<div class="arabic-txt">${verse.text} <span style="font-size:1.3rem; color:#ccc;">﴿${idx+1}﴾</span></div><div class="translation-txt">${verse.trans}</div>`;
            block.onclick = () => executeAudio(idx);
            displayVerseList.appendChild(block);
        });
        displayVerseList.scrollTop = 0;
    }

    async function executeAudio(idx) {
        if(idx < 0 || idx >= storeVerses.length) return;
        currentVersePos = idx;

        document.querySelectorAll('.verse-entry').forEach(v => v.classList.remove('is-playing'));
        const target = document.getElementById(`verse-id-${idx}`);
        if(target) {
            target.classList.add('is-playing');
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const res = await fetch(`https://api.quran.com/api/v4/recitations/${RECITER_CODE}/by_ayah/${storeVerses[idx].key}`);
        const result = await res.json();
        coreAudioPlayer.src = result.audio_files[0].url.startsWith('http') ? result.audio_files[0].url : "https://audio.qurancdn.com/" + result.audio_files[0].url;
        labelPlaying.innerText = `Surah ${currentChapterLabel} (Verset ${idx+1})`;
        coreAudioPlayer.play();
        iconPlayPause.className = "fa-solid fa-pause";
    }

    triggerPlay.onclick = () => {
        if(!coreAudioPlayer.src) {
            executeAudio(0);
        } else if(coreAudioPlayer.paused) {
            coreAudioPlayer.play();
            iconPlayPause.className = "fa-solid fa-pause";
        } else {
            coreAudioPlayer.pause();
            iconPlayPause.className = "fa-solid fa-play";
        }
    };

    document.getElementById('btnNext').onclick = () => executeAudio(currentVersePos + 1);
    document.getElementById('btnPrev').onclick = () => executeAudio(currentVersePos - 1);

    coreAudioPlayer.ontimeupdate = () => {
        const ratio = (coreAudioPlayer.currentTime / coreAudioPlayer.duration) * 100;
        trackProgress.style.width = ratio + "%";
        document.getElementById('timeElapsed').innerText = clockFormat(coreAudioPlayer.currentTime);
        document.getElementById('timeTotal').innerText = clockFormat(coreAudioPlayer.duration);
    };

    function clockFormat(val) {
        if(!val) return "00:00";
        let minutes = Math.floor(val/60), seconds = Math.floor(val%60);
        return `${minutes<10?'0'+minutes:minutes}:${seconds<10?'0'+seconds:seconds}`;
    }

    coreAudioPlayer.onended = () => executeAudio(currentVersePos + 1);

    window.onload = () => fetchChapterContent(1, "Al-Fatihah");
function goToSurah(id) {
    // Kat-dih l-appweb.html o kat-zid surah=ID f l-link
    window.location.href = `appweb.html?surah=${id}`;
}

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const appGrid = document.querySelector('.app-grid');

// 1. Au clic sur les 3 tirets : afficher les 6 sourates
mobileMenuBtn.onclick = () => {
    appGrid.classList.toggle('show-surahs');
};

// 2. Modifier la logique de sélection de sourate
// On sélectionne toutes les cartes de sourates (celles qui chargent les versets)
// Dans applicationweb.html
document.addEventListener('click', function(e) {
    // On cherche si on a cliqué sur une carte .card-item
    const card = e.target.closest('.card-item'); 
    
    if (card) {
        // On récupère le texte "1. Al-Fatihah"
        const fullText = card.querySelector('.eng-name').innerText;
        // On extrait juste le numéro avant le point
        const surahNumber = fullText.split('.')[0].trim();

        // Redirection vers l'application avec le paramètre
        window.location.href = `appweb.html?surah=${surahNumber}`;
    }
});

const searchInput = document.querySelector('.search-wrapper input');

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase(); // Ce que l'utilisateur tape
    const cards = document.querySelectorAll('.chapter-card'); // Toutes tes cartes de sourates

    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase(); // Le nom de la sourate
        const subTitle = card.querySelector('p').innerText.toLowerCase(); // Le nom traduit

        // Si le texte tapé est dans le titre ou la traduction, on affiche, sinon on cache
        if (title.includes(term) || subTitle.includes(term)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
});

// --- Logic dyal Dark Mode ---

const themeToggle = document.getElementById('theme-toggle');

// 1. Fonction bach n-tabbqo l-theme
function applyTheme(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        // Beddel l-icon l-chems
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        // Beddel l-icon l-qmer
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
}

// 2. Chof ach mn theme msajel f l-browser mlli it-chargi l-site
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

// 3. Event listener mlli n-clickiw 3la l-bouton
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
}
