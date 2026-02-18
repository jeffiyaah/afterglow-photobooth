const video = document.getElementById("video");
const captureBtn = document.getElementById("captureBtn");
const nextBtn = document.getElementById("nextBtn");
const countdownEl = document.getElementById("countdown");
const captureHint = document.getElementById("captureHint");

const intro = document.getElementById("intro");
const app = document.getElementById("app");

let photos = [];
let currentFilter = "normal";

/* =====================
   INTRO → CAMERA HANDOFF
   ===================== */

// show intro for 2.5s
setTimeout(() => {
  intro.classList.add("fade-out");

  setTimeout(() => {
    intro.style.display = "none";
    app.classList.remove("hidden");

    // 🔥 CAMERA STARTS ONLY HERE
    startCamera();

  }, 600);
}, 2500);

/* =====================
   CAMERA START
   ===================== */
function startCamera() {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "user" } })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      console.error(err);
      alert("Camera access denied. Please refresh and allow camera.");
    });
}

/* =====================
   FILTERS
   ===================== */
const filterMap = {
  normal: "brightness(1.1) contrast(1.1) saturate(1.05)",
  bw: "grayscale(100%) contrast(1.35) brightness(1.05)",
  softGlow: "brightness(1.25) contrast(0.85) saturate(1.15)",
  retroWhite: "brightness(0.95) contrast(0.85) saturate(0.88) sepia(0.25)",
  vintageWhite: "contrast(0.8) saturate(0.78)",
  modern: "contrast(0.7) saturate(0.6) sepia(0.35)"
};

document.querySelectorAll(".filter-bar button").forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    video.style.filter = filterMap[currentFilter];
  });
});

/* =====================
   CAPTURE HINT
   ===================== */
function updateCaptureHint() {
  if (photos.length === 0) {
    captureHint.textContent = "📸 Take your first picture";
  } else if (photos.length === 1) {
    captureHint.textContent = "✨ Nice! Take your second picture";
  } else if (photos.length === 2) {
    captureHint.textContent = "💖 Last one! Take your third picture";
  } else {
    captureHint.textContent = "✔ Photos captured!";
  }
  captureHint.style.opacity = 1;
}

updateCaptureHint();

/* =====================
   COUNTDOWN
   ===================== */
function startCountdown(callback) {
  let count = 3;
  countdownEl.style.display = "flex";
  countdownEl.textContent = count;
  captureHint.style.opacity = 0;

  const timer = setInterval(() => {
    count--;
    if (count === 0) {
      clearInterval(timer);
      countdownEl.style.display = "none";
      callback();
    } else {
      countdownEl.textContent = count;
    }
  }, 1000);
}

/* =====================
   CAPTURE PHOTO
   ===================== */
function capturePhoto() {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = video.videoWidth;
  tempCanvas.height = video.videoHeight;

  const ctx = tempCanvas.getContext("2d");
  ctx.filter = filterMap[currentFilter];

  ctx.translate(tempCanvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0);

  ctx.filter = "none";

  photos.push(tempCanvas.toDataURL("image/png"));
  updateCaptureHint();

  if (photos.length === 3) {
    localStorage.setItem("boothPhotos", JSON.stringify(photos));
  }
}

/* =====================
   BUTTON EVENTS
   ===================== */
captureBtn.addEventListener("click", () => {
  if (photos.length < 3) {
    startCountdown(capturePhoto);
  }
});

nextBtn.addEventListener("click", () => {
  if (photos.length < 3) {
    alert("Please take 3 photos first!");
    return;
  }
  window.location.href = "polaroid.html";
});
