// 1. Elements & Variables
const overlay = document.getElementById("sidebar-overlay");
const surahSidebar = document.getElementById("surah-sidebar-nav");
const verseSidebar = document.getElementById("verse-sidebar-nav");
const surahList = document.getElementById("full-surah-list");
let currentAudio = null;
// 2. Helper: Popups & Navigation
function togglePopup(id, action) {
  const el = document.getElementById(id);
  if (action === "open") {
    el.classList.add("open");
    overlay.style.display = "block";
  } else {
    el.classList.remove("open");
    overlay.style.display = "none";
  }
}

// Event Listeners for Buttons
// Beddel had l-partie:
document.getElementById("open-search").onclick = () => {
  togglePopup("search-sidebar", "open");
  displaySearchList(allSurahs); // Afichi kolchi mlli t-hall
};

// Zid had l-function jdida bach t-controler l-baht:
function displaySearchList(items) {
  const container = document.getElementById("search-results-container");
  if (!container) return;
  container.innerHTML = "";

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "search-item";
    div.style.cssText =
      "padding:15px; cursor:pointer; border-bottom:1px solid #f3f4f6; display:flex; justify-content:space-between; align-items:center;";

    div.innerHTML = `
            <span><b style="color:#2ca4ab;">${item.number}.</b> ${item.englishName}</span>
            <span style="font-family:'Amiri'; color:#134447;">${item.name}</span>
        `;

    div.onclick = () => {
      fetchSurahData(item.number, item.englishName);
      document.querySelector(".surah-select span").innerText =
        `${item.number}. ${item.englishName}`;

      // Sedd kolchi
      togglePopup("search-sidebar", "close");
      document
        .getElementById("surah-sidebar-nav")
        .classList.remove("open-flex");
      document
        .getElementById("verse-sidebar-nav")
        .classList.remove("open-flex");
      document.getElementById("sidebar-overlay").style.display = "none";
    };
    container.appendChild(div);
  });
}

// Zid had l-logic l-input dyal Search f l-sidebar
document.querySelector("#search-sidebar input").oninput = (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = allSurahs.filter(
    (s) =>
      s.englishName.toLowerCase().includes(term) ||
      s.name.includes(term) ||
      s.number.toString() === term,
  );
  displaySearchList(filtered);
};
document.getElementById("close-search").onclick = () =>
  togglePopup("search-sidebar", "close");
document.getElementById("open-languages").onclick = () =>
  togglePopup("language-sidebar", "open");
document.getElementById("close-languages").onclick = () =>
  togglePopup("language-sidebar", "close");
document.getElementById("open-settings").onclick = () =>
  togglePopup("settings-sidebar", "open");
document.getElementById("close-settings").onclick = () =>
  togglePopup("settings-sidebar", "close");

overlay.onclick = () => {
  document
    .querySelectorAll(".settings-sidebar")
    .forEach((s) => s.classList.remove("open"));
  overlay.style.display = "none";
};

// 3. Audio Controller
function playAudio(url, iconEl) {
  if (!url || url === "undefined") {
    alert("Audio not available");
    return;
  }

  if (currentAudio && !currentAudio.paused && currentAudio.src === url) {
    currentAudio.pause();
    iconEl.classList.replace("fa-pause", "fa-play");
    return;
  }

  if (currentAudio) currentAudio.pause();

  document
    .querySelectorAll(".q-icon-btn.fa-pause")
    .forEach((i) => i.classList.replace("fa-pause", "fa-play"));

  currentAudio = new Audio(url);
  iconEl.classList.replace("fa-play", "fa-pause");

  // Khdem s-sawt
  currentAudio.play().catch((err) => {
    console.error("Error playing audio:", err);
    iconEl.classList.replace("fa-pause", "fa-play");
  });

  currentAudio.onended = () => iconEl.classList.replace("fa-pause", "fa-play");
}

