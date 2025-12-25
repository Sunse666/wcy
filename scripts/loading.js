(function() {
  // 初始化函数
  function init() {
    const loading = document.getElementById('loading');
    const float = document.querySelector('.float');
    
    if (!loading) return; // 防止元素不存在

    function hideLoading() {
      setTimeout(function() {
        loading.classList.add('loaded');

        setTimeout(function() {
          loading.remove();

          setTimeout(function() {
            float.classList.add('onMenu');
          }, 0);
          
          setTimeout(function() {
            float.classList.add('active');
          }, 425);
        }, 500);
      }, 1500);
    }

    // 检查 load 事件是否已触发
    if (document.readyState === 'complete') {
      hideLoading();
    } else {
      window.addEventListener('load', hideLoading);
    }
  }

  // 检查 DOMContentLoaded 是否已触发
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();