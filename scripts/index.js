// ==================== mainHomeNav ====================
let mainHomeNavItem1 = document.querySelector('.navItem:nth-child(1)');
mainHomeNavItem1.onclick = function() {
  clearFloatMenuClasses();
  clearMainBodyClasses();
  float.classList.add('onMenu');
  float.classList.remove('active');
  floatCover.classList.toggle('menuPaper');
  mainPaper.classList.add('onMainPaper');
  
  // 触发 Paper 入场动画
  setTimeout(() => {
    paperAnimation.animateEnter();
  }, 200);
}

// ==================== 导航控制 ====================
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
let floatMenuAbout = document.querySelector('.floatMenuAbout');
let floatMenuClose = document.querySelector('.floatMenuClose');

let mainHome = document.querySelector('.mainHome');
let mainPaper = document.querySelector('.mainPaper');
let mainPricetags = document.querySelector('.mainPricetags');
let mainFloder = document.querySelector('.mainFloder');
let mainBookmarks = document.querySelector('.mainBookmarks');
let mainAbout = document.querySelector('.mainAbout');

function clearFloatMenuClasses() {
  floatCover.classList.remove('menuHome', 'menuPaper', 'menuPricetags', 'menuFloder', 'menuBookmarks', 'menuAbout');
}

function clearMainBodyClasses() {
  mainHome.classList.remove('onMainHome');
  mainPaper.classList.remove('onMainPaper');
  mainPricetags.classList.remove('onMainPricetags');
  mainFloder.classList.remove('onMainFloder');
  mainBookmarks.classList.remove('onMainBookmarks');
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
  
  // 触发 Paper 入场动画
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


// ==================== Paper 动画模块 ====================
const paperAnimation = {
  isInitialized: false,
  currentTimeline: null,

  /**
   * 初始化 - 将文字拆分为单个字符span
   */
  init: function() {
    if (this.isInitialized) return;

    const paperItems = document.querySelectorAll('.mainPaperItem');
    
    // 检查是否有内容
    if (paperItems.length === 0) return;

    paperItems.forEach((item, index) => {
      const title = item.querySelector('.paperTitle');
      const desc = item.querySelector('.paperDesc');
      const date = item.querySelector('.paperDate');
      const tag = item.querySelector('.paperTag');

      // 拆分文字为单个字符
      if (title) this.splitText(title, 'title-char');
      if (desc) this.splitText(desc, 'desc-char');
      if (date) this.splitText(date, 'meta-char');
      if (tag) this.splitText(tag, 'meta-char');

      // 为每个item添加索引属性
      item.setAttribute('data-index', index);

      // 初始状态：隐藏所有字符
      const allChars = item.querySelectorAll('.text-char');
      allChars.forEach(char => {
        char.style.opacity = '0';
      });
    });

    // 绑定点击事件
    this.bindClickEvents();

    this.isInitialized = true;
  },

  /**
   * 拆分文字为单个字符
   */
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

  /**
   * 入场动画 - 当切换到 mainPaper 时触发
   */
  animateEnter: function() {
    // 确保已初始化
    if (!this.isInitialized) {
      this.init();
    }

    // 检查 anime 是否可用
    if (typeof anime === 'undefined') {
      console.warn('anime.js 未加载');
      return;
    }

    // 如果有正在进行的动画，先停止
    if (this.currentTimeline) {
      this.currentTimeline.pause();
    }

    // 重置所有字符状态
    const allChars = document.querySelectorAll('.mainPaperItem .text-char');
    allChars.forEach(char => {
      char.style.transform = '';
      char.style.opacity = '0';
    });

    // 重置所有item和footer状态
    const allItems = document.querySelectorAll('.mainPaperItem');
    allItems.forEach(item => {
      item.style.opacity = '1';
      const footer = item.querySelector('.mainPaperItemFooter');
      if (footer) {
        footer.style.opacity = '0';
        footer.style.transform = '';
      }
    });

    // 创建时间线动画
    this.currentTimeline = anime.timeline({
      easing: 'easeOutExpo'
    });

    const paperItems = document.querySelectorAll('.mainPaperItem');

    paperItems.forEach((item, index) => {
      const titleChars = item.querySelectorAll('.title-char');
      const descChars = item.querySelectorAll('.desc-char');
      const metaChars = item.querySelectorAll('.meta-char');
      const footer = item.querySelector('.mainPaperItemFooter');

      // 标题入场 - 从左侧滑入 + 缩放
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

      // 描述入场 - 从下方滑入
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

      // 元信息入场
      if (metaChars.length > 0) {
        this.currentTimeline.add({
          targets: metaChars,
          translateY: [20, 0],
          opacity: [0, 1],
          duration: 500,
          delay: anime.stagger(30, { start: 0 })
        }, index * 200 + 500);
      }

      // Footer 图标动画
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

  /**
   * 炸裂动画 - 点击链接时触发
   */
  animateExplode: function(item, callback) {
    if (typeof anime === 'undefined') {
      if (callback) callback();
      return;
    }

    const allChars = item.querySelectorAll('.text-char');
    const footer = item.querySelector('.mainPaperItemFooter');

    // 创建炸裂时间线
    const explodeTimeline = anime.timeline({
      easing: 'easeOutExpo',
      complete: () => {
        if (callback) callback();
      }
    });

    // 先给一个聚拢效果
    explodeTimeline.add({
      targets: allChars,
      scale: [1, 1.2],
      duration: 150,
      easing: 'easeInQuad'
    });

    // 然后炸裂
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

    // Footer 也一起炸裂
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

    // 整个item淡出
    explodeTimeline.add({
      targets: item,
      opacity: [1, 0],
      duration: 300
    }, '-=300');

    return explodeTimeline;
  },

  /**
   * 波浪动画 - 鼠标悬停效果
   */
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

      // 触发炸裂动画
      self.animateExplode(item, () => {
        // 动画结束后在新标签页打开
        if (href && href !== '#') {
          window.open(href, '_blank', 'noopener,noreferrer');
        }
        
        // 延迟重置item状态（因为用户还在当前页面）
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

  /**
   * 重置单个item状态
   */
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

  /**
   * 重置所有items
   */
  resetAll: function() {
    const items = document.querySelectorAll('.mainPaperItem');
    items.forEach(item => {
      this.resetItem(item);
    });
  }
};

// ==================== 页面加载后初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
  // 延迟初始化，确保 DOM 完全加载
  setTimeout(() => {
    paperAnimation.init();
  }, 100);
});