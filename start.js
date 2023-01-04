const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const songItem = $$(".song ");
const dashboard = $(".dashboard");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,

  songs: [
    {
      name: "Changes",
      singer: "XXXTENTACION",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5dLd9RmObc6yNSLORkaZHEfvbOdk43vhRFNKAYchT2y7QjJinG48xF_o02Jv72yC2S6c&usqp=CAU",
      path: "./files/Changes - XXXTENTACION.mp3",
      background: `rgb(255, 255, 255)`,
    },
    {
      name: "Justice",
      singer: "Justin Bieber",
      image:
        "https://i.pinimg.com/564x/39/10/9f/39109f90cfedf4b50313a9606aea8b86.jpg",
      path: "./files/Peaches - Justin Bieber_ Daniel Caesar_.mp3",
      background: `rgb(118, 252, 161)`,
    },
    {
      name: "Stay",
      singer: "The Kid LAROI, Justin Bieber",
      image: "https://f4.bcbits.com/img/a0725618779_10.jpg",
      path: "./files/Stay - The Kid LAROI_ Justin Bieber.mp3",
      background: `rgb(157, 217, 202)`,
    },
    {
      name: "Bad Guy",
      singer: "Billie Eilish",
      image:
        "https://i.pinimg.com/564x/75/75/d6/7575d6e44b578df756700942854d4d60.jpg",
      path: "./files/bad guy - Billie Eilish.mp3",
      background: `rgb(188, 145, 169)`,
    },
    {
      name: "Aage Chal",
      singer: "Raftaar",
      path: "https://mp3.vlcmusic.com/download.php?track_id=25791&format=320",
      image:
        "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg",
      background: `rgb(255, 255, 255)`,
    },
    {
      name: "Damn",
      singer: "Raftaar x kr$na",
      path: "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
      image:
        "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg",
      background: `rgb(255, 255, 255)`,
    },
    {
      name: "Feeling You",
      singer: "Raftaar x Harjas",
      path: "https://mp3.vlcmusic.com/download.php?track_id=27145&format=320",
      image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp",
      background: `rgb(255, 255, 255)`,
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
                      <div class="song ${
                        index === this.currentIndex ? "active" : ""
                      }" data-index="${index}">
                            <div class="thumb"  
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h options"></i>
                            </div>
                        </div>
                    `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defindProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    const cdThumbAnimate = cdThumb.animate([{ transform: `rotate(360deg)` }], {
      duration: 10000,
      iterations: Infinity,
    });
    window.onscroll = function (e) {
      const scrollTop = window.scrollY;
      const newCdWidth = cdWidth - scrollTop;
      console.log(newCdWidth);

      cd.style.width = newCdWidth > 0 ? `${newCdWidth}px` : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    cdThumbAnimate.pause();
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    progress.onchange = function (e) {
      // const seekTime = (audio.duration / 100) * e.target.value;
      // audio.currentTime = seekTime;
      audio.currentTime = progress.value;
    };
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      _this.render();
      _this.scrollToActiveSong();
      audio.play();
    };

    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      _this.render();
      _this.scrollToActiveSong();
      audio.play();
    };
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else nextBtn.click();
    };

    playlist.onclick = function (e) {
      const songNode = e.target;
      if (
        songNode.closest(".song:not(.active)") ||
        songNode.closest(".option")
      ) {
        if (songNode.matches(".song")) {
          console.log("working");
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
        if (songNode.matches(".options")) {
          console.log("working in options");
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 5000);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;

    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex > this.songs.length - 1) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    console.log(this.currentIndex);
    this.loadCurrentSong();
  },

  start: function () {
    this.render();
    this.defindProperties();
    this.handleEvents();
    this.loadCurrentSong();
  },
};
app.start();