// 4. Fetch Surah Data (Arabic + English + Audio)
async function fetchSurahData(surahNumber, englishName) {
  const contentArea = document.querySelector(".q-wrapper");
  const readingArea = document.querySelector(".fth-script-area");

  contentArea.innerHTML = `<div style="text-align:center; padding:50px; font-family: sans-serif;">Loading Surah...</div>`;

  try {
    // Fetching 3 editions: Uthmani Script, English Translation, and Alafasy Audio
    const response = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.ahmedali,ar.alafasy`,
    );
    const result = await response.json();

    const arabic = result.data[0];
    const translation = result.data[1];
    const audio = result.data[2];

    console.log("  Fetched Data:", { arabic, translation, audio });

    // Header Section
    // 1. Header dyal Surah
    let html = `
    <div class="q-header" style="text-align: center; padding: 40px 0; border-bottom: 1px solid #eee;">
        <div class="q-arabic-title" style="font-family: 'Amiri', serif; font-size: 48px; color: #333;">${arabic.name}</div>
        <div class="q-title-row" style="margin-top: 10px; display: flex; justify-content: center; align-items: center;">
            <span class="q-surah-name" style="font-size: 20px; font-weight: bold; color: #2ca4ab;">${surahNumber}. ${englishName}</span>
            <span class="q-badge" style="background: #2ca4ab; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 5px;">info</span>
        </div>
        <div class="q-translation-title" style="color: #888; margin-top: 5px;">${arabic.englishNameTranslation}</div>
    </div>`;

    // 2. Loop dyal l-ayat m3a l-events jdad
    arabic.ayahs.forEach((ayah, index) => {
      html += `
    <div class="q-ayah-box" id="ayah-${index + 1}" style="border-bottom: 1px solid #eee; padding: 30px 0;">
        <div class="q-actions-row" style="display: flex; gap: 15px; align-items: center; margin-bottom: 20px; color: #777;">
            <span class="q-id" style="font-weight: 400; font-size: 14px;">${surahNumber}:${index + 1}</span>
            
            <i class="fa-solid fa-play q-icon-btn" style="cursor:pointer;" onclick="playAudio('${audio.ayahs[index].audio}', this)"></i>
            
            <i class="fa-regular fa-bookmark q-icon-btn" style="cursor:pointer;"></i>
            
            <div style="margin-left: auto; display: flex; gap: 18px;">
                <i class="fa-regular fa-copy q-icon-btn" style="cursor:pointer;" onclick="copyAyah('${ayah.text.replace(/'/g, "\\'")}')"></i>
                <i class="fa-solid fa-share-nodes q-icon-btn" style="cursor:pointer;" onclick="shareAyah(${surahNumber}, ${index + 1})"></i>
                <i class="fa-regular fa-pen-to-square q-icon-btn" style="cursor:pointer;"></i>
                <i class="fa-solid fa-ellipsis q-icon-btn" style="cursor:pointer;"></i>
            </div>
        </div>

        <div class="q-text-content" style="text-align: right; margin-bottom: 25px;">
            <div class="q-arabic-line" style="font-family: 'Amiri', serif; font-size: 32px; line-height: 2; color: #222; direction: rtl;">
                ${ayah.text} <span class="q-ayah-num" style="font-size: 22px; color: #666;">(${index + 1})</span>
            </div>
            <div class="q-english-line" style="text-align: left; color: #444; font-size: 17px; line-height: 1.6; margin-top: 15px; font-family: sans-serif;">
                ${translation.ayahs[index].text}
            </div>
        </div>

        <div class="q-footer-tools" style="display: flex; gap: 25px; color: #666; font-size: 14px; padding-top: 10px; font-family: sans-serif;">
            <span style="cursor:pointer;" onclick="showExtra('tafsir', ${surahNumber}, ${index + 1}, 'extra-${index}')"><i class="fa-solid fa-book-open" style="margin-right:5px;"></i> Tafsirs</span>
            <span style="cursor:pointer;" onclick="showExtra('lessons', ${surahNumber}, ${index + 1}, 'extra-${index}')"><i class="fa-solid fa-graduation-cap" style="margin-right:5px;"></i> Lessons</span>
            <span style="cursor:pointer;" onclick="showExtra('hadith', ${surahNumber}, ${index + 1}, 'extra-${index}')"><i class="fa-solid fa-book" style="margin-right:5px;"></i> Hadith</span>
        </div>

        <div id="extra-${index}"></div>
    </div>`;
    });

    contentArea.innerHTML = html;

    // Update Reading Mode
    // C'est ce bloc qui gère l'affichage de la 2ème image
    // Utilise cette structure pour le mode Reading pour garder la cohérence avec ton header
    readingArea.innerHTML = `
    <div class="q-header" style="text-align: center; padding: 0px 0; border-bottom: 1px solid #eee; margin-top:-50px;">
        <div class="q-arabic-title" style="font-family: 'Amiri', serif; font-size: 48px; color: #333;">${arabic.name}</div>
        <div class="q-title-row" style="margin-top: -40px; display: flex; justify-content: center; align-items: center;">
            <span class="q-surah-name" style="font-size: 20px; font-weight: 500; color: #2ca4ab;">${surahNumber}. ${englishName}</span>
            <div class="q-badge" style="background: #2ca4ab; color: white; height:20px; border-radius: 12px; font-size: 12px; margin-left: 5px; display:flex;justify-content: center; align-items: center;">info</div>
        </div>
        <div class="q-translation-title" style="color: #888; margin-top: -15px;">${arabic.englishNameTranslation}</div>
    </div>

    <div class="reading-content" style="direction: rtl; line-height: 3; text-align: center; font-family: 'Amiri', serif; font-size: 28px; color: #374151; padding: 40px 20px; max-width: 850px; margin: 0 auto;">
        ${arabic.ayahs
          .map(
            (a, i) => `
            ${a.text} <span style="color:#2ca4ab; font-family: sans-serif; font-size: 29px; margin-right: 5px;">(${i + 1})</span>
        `,
          )
          .join(" ")}
    </div>
`;

    // Update Verse Sidebar (Middle Sidebar)
    generateVerses(arabic.ayahs.length);
  } catch (error) {
    contentArea.innerHTML = `<div style="color:red; text-align:center; padding:50px;">Khata' f loading surah. Re-try later.</div>`;
  }
}

