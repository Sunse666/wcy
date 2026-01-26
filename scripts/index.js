let float = document.querySelector('.float');
let floatCover = document.querySelector('.floatCover');
floatCover.onclick = function() {
  float.classList.toggle('active');
}

let floatMenuHome = document.querySelector('.floatMenuHome');
let floatMenuPaper = document.querySelector('.floatMenuPaper');
let floatMenuPricetags = document.querySelector('.floatMenuPricetags');
let floatMenuFloder = document.querySelector('.floatMenuFloder');
let floatMenuBookmarks = document.querySelector('.floatMenuBookmarks');
let floatMenuPalette = document.querySelector('.floatMenuPalette');
let floatMenuAbout = document.querySelector('.floatMenuAbout');
let floatMenuClose = document.querySelector('.floatMenuClose');

let mainHome = document.querySelector('.mainHome');
let mainPaper = document.querySelector('.mainPaper');
let mainPricetags = document.querySelector('.mainPricetags');
let mainFloder = document.querySelector('.mainFloder');
let mainBookmarks = document.querySelector('.mainBookmarks');
let mainPalette = document.querySelector('.mainPalette');
let mainAbout = document.querySelector('.mainAbout');

function clearFloatMenuClasses() {
  floatCover.classList.remove('menuHome', 'menuPaper', 'menuPricetags', 'menuFloder', 'menuBookmarks', 'menuPalette', 'menuAbout');
}

function clearMainBodyClasses() {
  mainHome.classList.remove('onMainHome');
  mainPaper.classList.remove('onMainPaper');
  mainPricetags.classList.remove('onMainPricetags');
  mainFloder.classList.remove('onMainFloder');
  mainBookmarks.classList.remove('onMainBookmarks');
  mainPalette.classList.remove('onMainPalette');
  mainAbout.classList.remove('onMainAbout');
}

floatMenuHome.onclick = function() {
  clearFloatMenuClasses();
  clearMainBodyClasses();
  float.classList.add('onMenu');
  float.classList.remove('active');
  floatCover.classList.toggle('menuHome');
  mainHome.classList.add('onMainHome');
}

floatMenuPaper.onclick = function() {
  clearFloatMenuClasses();
  clearMainBodyClasses();
  float.classList.add('onMenu');
  float.classList.remove('active');
  floatCover.classList.toggle('menuPaper');
  mainPaper.classList.add('onMainPaper');
  
  setTimeout(() => {
    paperAnimation.animateEnter();
  }, 200);
}

floatMenuPricetags.onclick = function() {
  clearFloatMenuClasses();
  clearMainBodyClasses();
  float.classList.add('onMenu');
  float.classList.remove('active');
  floatCover.classList.toggle('menuPricetags');
  mainPricetags.classList.add('onMainPricetags');
}

floatMenuFloder.onclick = function() {
  clearFloatMenuClasses();
  clearMainBodyClasses();
  float.classList.add('onMenu');
  float.classList.remove('active');
  floatCover.classList.toggle('menuFloder');
  mainFloder.classList.add('onMainFloder');
}

floatMenuBookmarks.onclick = function() {
  clearFloatMenuClasses();
  clearMainBodyClasses();
  float.classList.add('onMenu');
  float.classList.remove('active');
  floatCover.classList.toggle('menuBookmarks');
  mainBookmarks.classList.add('onMainBookmarks');
}

floatMenuPalette.onclick = function() {
  clearFloatMenuClasses();
  clearMainBodyClasses();
  float.classList.add('onMenu');
  float.classList.remove('active');
  floatCover.classList.toggle('menuPalette');
  mainPalette.classList.add('onMainPalette');
}

floatMenuAbout.onclick = function() {
  clearFloatMenuClasses();
  clearMainBodyClasses();
  float.classList.add('onMenu');
  float.classList.remove('active');
  floatCover.classList.toggle('menuAbout');
  mainAbout.classList.add('onMainAbout');
}

floatMenuClose.onclick = function() {
  clearFloatMenuClasses();
  clearMainBodyClasses();
  float.classList.remove('onMenu');
  float.classList.remove('active');
}

