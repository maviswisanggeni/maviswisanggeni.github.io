{
  const body = document.body;
  const tl = gsap.timeline();

  tl.from(".line span", 1.8, {
    y: 100,
    ease: "power4.out",
    delay: 1,
    skewY: 7,
    stagger: {
      amount: 0.3,
    },
  });

  const MathUtils = {
    lerp: (a, b, n) => (1 - n) * a + n * b,
    distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
  };

  const getMousePos = (ev) => {
    let posx = 0;
    let posy = 0;
    if (!ev) ev = window.event;
    if (ev.pageX || ev.pageY) {
      posx = ev.pageX;
      posy = ev.pageY;
    } else if (ev.clientX || ev.clientY) {
      posx = ev.clientX + body.scrollLeft + docEl.scrollLeft;
      posy = ev.clientY + body.scrollTop + docEl.scrollTop;
    }
    return { x: posx, y: posy };
  };

  let mousePos = (lastMousePos = cacheMousePos = { x: 0, y: 0 });

  window.addEventListener("mousemove", (ev) => (mousePos = getMousePos(ev)));

  const getMouseDistance = () =>
    MathUtils.distance(mousePos.x, mousePos.y, lastMousePos.x, lastMousePos.y);

  class Image {
    constructor(el) {
      this.DOM = { el: el };
      this.defaultStyle = {
        scale: 1,
        x: 0,
        y: 0,
        opacity: 0,
      };
      this.getRect();
    }

    getRect() {
      this.rect = this.DOM.el.getBoundingClientRect();
    }

    isActive() {
      return gsap.isTweening(this.DOM.el) || this.DOM.el.style.opacity != 0;
    }
  }

  class ImageTrail {
    constructor() {
      this.DOM = { content: document.querySelector(".content") };
      this.images = [];
      [...this.DOM.content.querySelectorAll("img")].forEach((img) =>
        this.images.push(new Image(img))
      );
      this.imagesTotal = this.images.length;
      this.imgPosition = 0;
      this.zIndexVal = 1;
      this.threshold = 120;
      requestAnimationFrame(() => this.render());
    }

    render() {
      let distance = getMouseDistance();
      cacheMousePos.x = MathUtils.lerp(
        cacheMousePos.x || mousePos.x,
        mousePos.x,
        0.1
      );
      cacheMousePos.y = MathUtils.lerp(
        cacheMousePos.y || mousePos.y,
        mousePos.y,
        0.1
      );

      if (distance > this.threshold) {
        this.showNextImage();
        ++this.zIndexVal;
        this.imgPosition =
          this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;

        lastMousePos = mousePos;
      }

      let isIdle = true;
      for (let img of this.images) {
        if (img.isActive()) {
          isIdle = false;
          break;
        }
      }
      if (isIdle && this.zIndexVal !== 1) {
        this.zIndexVal = 1;
      }

      requestAnimationFrame(() => this.render());
    }

    showNextImage() {
      const img = this.images[this.imgPosition];
      gsap.killTweensOf(img.DOM.el);

      gsap
        .timeline()
        .set(
          img.DOM.el,
          {
            startAt: { opacity: 0, scale: 1 },
            opacity: 1,
            scale: 1,
            zIndex: this.zIndexVal,
            x: cacheMousePos.x - img.rect.width / 2,
            y: cacheMousePos.y - img.rect.height / 2,
          },
          0
        )
        .to(
          img.DOM.el,
          0.9,
          {
            ease: "expo.out",
            x: mousePos.x - img.rect.width / 2,
            y: mousePos.y - img.rect.height / 2,
          },
          0
        )
        .to(
          img.DOM.el,
          1,
          {
            ease: "power1.out",
            opacity: 0,
          },
          0.4
        )
        .to(
          img.DOM.el,
          1,
          {
            ease: "quint.out",
            scale: 0.2,
          },
          0.4
        );
    }
  }

  const preloadImages = () => {
    return new Promise((resolve, reject) => {
      imagesLoaded(document.querySelectorAll(".content__img"), resolve);
    });
  };

  preloadImages().then(() => {
    new ImageTrail();
  });
}

var documentTitle = document.title + " ― ";

(function titleMarquee() {
  document.title = documentTitle =
    documentTitle.substring(1) + documentTitle.substring(0, 1);
  setTimeout(titleMarquee, 300);
})();

// const cv = document.querySelector(".cv");

// gsap.fromTo(
//   cv,
//   { opacity: 0 },
//   { opacity: 1, duration: 0.5, delay: 2, ease: "expo.out" }
// );

// cv.addEventListener("mouseover", () => {
//   cv.innerHTML = "Open";
// });

// cv.addEventListener("mouseout", () => {
//   cv.innerHTML = "CV";
// });

// cv.addEventListener("click", () => {
//   window.open("assets/cv.pdf", "_blank");
// });

document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("bg-audio");
  const audioToggle = document.getElementById("audio-toggle");

  gsap.fromTo(
    audioToggle,
    { opacity: 0 },
    { opacity: 1, duration: 0.2, delay: 2, ease: "expo.out" }
  );

  let isPlaying = false;

  function toggleAudio() {
    if (isPlaying) {
      audio.pause();
      audioToggle.textContent = "▶";
    } else {
      audio.play().catch((error) => {
        console.log("Autoplay gagal, menunggu interaksi user...");
      });
      audioToggle.textContent = "❚❚";
    }
    isPlaying = !isPlaying;
  }

  audioToggle.addEventListener("click", toggleAudio);

  audio.muted = false;
});

const works = document.querySelector(".works");

gsap.fromTo(
  works,
  { opacity: 0 },
  { opacity: 1, duration: 0.5, delay: 2, ease: "expo.out" }
);

works.addEventListener("mouseover", () => {
  works.innerHTML = "Open";
});

works.addEventListener("mouseout", () => {
  works.innerHTML = "Works";
});

works.addEventListener("click", () => {
  window.open("https://orrisyn.netlify.app/", "_blank");
});