// 5. Sidebar Verses Generator
function generateVerses(count) {
  const list = document.getElementById("verses-list");
  list.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const v = document.createElement("div");
    v.className = "verse-item";
    v.innerText = i;
    v.onclick = () => {
      const el = document.getElementById(`ayah-${i}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    list.appendChild(v);
  }
}

// 6. Initialize App (Fetch 114 Surahs)
// Remplacez votre fonction initApp par celle-ci
async function initApp() {
  try {
    // Étape 1 : Charger la liste de toutes les sourates (indispensable pour les noms)
    const res = await fetch("https://api.alquran.cloud/v1/surah");
    const data = await res.json();
    allSurahs = data.data;
    displayList(allSurahs, "surah");

    // Étape 2 : Analyser l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const surahParam = urlParams.get("surah");
    const juzParam = urlParams.get("juz");

    if (surahParam) {
      // Si on vient d'un clic "Surah"
      const sNum = parseInt(surahParam);
      const found = allSurahs.find((s) => s.number === sNum);
      if (found) {
        fetchSurahData(sNum, found.englishName);
        document.querySelector(".surah-select span").innerText =
          `${sNum}. ${found.englishName}`;
      }
    } else if (juzParam) {
      // Si on vient d'un clic "Juz"
      const jNum = parseInt(juzParam);
      // On utilise ta fonction fetchByEndpoint pour charger le Juz
      fetchByEndpoint(`juz/${jNum}/quran-uthmani`, `Juz ${jNum}`);
      document.querySelector(".surah-select span").innerText = `Juz ${jNum}`;
    } else {
      // Par défaut (si on ouvre l'app normalement)
      fetchSurahData(1, "Al-Fatihah");
    }

    if (typeof fetchLanguages === "function") fetchLanguages();
  } catch (e) {
    console.error("Erreur d'initialisation:", e);
    document.querySelector(".q-wrapper").innerHTML =
      `<div style="text-align:center; padding:50px; color:red;">Erreur de chargement. Vérifiez votre connexion.</div>`;
  }
}

// Supprimez le bloc "checkUrlParameters" et le "setTimeout" à la fin,
// car tout est maintenant géré proprement dans initApp().
function displayList(items, type) {
  const surahListContainer = document.getElementById("full-surah-list");
  if (!surahListContainer) return;
  surahListContainer.innerHTML = "";

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "search-item";
    div.style.cssText =
      "display:flex; justify-content:space-between; align-items:center; padding:12px; cursor:pointer; border-bottom:1px solid #f3f4f6;";

    if (type === "surah") {
      div.innerHTML = `
                <span><b style="color:#999; margin-right:10px;">${item.number}</b> ${item.englishName}</span>
                <span style="font-family:'Amiri'; color:#2ca4ab;">${item.name}</span>`;

      div.onclick = () => {
        // 1. Bdél l-ktiba f l-header
        document.querySelector(".surah-select span").innerText =
          `${item.number}. ${item.englishName}`;

        // 2. Chargi l-data dyal s-surah
        fetchSurahData(item.number, item.englishName);

        // 3. Hada hwa l-fix: Sedd l-sidebar f l-PC u l-Mobile
        const sidebar = document.getElementById("surah-sidebar-nav");
        const vSidebar = document.getElementById("verse-sidebar-nav");
        const overlay = document.getElementById("sidebar-overlay");

        sidebar.classList.remove("open-flex");
        vSidebar.classList.remove("open-flex");
        overlay.style.display = "none"; // Bach i-hreb hta l-khyal l-khal
      };
    }
    // ... b9iya dyal l-logic dyal Juz u Page
    surahListContainer.appendChild(div);
  });
}
async function fetchByEndpoint(endpoint, title) {
  const contentArea = document.querySelector(".q-wrapper");
  contentArea.innerHTML = `<div style="text-align:center; padding:50px;">Loading ${title}...</div>`;

  try {
    const res = await fetch(`https://api.alquran.cloud/v1/${endpoint}`);
    const data = await res.json();
    const ayahs = data.data.ayahs;

    let html = `<div class="q-header" style="text-align: center; padding: 40px 0;">
                        <div class="q-arabic-title" style="font-family: 'Amiri', serif; font-size: 40px; color: #2ca4ab;">${title}</div>
                    </div>`;

    ayahs.forEach((ayah, index) => {
      // 1. Kan-splitiw l-aya l-kalimat
      const words = ayah.text.split(" ");

      // 2. Kan-loopiw 3la l-kalimat bach n-diro kol wehda f span
      const wordsHtml = words
        .map((word, wordIndex) => {
          // Hna kan-asta3mlo API dyal word-by-word (e.g., EveryAyah)
          // Format: surah/ayah/word (khassek t-adjusti had l-vars 3la hssab data li 3ndek)
          const s = ayah.surah
            ? ayah.surah.number
            : typeof surahNumber !== "undefined"
              ? surahNumber
              : 1;
          const a = ayah.numberInSurah;
          const w = wordIndex + 1;

          // Link dyal l-audio (exemple: Abdul Basit)
          const audioUrl = `https://words.everyayah.com/data/Abdul_Basit_Murattal_64kbps/${s}/${String(a).padStart(3, "0")}/${String(w).padStart(3, "0")}.mp3`;

          return `<span class="q-word" 
                      onclick="playWordAudio('${audioUrl}', this)" 
                      style="cursor:pointer; padding: 0 2px; transition: all 0.2s;">${word}</span>`;
        })
        .join(" ");

      html += `
    <div class="q-ayah-box" style="border-bottom: 1px solid #eee; padding: 30px 0;">
        <div class="q-text-content" style="text-align: right;">
            <div class="q-arabic-line" style="font-family: 'Amiri', serif; font-size: 32px; line-height: 2.2; color: #222; direction: rtl;">
                ${wordsHtml} <span style="font-size: 20px; color: #2ca4ab; margin-right: 10px;">(${ayah.numberInSurah})</span>
            </div>
        </div>
    </div>`;
    });
    function playWordAudio(url, element) {
      const audio = new Audio(url);

      // Feedback basri: l-kelma kat-welli khdra mnin t-kon katsme3
      element.style.color = "#2ca4ab";
      element.style.fontWeight = "bold";

      audio.play().catch((e) => console.log("Audio not found for this word"));

      audio.onended = () => {
        element.style.color = "#222"; // Terje3 l-lon l-asli
        element.style.fontWeight = "normal";
      };
    }

    contentArea.innerHTML = html;
    if (window.innerWidth < 768)
      document
        .getElementById("surah-sidebar-nav")
        .classList.remove("open-flex");
  } catch (e) {
    contentArea.innerHTML = `<div style="color:red; text-align:center; padding:50px;">Khata' f loading ${title}.</div>`;
  }
}

// 7. Tabs Switching Logic
const btnVerse = document.getElementById("btn-verse");
const btnReading = document.getElementById("btn-reading");
const viewVerse = document.getElementById("view-verse");
const viewReading = document.getElementById("view-reading");
// Logique de basculement entre les modes
btnVerse.onclick = () => {
  // 1. Afficher/Cacher les vues
  viewVerse.style.display = "block";
  viewReading.style.display = "none";

  // 2. Gérer l'état visuel des boutons
  btnVerse.classList.add("active");
  btnReading.classList.remove("active");
};

btnReading.onclick = () => {
  // 1. Afficher/Cacher les vues
  viewVerse.style.display = "none";
  viewReading.style.display = "block";

  // 2. Gérer l'état visuel des boutons
  btnReading.classList.add("active");
  btnVerse.classList.remove("active");
};

btnReading.onclick = () => {
  btnReading.classList.add("active");
  btnVerse.classList.remove("active");
  viewVerse.style.display = "none";
  viewReading.style.display = "block";
};

btnVerse.onclick = () => {
  btnVerse.classList.add("active");
  btnReading.classList.remove("active");
  viewReading.style.display = "none";
  viewVerse.style.display = "block";
};

// Toggle Main Surah Button
document.getElementById("header-surah-btn").onclick = () => {
  surahSidebar.classList.toggle("open-flex");
  verseSidebar.classList.toggle("open-flex");
};

// Start the App
initApp();
async function showExtra(type, surah, ayah, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = `<div class="explanation-container">Loading...</div>`;

  let content = "";
  try {
    if (type === "tafsir") {
      // Fetch Arabic Tafsir (Moyassar)
      const resAr = await fetch(
        `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/ar.jalalayn`,
      );
      const dataAr = await resAr.json();
      // Fetch English Tafsir
      const resEn = await fetch(
        `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/en.asad`,
      );
      const dataEn = await resEn.json();

      content = `<strong>Tafsir (AR):</strong> ${dataAr.data.text}<br><br><strong>Note (EN):</strong> ${dataEn.data.text}`;
    } else if (type === "lessons") {
      content =
        "Fi had l-ayah, nastafeed ana... (Hna ymken t-hardcodi chi logic aw tjibha men database dyalk)";
    } else if (type === "hadith") {
      content = "Qal Rasulu Allah (PBUH)... (Hadith kerye l-ayah)";
    }

    container.innerHTML = `
            <div class="explanation-container">
                <div class="profile-mini"><i class="fas fa-user"></i></div>
                <div class="explanation-text">${content}</div>
            </div>`;
  } catch (e) {
    container.innerHTML = "Error loading data.";
  }
}
function copyAyah(text) {
  navigator.clipboard.writeText(text);
  alert("Ayah copied!");
}

function shareAyah(surah, ayah) {
  const shareData = {
    title: "Tylawa App",
    text: `Check out Ayah ${surah}:${ayah}`,
    url: window.location.href + `?surah=${surah}&ayah=${ayah}`,
  };
  if (navigator.share) navigator.share(shareData);
  else alert("Link: " + shareData.url);
}
// Had l-code ghadi i-qra l-raqm li f l-link (?surah=X)
function checkUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const surahId = urlParams.get("surah");

  if (surahId) {
    // Kan-7awlo l-raqm l-int
    const sNum = parseInt(surahId);

    // Kan-qalbo 3la smit sourate f l-list dyalna (allSurahs)
    if (allSurahs && allSurahs.length >= sNum) {
      const surahData = allSurahs[sNum - 1];

      // Kan-bddlo l-header
      document.querySelector(".surah-select span").innerText =
        `${sNum}. ${surahData.englishName}`;

      // Kan-3iytou l-function li katchargi sourate
      fetchSurahData(sNum, surahData.englishName);
    }
  }
}

