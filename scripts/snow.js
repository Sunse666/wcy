document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("snowCanvas");
  const ctx = canvas.getContext("2d");

  // === 配置项 ===
  const config = {
    numFlakes: 250,
    windSpeed: 0.3,
    flakeSizeMin: 1,
    flakeSizeMax: 5,
    fallSpeedMin: 0.5,
    fallSpeedMax: 2.5,
    opacityMin: 0.3,
    opacityMax: 1.0,
    colors: ["#ffffff", "#f0f8ff", "#e6f3ff", "#f5f0ff"],
    enableRandomColor: true,
    enableRandomOpacity: true,
    enabled: true  // 雪花开关
  };

  // 预设主题配置
  const themes = {
    winter: {
      name: "冬日白雪",
      colors: ["#ffffff", "#f0f8ff", "#e5f2ff", "#f3ecff", "#ffebeb", "#e9ffe9", "#fff8ea"],
      opacityMin: 0.4,
      opacityMax: 1.0
    },
    romantic: {
      name: "浪漫粉色",
      colors: ["#ffb6c1", "#ffc0cb", "#ff69b4", "#fff0f5", "#ffffff", "#ffe4e9"],
      opacityMin: 0.5,
      opacityMax: 0.95
    },
    rainbow: {
      name: "梦幻彩虹",
      colors: ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#54a0ff", "#5f27cd", "#00d2d3", "#1dd1a1"],
      opacityMin: 0.6,
      opacityMax: 1.0
    },
    christmas: {
      name: "金色圣诞",
      colors: ["#ffd700", "#ff4444", "#ffffff", "#00aa00", "#ffcc00", "#ff6b6b"],
      opacityMin: 0.5,
      opacityMax: 1.0
    },
    aurora: {
      name: "极光之夜",
      colors: ["#00ffcc", "#00ff99", "#33ffcc", "#66ffcc", "#99ffff", "#ccffff", "#00ffaa"],
      opacityMin: 0.4,
      opacityMax: 0.9
    },
    sakura: {
      name: "樱花飘落",
      colors: ["#ffb7c5", "#ffc0cb", "#ffd1dc", "#ffe4e9", "#fff0f5", "#ffb6c1"],
      opacityMin: 0.5,
      opacityMax: 0.95
    }
  };

  let currentTheme = "winter";
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  let flakes = [];
  let animationId = null;

  // 获取随机颜色
  function getRandomColor() {
    if (!config.enableRandomColor) return "#ffffff";
    return config.colors[Math.floor(Math.random() * config.colors.length)];
  }

  // 获取随机透明度
  function getRandomOpacity() {
    if (!config.enableRandomOpacity) return config.opacityMax;
    return Math.random() * (config.opacityMax - config.opacityMin) + config.opacityMin;
  }

  // 创建雪花
  function createFlake() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * (config.flakeSizeMax - config.flakeSizeMin) + config.flakeSizeMin,
      vx: Math.sin(Math.random() * 2 * Math.PI) * config.windSpeed,
      vy: Math.random() * (config.fallSpeedMax - config.fallSpeedMin) + config.fallSpeedMin,
      angle: Math.random() * 2 * Math.PI,
      opacity: getRandomOpacity(),
      color: getRandomColor()
    };
  }

  // 初始化雪花
  function initFlakes() {
    flakes = [];
    for (let i = 0; i < config.numFlakes; i++) {
      flakes.push(createFlake());
    }
  }

  // 绘制雪花
  function drawFlakes() {
    ctx.clearRect(0, 0, width, height);

    flakes.forEach(flake => {
      ctx.save();
      ctx.globalAlpha = flake.opacity;
      ctx.fillStyle = flake.color;
      ctx.translate(flake.x, flake.y);
      ctx.rotate(flake.angle);
      ctx.beginPath();
      ctx.arc(0, 0, flake.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      flake.x += flake.vx;
      flake.y += flake.vy;
      flake.angle += 0.01;

      if (flake.y > height) {
        flake.x = Math.random() * width;
        flake.y = -flake.r;
        flake.angle = Math.random() * 2 * Math.PI;
        flake.opacity = getRandomOpacity();
        flake.color = getRandomColor();
      }

      if (flake.x > width + flake.r) {
        flake.x = -flake.r;
      } else if (flake.x < -flake.r) {
        flake.x = width + flake.r;
      }
    });
  }

  // 动画循环
  function animateSnow() {
    if (!config.enabled) {
      ctx.clearRect(0, 0, width, height);
      return;
    }
    drawFlakes();
    animationId = requestAnimationFrame(animateSnow);
  }

  // 应用主题
  function applyTheme(themeName) {
    if (themeName === "none") {
      config.enabled = false;
      ctx.clearRect(0, 0, width, height);
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    } else if (themes[themeName]) {
      const theme = themes[themeName];
      config.colors = theme.colors;
      config.opacityMin = theme.opacityMin;
      config.opacityMax = theme.opacityMax;
      config.enabled = true;
      currentTheme = themeName;

      // 更新所有雪花
      flakes.forEach(flake => {
        flake.color = getRandomColor();
        flake.opacity = getRandomOpacity();
      });

      // 如果动画未运行，启动它
      if (!animationId) {
        animateSnow();
      }
    }

    // 保存到本地存储
    localStorage.setItem("snowTheme", themeName);
    
    // 更新UI
    updateThemeUI(themeName);
  }

  // 更新主题UI状态
  function updateThemeUI(themeName) {
    document.querySelectorAll(".snowThemeItem").forEach(item => {
      item.classList.remove("active");
      if (item.dataset.theme === themeName) {
        item.classList.add("active");
      }
    });
  }

  // 初始化主题选择器
  function initThemeSelector() {
    const panel = document.getElementById("snowThemePanel");
    const toggle = document.getElementById("snowThemeToggle");
    const themeItems = document.querySelectorAll(".snowThemeItem");

    if (!panel || !toggle) return;

    // 切换面板显示
    toggle.addEventListener("click", function(e) {
      e.stopPropagation();
      panel.classList.toggle("active");
    });

    // 点击主题项
    themeItems.forEach(item => {
      item.addEventListener("click", function() {
        const themeName = this.dataset.theme;
        applyTheme(themeName);
        
        // 延迟关闭面板
        setTimeout(() => {
          panel.classList.remove("active");
        }, 300);
      });
    });

    // 点击外部关闭面板
    document.addEventListener("click", function(e) {
      if (!panel.contains(e.target)) {
        panel.classList.remove("active");
      }
    });

    // 读取保存的主题
    const savedTheme = localStorage.getItem("snowTheme");
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      applyTheme("winter");
    }
  }

  // 初始化
  initFlakes();
  initThemeSelector();
  animateSnow();

  // 窗口调整
  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // 暴露全局API
  window.SnowEffect = {
    setTheme: applyTheme,
    getTheme: () => currentTheme,
    getThemes: () => Object.keys(themes),
    toggle: () => {
      if (config.enabled) {
        applyTheme("none");
      } else {
        applyTheme(currentTheme);
      }
    },
    setColors: (colors) => {
      config.colors = colors;
      flakes.forEach(f => f.color = getRandomColor());
    },
    setOpacity: (min, max) => {
      config.opacityMin = min;
      config.opacityMax = max;
      flakes.forEach(f => f.opacity = getRandomOpacity());
    }
  };
});