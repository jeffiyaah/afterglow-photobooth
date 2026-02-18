const canvas = document.getElementById("polaroidCanvas");
const ctx = canvas.getContext("2d");
const captionInput = document.getElementById("captionInput");
const downloadBtn = document.getElementById("downloadBtn");
const backBtn = document.getElementById("backBtn");
const dateToggle = document.getElementById("dateToggle");

canvas.width = 240;
canvas.height = 640;

let showDate = true;
let polaroidPaper = "#ffffff";
let selectedSticker = null;

/* =====================
   DATE TOGGLE
   ===================== */
dateToggle.addEventListener("change", () => {
  showDate = dateToggle.checked;
  drawPolaroid();
});

/* =====================
   PAPER COLORS
   ===================== */
const paperMap = {
  white: "#ffffff",
  blush: "#fff0f5",
  cream: "#fff8e7",
  lavender: "#f3f0ff",
  mint: "#eef8f3",
  sky: "#eef5ff"
};

document.querySelectorAll(".polaroid-style button").forEach(btn => {
  btn.addEventListener("click", () => {
    polaroidPaper = paperMap[btn.dataset.paper];

    document
      .querySelectorAll(".polaroid-style button")
      .forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    drawPolaroid();
  });
});

/* =====================
   STICKERS
   ===================== */



document.querySelectorAll(".sticker-style button").forEach(btn => {
  btn.addEventListener("click", () => {

    if (btn.dataset.sticker === "none") {
      selectedSticker = null; // 🔥 REMOVE STICKER
    } else {
      selectedSticker = btn.dataset.sticker;
    }

    drawPolaroid();
  });
});

document.querySelectorAll(".caption-presets button").forEach(btn => {
  btn.addEventListener("click", () => {
    captionInput.value = btn.dataset.text;
    drawPolaroid();
  });
});
const bgThemes = {
  cloud: "#f7f7f7",
  blush: "#fdf6f0",
  matcha: "#eef8f3",
  night: "#1f1f24"
};

document.querySelectorAll(".bg-style button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.documentElement.style.setProperty(
      "--bg",
      bgThemes[btn.dataset.bg]
    );
  });
});

/* =====================
   LOAD PHOTOS
   ===================== */
const photos = JSON.parse(localStorage.getItem("boothPhotos")) || [];
const images = [];

photos.forEach(src => {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    images.push(img);
    if (images.length === 3) drawPolaroid();
  };
});

/* =====================
   DRAW POLAROID
   ===================== */
function drawPolaroid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Paper background
  ctx.fillStyle = polaroidPaper;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Photos
  images.forEach((img, i) => {
    ctx.drawImage(img, 15, i * 180 + 20, 210, 150);
  });
images.forEach((img, i) => {
  const x = 15;
  const y = i * 180 + 20;
  const w = 210;
  const h = 150;

  // photo
  ctx.drawImage(img, x, y, w, h);

  // ✨ film shadow
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  const shadow = ctx.createLinearGradient(x, y, x, y + h);
  shadow.addColorStop(0, "rgba(0,0,0,0.12)");
  shadow.addColorStop(0.15, "rgba(0,0,0,0)");
  shadow.addColorStop(0.85, "rgba(0,0,0,0)");
  shadow.addColorStop(1, "rgba(0,0,0,0.15)");
  ctx.fillStyle = shadow;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
});

  drawCaption();

  if (selectedSticker) {
    drawSticker();
  }

  if (showDate) {
    drawPolaroidDate();
  }
}

/* =====================
   CAPTION
   ===================== */
function drawCaption() {
  if (!captionInput.value.trim()) return;

  ctx.fillStyle = "#6b5b53";
  ctx.font = "18px 'Comic Neue', cursive";
  ctx.textAlign = "center";
  ctx.fillText(
    captionInput.value,
    canvas.width / 2,
    canvas.height - 45
  );
}

/* =====================
   STICKER DRAW
   ===================== */
function drawSticker() {
  ctx.font = "36px serif";
  ctx.textAlign = "center";

  // fixed cute position
  ctx.fillText(
    selectedSticker,
    canvas.width - 40,
    canvas.height - 90
  );
}

/* =====================
   DATE
   ===================== */
function drawPolaroidDate() {
  ctx.fillStyle = "#6b5b53";
  ctx.font = "16px 'Comic Neue', cursive";
  ctx.textAlign = "center";

  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  ctx.fillText(date, canvas.width / 2, canvas.height - 20);
}
function drawTape() {
  const tapeWidth = 90;
  const tapeHeight = 26;
  const x = (canvas.width - tapeWidth) / 2;
  const y = 8;

  ctx.save();

  // tape body
  ctx.fillStyle = "rgba(255, 245, 220, 0.85)";
  ctx.rotate((-2 * Math.PI) / 180);
  ctx.fillRect(x, y, tapeWidth, tapeHeight);

  // tape shadow
  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;

  ctx.restore();
}
drawTape();

/* =====================
   LIVE UPDATES
   ===================== */
captionInput.addEventListener("input", drawPolaroid);

/* =====================
   DOWNLOAD
   ===================== */
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "polaroid.png";
  link.href = canvas.toDataURL("image/png");
  link.click();

  const oldText = downloadBtn.textContent;
  downloadBtn.textContent = "Saved ✨";

  setTimeout(() => {
    downloadBtn.textContent = oldText;
  }, 2000);
});


/* =====================
   BACK BUTTON
   ===================== */
backBtn.addEventListener("click", () => {
  localStorage.removeItem("boothPhotos");
  window.location.href = "index.html";
});