// Zid had l-line f lekher dyal initApp() bach t-khdem mlli t-7el l-page
// Aw zidha ghir f lekher dyal l-script:
setTimeout(checkUrlParameters, 500); // 500ms bach n-takdo an l-data t-chargat

// 1. Data des récitants (Replace hada f blasset l-qdim)
const recitersData = {
  hafs: [
    { id: "ar.alafasy", name: "Mishary Alafasy" },
    { id: "ar.abdurrahmansudais", name: "Abdurrahman Al-Sudais" },
    { id: "ar.abdulsamad", name: "AbdulBaset AbdulSamad" },
    { id: "ar.mahermuaiqly", name: "Maher Al-Muaiqly" },
    { id: "ar.minshawi", name: "Mohamed Siddiq Al-Minshawi" },
    { id: "ar.saoodshuraym", name: "Saood Al-Shuraym" },
    { id: "ar.huzayfi", name: "Ali Al-Huzayfi" },
    { id: "ar.ahmedajamy", name: "Ahmed Al-Ajamy" },
    { id: "ar.hudhaify", name: "Hudhaify" },
    { id: "ar.shaatree", name: "Abu Bakr Al-Shatri" },
  ],
  warsh: [
    { id: "ar.brahimakhdar", name: "Ibrahim Al-Akhdar" },
    { id: "ar.abdullahbasfar", name: "Abdullah Basfar" },
    { id: "ar.yassinaljazairi", name: "Yassin Al-Jazairi" },
    { id: "ar.kushayti", name: "Mustafa Al-Kushayti" },
    { id: "ar.abdulazizazzahrani", name: "Abdulaziz Az-Zahrani" },
  ],
};

