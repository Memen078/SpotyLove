let songs = [];
let currentIndex = 0;
let audio = new Audio();

document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("welcome").classList.add("hidden");
  document.getElementById("player").classList.remove("hidden");
  loadSongs();
});

// Primera ventana -> segunda ventana
document.getElementById("introBtn").addEventListener("click", () => {
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("welcome").classList.remove("hidden");
});

// Segunda ventana -> reproductor
document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("welcome").classList.add("hidden");
  document.getElementById("player").classList.remove("hidden");
  loadSongs();
});


async function loadSongs() {
  const res = await fetch("songs.json");
  songs = await res.json();
  renderSongList();
}


function renderSongList() {
  const list = document.getElementById("songList");
  list.innerHTML = "";
  songs.sort((a,b) => a.title.localeCompare(b.title));
  songs.forEach((song, index) => {
    const card = document.createElement("div");
    card.className = "songCard";
    card.innerHTML = `<img src="${song.image}" width="100"><p>${song.title}</p>`;
    card.addEventListener("click", () => playSong(index));
    list.appendChild(card);
  });
}

let playCount = 0; // contador de canciones reproducidas

function playSong(index) {
  currentIndex = index;
  const song = songs[index];
  audio.src = song.file;
  audio.play();

  document.getElementById("songImage").src = song.image;
  document.getElementById("songTitle").textContent = song.title;
  document.getElementById("songArtist").textContent = song.artist;
  document.getElementById("songText").textContent = song.text;

  // Mostrar imagen solo si es "Mi Mayor Anhelo"
if (song.title.toLowerCase().includes("mi mayor anhelo")) {
  document.getElementById("proposalImage").classList.remove("hidden");
} else {
  document.getElementById("proposalImage").classList.add("hidden");
}

  // 🔄 Cambiar fondo cada 4 canciones reproducidas
  playCount++;
  const fondos = ["bg1", "bg2", "bg3", "bg4"];
  const fondoIndex = Math.floor(playCount / 4) % fondos.length;

  const body = document.body;
  body.classList.remove(...fondos); // limpia clases anteriores
  body.classList.add(fondos[fondoIndex]);
}


document.getElementById("playPauseBtn").addEventListener("click", () => {
  if (audio.paused) audio.play();
  else audio.pause();
});

document.getElementById("nextBtn").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % songs.length;
  playSong(currentIndex);
});

document.getElementById("prevBtn").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  playSong(currentIndex);
});

document.getElementById("shuffleBtn").addEventListener("click", () => {
  // Selecciona una canción aleatoria y la reproduce
  const randomIndex = Math.floor(Math.random() * songs.length);
  playSong(randomIndex);
});

// Actualiza la barra de progreso mientras la canción avanza
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const porcentaje = (audio.currentTime / audio.duration) * 100;
    document.getElementById("progressHeart").style.left = porcentaje + "%";
  }
});

// Permite adelantar/retrasar al hacer click en la barra
document.getElementById("progressBar").addEventListener("click", (e) => {
  const ancho = e.currentTarget.offsetWidth;
  const clickX = e.offsetX;
  const nuevoTiempo = (clickX / ancho) * audio.duration;
  audio.currentTime = nuevoTiempo;
});

// Cuando termina una canción, pasa automáticamente a la siguiente
audio.addEventListener("ended", () => {
  currentIndex = (currentIndex + 1) % songs.length;
  playSong(currentIndex);
});

document.addEventListener("DOMContentLoaded", () => {
  const yesBtn = document.getElementById("yesBtn");
  if (yesBtn) {
    yesBtn.addEventListener("click", () => {
      document.getElementById("proposalImage").classList.add("hidden");
    });
  }
});





