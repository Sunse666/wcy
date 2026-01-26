(function() {
  function init() {
    const loading = document.getElementById('loading');
    const float = document.querySelector('.float');
    
    if (!loading) return;

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

    if (document.readyState === 'complete') {
      hideLoading();
    } else {
      window.addEventListener('load', hideLoading);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();