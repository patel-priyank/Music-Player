const musicContainer = document.querySelector('.music-container');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const muteBtn = document.querySelector('#mute');
const audio = document.querySelector('#audio');
const progressBar = document.querySelector('.progress-bar');
const progressBarContainer = document.querySelector('.progress-bar-container');
const elapsedTime = document.querySelector('#elapsed-time');
const totalTime = document.querySelector('#total-time');
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
  progressBar.style.width = `${progressPercent}%`;

  elapsedMin = Math.floor(audio.currentTime / 60)
    .toString()
    .padStart(2, 0);
  elapsedSec = Math.floor(audio.currentTime % 60)
    .toString()
    .padStart(2, 0);
  totalMin = Math.floor(audio.duration / 60)
    .toString()
    .padStart(2, 0);
  totalSec = Math.floor(audio.duration % 60)
    .toString()
    .padStart(2, 0);

  if (!isNaN(elapsedMin) && !isNaN(elapsedSec)) {
    elapsedTime.innerText = elapsedMin + ':' + elapsedSec;
  }

  if (!isNaN(totalMin) && !isNaN(totalSec)) {
    totalTime.innerText = totalMin + ':' + totalSec;
  }
}

function setProgress(event) {
  const width = this.clientWidth;
  const clickX = event.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

function muteOrUnmute() {
  const isMuted = audio.muted;

  if (isMuted) {
    unmuteSong();
  } else {
    muteSong();
  }
}

function muteSong() {
  muteBtn.querySelector('i.fas').classList.remove('fa-volume-up');
  muteBtn.querySelector('i.fas').classList.add('fa-volume-mute');

  audio.muted = true;
}

function unmuteSong() {
  muteBtn.querySelector('i.fas').classList.remove('fa-volume-mute');
  muteBtn.querySelector('i.fas').classList.add('fa-volume-up');

  audio.muted = false;
}

// Event Listeners
playBtn.addEventListener('click', playOrPause);

// Change song events
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);

progressBarContainer.addEventListener('click', setProgress);

audio.addEventListener('ended', nextSong);

audio.addEventListener('play', playSong);
audio.addEventListener('pause', pauseSong);

muteBtn.addEventListener('click', muteOrUnmute);

github.addEventListener('click', () => {
  window.open('https://github.com/patel-priyank/Music-Player');
});

window.addEventListener('keydown', (event) => {
  if (document.activeElement.tagName.toLowerCase() === 'button') {
    document.activeElement.blur();
  }

  switch (event.code) {
    case 'Space':
      if (event.target === document.body) {
        // prevent scrolling with Space
        event.preventDefault();
      }

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

    case 'KeyM':
      muteOrUnmute();
      break;
  }
});
