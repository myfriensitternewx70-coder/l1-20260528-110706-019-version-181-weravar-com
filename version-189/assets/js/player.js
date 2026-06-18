import { H as Hls } from './hls-vendor.js';

var players = Array.prototype.slice.call(document.querySelectorAll('.movie-player'));

players.forEach(function (box) {
  var video = box.querySelector('video');
  var button = box.querySelector('[data-play]');
  var stream = box.getAttribute('data-stream');
  var hls = null;
  var ready = false;

  var start = function () {
    if (!video || !stream) {
      return;
    }

    if (!ready) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (Hls && Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hls.loadSource(stream);
        hls.attachMedia(video);

        hls.on(Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal || !hls) {
            return;
          }

          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
          }
        });
      } else {
        video.src = stream;
      }

      ready = true;
    }

    box.classList.add('is-started');
    video.play().catch(function () {});
  };

  if (button) {
    button.addEventListener('click', start);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (!ready) {
        start();
      }
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
});
