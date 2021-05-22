const musicContainer = document.querySelector('.music-container');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const audio = document.querySelector('#audio');
const progress = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-container');
const title = document.querySelector('#title');
const cover = document.querySelector('#cover');
const github = document.querySelector('#github');

// Song titles
const songs = ['Emoji', 'Fun Pop', 'Relax'];

// Keep track of songs
let songIndex = 0;

let songFromStorage = localStorage.getItem('currentSong');

if (songFromStorage !== undefined && songFromStorage !== null && songs.includes(songFromStorage)) {
  songIndex = songs.indexOf(songFromStorage);
}

// Initially load song info into DOM
loadSong(songs[songIndex]);

// Update song details
function loadSong(song) {
  title.innerText = song;
  audio.src = `./music/${song}.mp3`;
  cover.src = `./images/${song}.jpg`;
}

function playOrPause() {
  const isPlaying = musicContainer.classList.contains('play');

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

function playSong() {
  localStorage.setItem('currentSong', songs[songIndex]);

  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');

  audio.play();
}

function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');
  playBtn.querySelector('i.fas').classList.add('fa-play');

  audio.pause();
}

function prevSong() {
  const progressPercent = (audio.currentTime / audio.duration) * 100;

  if (progressPercent < 10) {
    --songIndex;

    if (songIndex < 0) {
      songIndex = songs.length - 1;
    }

    loadSong(songs[songIndex]);
    playSong();
  } else {
    audio.currentTime = 0;
  }
}

function nextSong() {
  ++songIndex;

  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }

  loadSong(songs[songIndex]);
  playSong();
}

function updateProgress(event) {
  const { duration, currentTime } = event.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

function setProgress(event) {
  const width = this.clientWidth;
  const clickX = event.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

// Event Listeners
playBtn.addEventListener('click', playOrPause);

// Change song events
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);

progressContainer.addEventListener('click', setProgress);

audio.addEventListener('ended', nextSong);

github.addEventListener('click', () => {
  window.open('https://github.com/patel-priyank/Music-Player');
});

window.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'Space':
      playOrPause();
      break;

    case 'ArrowLeft':
    case 'KeyP':
      prevSong();
      break;

    case 'ArrowRight':
    case 'KeyN':
      nextSong();
      break;
  }
});