const paperAnimation = {
  isInitialized: false,
  currentTimeline: null,
  init: function() {
    if (this.isInitialized) return;
    const paperItems = document.querySelectorAll('.mainPaperItem');
    if (paperItems.length === 0) return;

    paperItems.forEach((item, index) => {
      const title = item.querySelector('.paperTitle');
      const desc = item.querySelector('.paperDesc');
      const date = item.querySelector('.paperDate');
      const tag = item.querySelector('.paperTag');
      
      if (title) this.splitText(title, 'title-char');
      if (desc) this.splitText(desc, 'desc-char');
      if (date) this.splitText(date, 'meta-char');
      if (tag) this.splitText(tag, 'meta-char');

      item.setAttribute('data-index', index);

      const allChars = item.querySelectorAll('.text-char');
      allChars.forEach(char => {
        char.style.opacity = '0';
      });
    });
    this.bindClickEvents();

    this.isInitialized = true;
  },

  splitText: function(element, className) {
    if (!element) return;

    const text = element.textContent;
    element.innerHTML = '';

    for (let i = 0; i < text.length; i++) {
      const span = document.createElement('span');
      span.className = `text-char ${className}`;
      
      if (text[i] === ' ') {
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = text[i];
      }

      element.appendChild(span);
    }
  },

  animateEnter: function() {
    if (!this.isInitialized) {
      this.init();
    }

    if (typeof anime === 'undefined') {
      console.warn('anime.js 未加载');
      return;
    }

    if (this.currentTimeline) {
      this.currentTimeline.pause();
    }

    const allChars = document.querySelectorAll('.mainPaperItem .text-char');
    allChars.forEach(char => {
      char.style.transform = '';
      char.style.opacity = '0';
    });

    const allItems = document.querySelectorAll('.mainPaperItem');
    allItems.forEach(item => {
      item.style.opacity = '1';
      const footer = item.querySelector('.mainPaperItemFooter');
      if (footer) {
        footer.style.opacity = '0';
        footer.style.transform = '';
      }
    });

    this.currentTimeline = anime.timeline({
      easing: 'easeOutExpo'
    });

    const paperItems = document.querySelectorAll('.mainPaperItem');

    paperItems.forEach((item, index) => {
      const titleChars = item.querySelectorAll('.title-char');
      const descChars = item.querySelectorAll('.desc-char');
      const metaChars = item.querySelectorAll('.meta-char');
      const footer = item.querySelector('.mainPaperItemFooter');

      if (titleChars.length > 0) {
        this.currentTimeline.add({
          targets: titleChars,
          translateX: [-100, 0],
          translateY: [-30, 0],
          scale: [0.5, 1],
          opacity: [0, 1],
          rotateZ: [-15, 0],
          duration: 800,
          delay: anime.stagger(40, { start: 0 })
        }, index * 200);
      }

      if (descChars.length > 0) {
        this.currentTimeline.add({
          targets: descChars,
          translateY: [40, 0],
          translateX: [-20, 0],
          opacity: [0, 1],
          duration: 600,
          delay: anime.stagger(25, { start: 0 })
        }, index * 200 + 300);
      }

      if (metaChars.length > 0) {
        this.currentTimeline.add({
          targets: metaChars,
          translateY: [20, 0],
          opacity: [0, 1],
          duration: 500,
          delay: anime.stagger(30, { start: 0 })
        }, index * 200 + 500);
      }

      if (footer) {
        this.currentTimeline.add({
          targets: footer,
          translateX: [50, 0],
          opacity: [0, 1],
          duration: 400,
          easing: 'easeOutBack'
        }, index * 200 + 600);
      }
    });

    return this.currentTimeline;
  },

  animateExplode: function(item, callback) {
    if (typeof anime === 'undefined') {
      if (callback) callback();
      return;
    }

    const allChars = item.querySelectorAll('.text-char');
    const footer = item.querySelector('.mainPaperItemFooter');

    const explodeTimeline = anime.timeline({
      easing: 'easeOutExpo',
      complete: () => {
        if (callback) callback();
      }
    });

    explodeTimeline.add({
      targets: allChars,
      scale: [1, 1.2],
      duration: 150,
      easing: 'easeInQuad'
    });

    explodeTimeline.add({
      targets: allChars,
      translateX: () => anime.random(-600, 600),
      translateY: () => anime.random(-400, 400),
      translateZ: () => anime.random(-200, 200),
      rotateX: () => anime.random(-360, 360),
      rotateY: () => anime.random(-360, 360),
      rotateZ: () => anime.random(-720, 720),
      scale: [1.2, 0],
      opacity: [1, 0],
      duration: 1200,
      delay: anime.stagger(15, { 
        from: 'center',
        grid: [10, 5]
      })
    });

    if (footer) {
      explodeTimeline.add({
        targets: footer,
        translateX: anime.random(200, 400),
        translateY: anime.random(-200, 200),
        rotateZ: anime.random(-180, 180),
        scale: [1, 0],
        opacity: [1, 0],
        duration: 800
      }, '-=1000');
    }

    explodeTimeline.add({
      targets: item,
      opacity: [1, 0],
      duration: 300
    }, '-=300');

    return explodeTimeline;
  },

  animateWave: function(item) {
    if (typeof anime === 'undefined') return;

    const titleChars = item.querySelectorAll('.title-char');

    if (titleChars.length > 0) {
      anime({
        targets: titleChars,
        translateY: [
          { value: -8, duration: 200 },
          { value: 0, duration: 400 }
        ],
        delay: anime.stagger(30),
        easing: 'easeOutElastic(1, .5)'
      });
    }
  },

bindClickEvents: function() {
  const self = this;
  const footerLinks = document.querySelectorAll('.mainPaperItemFooter a');

  footerLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const item = this.closest('.mainPaperItem');
      const href = this.getAttribute('href');

      self.animateExplode(item, () => {
        if (href && href !== '#') {
          window.open(href, '_blank', 'noopener,noreferrer');
        }
        
        setTimeout(() => {
          self.resetItem(item);
        }, 300);
      });
    });
  });

  const paperItems = document.querySelectorAll('.mainPaperItem');
  paperItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      self.animateWave(this);
    });
  });
},

  resetItem: function(item) {
    if (typeof anime === 'undefined') return;

    item.style.opacity = '1';
    
    const allChars = item.querySelectorAll('.text-char');
    const footer = item.querySelector('.mainPaperItemFooter');

    anime.set(allChars, {
      translateX: 0,
      translateY: 0,
      translateZ: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
      opacity: 1
    });

    if (footer) {
      anime.set(footer, {
        translateX: 0,
        translateY: 0,
        rotateZ: 0,
        scale: 1,
        opacity: 1
      });
    }
  },

  resetAll: function() {
    const items = document.querySelectorAll('.mainPaperItem');
    items.forEach(item => {
      this.resetItem(item);
    });
  }
};

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    paperAnimation.init();
  }, 100);
});