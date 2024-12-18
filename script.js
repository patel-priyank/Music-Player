const image = document.querySelector('img');
const title = document.querySelector('#title');
const artist = document.querySelector('#artist');
const music = document.querySelector('audio');
const progressContainer = document.querySelector('#progress-container');
const progress = document.querySelector('#progress');
const currentTimeElement = document.querySelector('#current-time');
const durationElement = document.querySelector('#duration');
const prevBtn = document.querySelector('#prev');
const playBtn = document.querySelector('#play');
const nextBtn = document.querySelector('#next');

// Music
const allMusic = [
  {
    name: 'jacinto-1',
    displayName: 'Electric Chill Machine',
    artist: 'Jacinto Design'
  },
  {
    name: 'jacinto-2',
    displayName: 'Seven Nation Army (Remix)',
    artist: 'Jacinto Design'
  },
  {
    name: 'jacinto-3',
    displayName: 'Goodnight, Disco Queen',
    artist: 'Jacinto Design'
  },
  {
    name: 'metric-1',
    displayName: 'Front Row (Remix)',
    artist: 'Metric/Metric'
  }
];

// Check if playing
let isPlaying = true;

// Play
const playMusic = () => {
  isPlaying = true;
  playBtn.classList.replace('fa-circle-play', 'fa-circle-pause');
  playBtn.setAttribute('title', 'Pause');
  music.play();
};

// Pause
const pauseMusic = () => {
  isPlaying = false;
  playBtn.classList.replace('fa-circle-pause', 'fa-circle-play');
  playBtn.setAttribute('title', 'Play');
  music.pause();
};

// Play or Pause Event Listener
playBtn.addEventListener('click', () => (isPlaying ? pauseMusic() : playMusic()));

// Update DOM
const loadMusic = musicToLoad => {
  title.textContent = musicToLoad.displayName;
  artist.textContent = musicToLoad.artist;
  music.src = `./music/${musicToLoad.name}.mp3`;
  image.src = `./img/${musicToLoad.name}.jpg`;
};

// Current Music
let musicIndex = Math.floor(Math.random() * allMusic.length);

// Previous Music
const prevMusic = () => {
  const currentTime = music.currentTime;
  const currentTimeMinutes = Math.floor(currentTime / 60);
  const currentTimeSeconds = Math.floor(currentTime % 60);

  // Restart music if more than 5 seconds have elapsed else play previous music
  if (currentTimeMinutes === 0 && currentTimeSeconds <= 5) {
    musicIndex--;
    if (musicIndex < 0) {
      musicIndex = allMusic.length - 1;
    }
    loadMusic(allMusic[musicIndex]);
    playMusic();
  } else {
    music.currentTime = 0;
  }
};

// Next Music
const nextMusic = () => {
  musicIndex++;
  if (musicIndex > allMusic.length - 1) {
    musicIndex = 0;
  }
  loadMusic(allMusic[musicIndex]);
  playMusic();
};

// Update Progress Bar & Time
const updateProgressBar = () => {
  if (isPlaying) {
    const { duration, currentTime } = music;

    // Update progress bar width
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    // Calculate display for duration
    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = Math.floor(duration % 60);
    const durationSecondsText = durationSeconds < 10 ? `0${durationSeconds}` : durationSeconds;

    // Delay switching duration element to avoid NaN
    if (durationSeconds) {
      durationElement.textContent = `${durationMinutes}:${durationSecondsText}`;
    } else {
      durationElement.textContent = '0:00';
    }

    // Calculate display for current time
    const currentTimeMinutes = Math.floor(currentTime / 60);
    const currentTimeSeconds = Math.floor(currentTime % 60);
    const currentTimeSecondsText = currentTimeSeconds < 10 ? `0${currentTimeSeconds}` : currentTimeSeconds;
    currentTimeElement.textContent = `${currentTimeMinutes}:${currentTimeSecondsText}`;
  }
};

// Set Progress
const setProgress = event => {
  const width = progressContainer.clientWidth;
  const clickPosition = event.offsetX;
  const duration = music.duration;
  music.currentTime = (clickPosition / width) * duration;
};

// Event Listeners
prevBtn.addEventListener('click', prevMusic);
nextBtn.addEventListener('click', nextMusic);
music.addEventListener('ended', nextMusic);
music.addEventListener('timeupdate', updateProgressBar);
progressContainer.addEventListener('click', setProgress);

// On Load - Select First Music
loadMusic(allMusic[musicIndex]);
updateProgressBar();
isPlaying = false;
