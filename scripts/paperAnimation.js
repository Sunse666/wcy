const paperAnimation = {
  isInitialized: false,
  currentTimeline: null,
  explodingItems: new Set(),

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

    this.resetAll();

    const allChars = document.querySelectorAll('.mainPaperItem .text-char');
    allChars.forEach(char => {
      char.style.opacity = '0';
      char.style.transform = '';
    });

    const allFooters = document.querySelectorAll('.mainPaperItemFooter');
    allFooters.forEach(footer => {
      footer.style.opacity = '0';
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

    const itemIndex = item.getAttribute('data-index');
    if (this.explodingItems.has(itemIndex)) {
      return;
    }
    this.explodingItems.add(itemIndex);

    item.classList.add('exploding');

    const allChars = item.querySelectorAll('.text-char');
    const footer = item.querySelector('.mainPaperItemFooter');

    const explodeTimeline = anime.timeline({
      easing: 'easeOutExpo',
      complete: () => {
        this.explodingItems.delete(itemIndex);
        item.classList.remove('exploding');
        
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
      translateX: () => anime.random(-300, 300),
      translateY: () => anime.random(-200, 200),
      rotateZ: () => anime.random(-360, 360),
      scale: [1.2, 0],
      opacity: [1, 0],
      duration: 800,
      delay: anime.stagger(10, { 
        from: 'center'
      })
    });

    if (footer) {
      explodeTimeline.add({
        targets: footer,
        translateX: anime.random(100, 200),
        translateY: anime.random(-100, 100),
        rotateZ: anime.random(-90, 90),
        scale: [1, 0],
        opacity: [1, 0],
        duration: 600
      }, '-=600');
    }

    return explodeTimeline;
  },

  animateWave: function(item) {
    if (typeof anime === 'undefined') return;
    
    const itemIndex = item.getAttribute('data-index');
    if (this.explodingItems.has(itemIndex)) return;

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
          setTimeout(() => {
            self.resetItem(item);
          }, 100);
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

    anime.remove(item.querySelectorAll('.text-char'));
    anime.remove(item.querySelector('.mainPaperItemFooter'));

    item.style.opacity = '1';
    item.style.transform = '';
    item.classList.remove('exploding');
    
    const allChars = item.querySelectorAll('.text-char');
    allChars.forEach(char => {
      char.style.transform = 'translateX(0) translateY(0) translateZ(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)';
      char.style.opacity = '1';
    });

    const footer = item.querySelector('.mainPaperItemFooter');
    if (footer) {
      footer.style.transform = 'translateX(0) translateY(0) rotateZ(0deg) scale(1)';
      footer.style.opacity = '1';
    }
  },

  resetAll: function() {
    const items = document.querySelectorAll('.mainPaperItem');
    items.forEach(item => {
      this.resetItem(item);
    });
    this.explodingItems.clear();
  }
};

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    paperAnimation.init();
  }, 100);
});