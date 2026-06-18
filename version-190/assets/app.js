(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var previousButton = document.querySelector('[data-hero-prev]');
  var nextButton = document.querySelector('[data-hero-next]');
  var heroIndex = 0;
  var heroTimer;

  function showHero(index) {
    if (!slides.length) {
      return;
    }

    heroIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === heroIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === heroIndex);
    });
  }

  function restartHero() {
    if (heroTimer) {
      window.clearInterval(heroTimer);
    }

    if (slides.length > 1) {
      heroTimer = window.setInterval(function () {
        showHero(heroIndex + 1);
      }, 5200);
    }
  }

  if (slides.length) {
    showHero(0);
    restartHero();

    if (previousButton) {
      previousButton.addEventListener('click', function () {
        showHero(heroIndex - 1);
        restartHero();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        showHero(heroIndex + 1);
        restartHero();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showHero(dotIndex);
        restartHero();
      });
    });
  }

  var localSearch = document.querySelector('[data-local-search]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

  function applySearch(value) {
    var query = (value || '').trim().toLowerCase();

    cards.forEach(function (card) {
      var text = card.textContent.toLowerCase() + ' ' + (card.dataset.title || '').toLowerCase() + ' ' + (card.dataset.region || '').toLowerCase() + ' ' + (card.dataset.genre || '').toLowerCase();
      card.classList.toggle('is-hidden', query.length > 0 && text.indexOf(query) === -1);
    });
  }

  if (localSearch && cards.length) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (initialQuery) {
      localSearch.value = initialQuery;
      applySearch(initialQuery);
    }

    localSearch.addEventListener('input', function () {
      applySearch(localSearch.value);
    });
  }

  var video = document.querySelector('[data-player-video]');
  var overlay = document.querySelector('[data-player-overlay]');
  var hlsInstance = null;

  function playVideo() {
    if (!video || typeof videoStreamUrl === 'undefined' || !videoStreamUrl) {
      return;
    }

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    video.controls = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (video.src !== videoStreamUrl) {
        video.src = videoStreamUrl;
      }
      video.play().catch(function () {});
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!hlsInstance) {
        hlsInstance = new window.Hls();
        hlsInstance.loadSource(videoStreamUrl);
        hlsInstance.attachMedia(video);
      }
      video.play().catch(function () {});
      return;
    }

    if (video.src !== videoStreamUrl) {
      video.src = videoStreamUrl;
    }
    video.play().catch(function () {});
  }

  if (video && overlay) {
    overlay.addEventListener('click', playVideo);
    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });
  }
})();
