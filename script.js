document.addEventListener("DOMContentLoaded", () => {
  feather.replace();

  const playPauseButton = document.getElementById("play-pause");
  const audio = document.getElementById("audio");
  const songDuration = document.getElementById("song-duration");
  const lyricsContainer = document.getElementById("lyrics-container");

  const lyrics = [
    { time: 0, text: "I'm getting stronger", pageIndex: 1 },
    { time: 3, text: "I'm getting stronger", pageIndex: 2 },
    { time: 7, text: "A little longer", pageIndex: 3 },
    { time: 10, text: "I'm getting stronger", pageIndex: 4 },
    { time: 15, text: "Now I finally found my wings", pageIndex: 5 },
    { time: 21, text: "I let go of everything", pageIndex: 6 },
    { time: 25, text: "Decided to follow my heart", pageIndex: 7 },
    { time: 30, text: "I don't care what they say?", pageIndex: 8 },
    { time: 33, text: "My life is not a game", pageIndex: 9 },
    { time: 36, text: "Never gon' run away", pageIndex: 10 },
    { time: 39, text: "So don't wake me up", pageIndex: 11 },
    { time: 41, text: "Finally able to breathe", pageIndex: 12 },
    { time: 45, text: "Yeah, yeah, yeah", pageIndex: 12 },
    { time: 46, text: "Can't wake me up", pageIndex: 13 },
    { time: 49, text: "Nothing can wake me up", pageIndex: 14 },
    { time: 53, text: "I'm waking up on my dream", pageIndex: 15 },
    { time: 57, text: "BABYMONS7ER - DREAM", pageIndex: 16 },
  ];

  playPauseButton.addEventListener("click", () => {
    togglePlay();
  });

  function togglePlay() {
    if (audio.paused) {
      audio.play();
      playPauseButton.innerHTML = '<i data-feather="pause"></i>';
      feather.replace();
      displayDuration();
      syncLyricsWithPhotos();
    } else {
      audio.pause();
      playPauseButton.innerHTML = '<i data-feather="play"></i>';
      feather.replace();
      clearInterval(lyricsInterval);
    }
  }

  function displayDuration() {
    audio.addEventListener("loadedmetadata", () => {
      const duration = formatTime(audio.duration);
      songDuration.textContent = duration;
    });

    audio.addEventListener("timeupdate", () => {
      const currentTime = formatTime(audio.currentTime);
      const duration = formatTime(audio.duration);
      songDuration.textContent = currentTime + " / " + duration;
    });
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  function preloadImages(pages) {
    return new Promise((resolve) => {
      let loadedCount = 0;
      const totalImages = pages.length;

      pages.forEach((page) => {
        const img = page.querySelector("img");
        if (img.complete) {
          loadedCount++;
          if (loadedCount === totalImages) resolve();
        } else {
          img.onload = () => {
            loadedCount++;
            if (loadedCount === totalImages) resolve();
          };
        }
      });
    });
  }

  const rightPages = document.querySelectorAll(".right-page");
  let currentPage = 0;

  function showPage(pageIndex) {
    rightPages.forEach((page, index) => {
      if (index === pageIndex) {
        page.style.transform = "rotateY(0deg)";
        page.style.zIndex = 2;
        page.style.visibility = "visible";
      } else if (index < pageIndex) {
        page.style.transform = "rotateY(-180deg)";
        page.style.zIndex = 1;
        page.style.visibility = "visible";
      } else {
        page.style.transform = "rotateY(0deg)";
        page.style.zIndex = 0;
        page.style.visibility = "visible";
      }
    });

    if (pageIndex < rightPages.length - 1) {
      rightPages[pageIndex + 1].style.transform = "rotateY(0deg)";
      rightPages[pageIndex + 1].style.zIndex = 1;
      rightPages[pageIndex + 1].style.visibility = "visible";
    }
  }

  function syncLyricsWithPhotos() {
    let lyricsIndex = 0;

    lyricsInterval = setInterval(() => {
      const currentTime = audio.currentTime;

      // Check if it's time to change the lyric and photo
      if (lyricsIndex < lyrics.length && currentTime >= lyrics[lyricsIndex].time) {
        // Update the lyrics text
        lyricsContainer.textContent = lyrics[lyricsIndex].text;

        // Show the corresponding photo page
        showPage(lyrics[lyricsIndex].pageIndex);

        // Move to the next lyric for the next interval check
        lyricsIndex++;
      }

      // Stop the interval if all lyrics are done
      if (lyricsIndex >= lyrics.length) {
        clearInterval(lyricsInterval);
      }
    }, 100); // Check every 100 milliseconds for smoother transitions
  }

  preloadImages(rightPages).then(() => {
    showPage(currentPage); // Display the first page initially
  });

  audio.addEventListener("pause", () => {
    clearInterval(lyricsInterval); // Stop the sync when audio is paused
  });

  audio.addEventListener("ended", () => {
    clearInterval(lyricsInterval); // Stop sync when audio ends
    playPauseButton.innerHTML = '<i data-feather="play"></i>';
    feather.replace();
  });
});