// 2. Variables d'état (Dima khasshom y-konu f top dyal l-file)
let selectedReciterId = "ar.alafasy";
let selectedReciterName = "Mishary Alafasy";
let isPlayingAll = false;

// 3. Gestion dyal Sidebar Reciters
document.getElementById("reciter-trigger").onclick = () =>
  togglePopup("reciter-sidebar", "open");
document.getElementById("close-reciters").onclick = () =>
  togglePopup("reciter-sidebar", "close");

function showReciters(type) {
  const container = document.getElementById("reciters-list-container");
  container.innerHTML = `<h4 style="margin-bottom:10px; color:#134447;">Reciters (${type.toUpperCase()})</h4>`;

  recitersData[type].forEach((r) => {
    const div = document.createElement("div");
    div.className = `reciter-item ${selectedReciterId === r.id ? "selected" : ""}`;
    div.innerHTML = `<span>${r.name}</span> <i class="fas fa-check" style="display:${selectedReciterId === r.id ? "block" : "none"}; color:#2ca4ab;"></i>`;

    div.onclick = () => {
      selectedReciterId = r.id;
      selectedReciterName = r.name;
      document.querySelector("#reciter-trigger span").innerText = r.name;
      togglePopup("reciter-sidebar", "close");
      if (isPlayingAll) stopPlayback();
    };
    container.appendChild(div);
  });
}

