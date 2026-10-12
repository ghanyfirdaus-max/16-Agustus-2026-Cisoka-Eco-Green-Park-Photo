// Our Stamp Album — ganti nama file foto pada array photoFiles di bawah.
const photoFiles = [
  "foto01.jpeg", "foto02.jpeg", "foto03.jpeg", "foto04.jpeg", "foto05.jpeg",
  "foto06.jpeg", "foto07.jpeg", "foto08.jpeg", "foto09.jpeg", "foto10.jpeg",
  "foto11.jpeg", "foto12.jpeg", "foto13.jpeg", "foto14.jpeg", "foto15.jpeg",
  "foto16.jpeg", "foto17.jpeg", "foto18.jpeg", "foto19.jpeg", "foto20.jpeg"
];

// 9 landscape, 11 portrait. Urutan ini menentukan stamp mana yang landscape.
const landscapeIndexes = new Set([1, 3, 5, 7, 9, 11, 13, 15, 17]);
const stampIcons = ["♡", "✿", "✧", "୨୧", "☆", "❀", "∞", "♡", "✧", "❁", "୨୧", "☆", "♡", "✿", "∞", "❀", "☆", "♡", "✧", "❁"];
const stampWords = ["love note", "for you", "our days", "sweet us", "always", "little joy", "together", "dear love", "memories", "you + me", "my person", "forever", "happiness", "our story", "warm hugs", "lovely", "just us", "my home", "with love", "the best"];

const grid = document.getElementById("stampGrid");
const toggleAllButton = document.getElementById("toggleAllButton");
const musicButton = document.getElementById("musicButton");
const backgroundMusic = document.getElementById("backgroundMusic");
let allSequenceRunning = false;
let allPhotosOpen = false;

function createStamp(index) {
  const number = index + 1;
  const card = document.createElement("button");
  card.type = "button";
  card.className = "stamp-card" + (landscapeIndexes.has(number) ? " landscape" : "");
  card.setAttribute("aria-label", `Stamp ${number}, klik untuk melihat foto`);
  card.setAttribute("aria-pressed", "false");

  const inner = document.createElement("span");
  inner.className = "stamp-inner";

  const front = document.createElement("span");
  front.className = "stamp-face stamp-front";
  front.innerHTML = `
    <span class="stamp-number">${String(number).padStart(2, "0")}</span>
    <span class="stamp-icon" aria-hidden="true">${stampIcons[index]}</span>
    <span class="stamp-word">${stampWords[index]}</span>
    <span class="stamp-cancel">♡ · · · ♡</span>
  `;

  const back = document.createElement("span");
  back.className = "stamp-face stamp-back";

  const img = document.createElement("img");
  img.src = photoFiles[index];
  img.alt = `Kenangan ${number}`;
  img.loading = "eager";
  img.decoding = "async";
  img.onerror = () => {
    img.remove();
    const placeholder = document.createElement("span");
    placeholder.className = "photo-placeholder";
    placeholder.innerHTML = `<b>Foto ${String(number).padStart(2, "0")}</b><small>Taruh file ${photoFiles[index]}<br>di folder yang sama.</small>`;
    back.appendChild(placeholder);
  };
  back.appendChild(img);

  inner.append(front, back);
  card.appendChild(inner);
  card.addEventListener("click", () => {
    if (allSequenceRunning) return;
    setStampState(card, !card.classList.contains("is-flipped"), number);
    allPhotosOpen = [...grid.querySelectorAll(".stamp-card")].every(stamp => stamp.classList.contains("is-flipped"));
    updateAllButton();
  });
  return card;
}

for (let i = 0; i < 20; i++) {
  grid.appendChild(createStamp(i));
}

function setStampState(card, open, number) {
  card.classList.toggle("is-flipped", open);
  card.setAttribute("aria-pressed", String(open));
  card.setAttribute("aria-label", open
    ? `Foto ${number}, klik untuk menutup`
    : `Stamp ${number}, klik untuk melihat foto`);
}

function updateAllButton() {
  toggleAllButton.textContent = allPhotosOpen ? "♡ Tutup semua foto" : "♡ Buka semua foto";
  toggleAllButton.setAttribute("aria-pressed", String(allPhotosOpen));
}

toggleAllButton.addEventListener("click", async () => {
  if (allSequenceRunning) return;
  allSequenceRunning = true;
  toggleAllButton.disabled = true;
  const cards = [...grid.querySelectorAll(".stamp-card")];
  const opening = !allPhotosOpen;

  // Buka atau tutup berurutan dari stamp 01 sampai 20.
  for (let i = 0; i < cards.length; i++) {
    setStampState(cards[i], opening, i + 1);
    await new Promise(resolve => setTimeout(resolve, 115));
  }

  allPhotosOpen = opening;
  updateAllButton();
  allSequenceRunning = false;
  toggleAllButton.disabled = false;
});

musicButton.addEventListener("click", async () => {
  if (backgroundMusic.paused) {
    try {
      await backgroundMusic.play();
      musicButton.textContent = "♫ About You - The 1975";
      musicButton.setAttribute("aria-pressed", "true");
    } catch (error) {
      musicButton.textContent = "Musik tidak tersedia";
      musicButton.setAttribute("aria-pressed", "false");
    }
  } else {
    backgroundMusic.pause();
    musicButton.textContent = "♫ About You - The 1975";
    musicButton.setAttribute("aria-pressed", "false");
  }
});

// Loading screen
const loadingScreen = document.getElementById("loadingScreen");
const progressBar = document.getElementById("progressBar");
const loadingPercent = document.getElementById("loadingPercent");
let progress = 0;
const loadingTimer = setInterval(() => {
  progress = Math.min(100, progress + Math.floor(Math.random() * 8) + 4);
  progressBar.style.width = `${progress}%`;
  loadingPercent.textContent = `${progress}%`;
  if (progress >= 100) {
    clearInterval(loadingTimer);
    setTimeout(() => loadingScreen.classList.add("hide"), 350);
  }
}, 110);