// 4. Lecture Ayah par Ayah (L-fix dyal l-error)
document.getElementById("btn-listen").onclick = async () => {
  if (isPlayingAll) {
    stopPlayback();
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const surahNum = urlParams.get("surah") || 1;
  const audioPlayer = document.getElementById("main-audio-player");
  const btnListen = document.getElementById("btn-listen");

  try {
    // Fetch l-audio dyal ga3 l-ayahs dyal l-reciteur li khtariti
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNum}/${selectedReciterId}`,
    );
    const data = await res.json();
    const ayahs = data.data.ayahs;

    isPlayingAll = true;
    btnListen.innerHTML = `<i class="fas fa-stop"></i> Stop`;
    document.getElementById("audio-player-bar").style.display = "flex";
    document.getElementById("current-reciter-name").innerText =
      selectedReciterName;
    document.getElementById("current-surah-name").innerText =
      data.data.englishName;

    for (let i = 0; i < ayahs.length; i++) {
      if (!isPlayingAll) break;

      const ayahElement = document.getElementById(`ayah-${i + 1}`);
      if (ayahElement) {
        ayahElement.scrollIntoView({ behavior: "smooth", block: "center" });
        ayahElement.style.backgroundColor = "rgba(44, 164, 171, 0.1)";
      }

      // Play audio o n-tsnnawh
      await new Promise((resolve) => {
        audioPlayer.src = ayahs[i].audio;
        audioPlayer.play().catch(resolve);
        audioPlayer.onended = resolve;
      });

      if (ayahElement) ayahElement.style.backgroundColor = "transparent";
    }
    stopPlayback();
  } catch (e) {
    console.error("Audio error:", e);
    stopPlayback();
  }
};

function stopPlayback() {
  isPlayingAll = false;
  document.getElementById("main-audio-player").pause();
  document.getElementById("btn-listen").innerHTML =
    `<i class="fas fa-play"></i> Listen`;
}
// Vérifier si un numéro de sourate est présent dans l'URL
const urlParams = new URLSearchParams(window.location.search);
const surahId = urlParams.get("surah");

if (surahId) {
  // On appelle votre fonction existante qui charge les données de l'API
  // Assurez-vous que le nom de la fonction est bien fetchSurahData dans votre code
  fetchSurahData(surahId);
}
// التحكم في فتح وإغلاق السايدبار
const editionsSidebar = document.getElementById("editions-sidebar");
const openBtn = document.getElementById("open-editions");
const closeBtn = document.getElementById("close-editions");

openBtn.addEventListener("click", () => {
  editionsSidebar.classList.add("active"); // تأكد أن كلاس active كاين ف الـ CSS ديالك
  editionsSidebar.style.right = "0"; // إذا كان السايدبار مخفي جهة اليمين
});

closeBtn.addEventListener("click", () => {
  editionsSidebar.style.right = "-100%";
});

// دالة تغيير الرواية
function setEdition(editionId, displayName) {
  // 1. تحديث الاسم في الزر
  document.getElementById("current-edition-name").innerText = displayName;

  // 2. تحديث الرواية في السيستم
  currentEdition = editionId;

  // 3. إغلاق السايدبار
  editionsSidebar.style.right = "-100%";

  // 4. إعادة تحميل السورة بالرواية الجديدة
  const urlParams = new URLSearchParams(window.location.search);
  const surahId = urlParams.get("surah") || 1;
  fetchChapterContent(surahId);
}
