(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    var showSlide = function (nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot') || 0));
      });
    });

    window.setInterval(function () {
      showSlide(index + 1);
    }, 5600);
  }

  var forms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');

      if (input && input.value.trim()) {
        event.preventDefault();
        window.location.href = './search.html?q=' + encodeURIComponent(input.value.trim());
      }
    });
  });

  var searchInput = document.querySelector('[data-search-input]');
  var cardList = document.querySelector('[data-card-list]');
  var yearFilter = document.querySelector('[data-year-filter]');
  var resultCount = document.querySelector('[data-result-count]');
  var filterRow = document.querySelector('[data-filter-row]');
  var activeFilter = 'all';

  if (searchInput && cardList) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');

    if (query) {
      searchInput.value = query;
    }

    var cards = Array.prototype.slice.call(cardList.querySelectorAll('[data-card]'));

    var updateCards = function () {
      var term = searchInput.value.trim().toLowerCase();
      var selectedYear = yearFilter ? yearFilter.value : 'all';
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-tags') || '',
          card.getAttribute('data-category') || '',
          card.getAttribute('data-year') || '',
          card.textContent || ''
        ].join(' ').toLowerCase();

        var category = card.getAttribute('data-category') || '';
        var year = card.getAttribute('data-year') || '';
        var matchText = !term || haystack.indexOf(term) !== -1;
        var matchCategory = activeFilter === 'all' || category === activeFilter;
        var matchYear = selectedYear === 'all' || year.indexOf(selectedYear) !== -1;
        var visibleCard = matchText && matchCategory && matchYear;

        card.classList.toggle('is-hidden', !visibleCard);

        if (visibleCard) {
          visible += 1;
        }
      });

      if (resultCount) {
        resultCount.textContent = '共 ' + visible + ' 部影片';
      }
    };

    searchInput.addEventListener('input', updateCards);

    if (yearFilter) {
      yearFilter.addEventListener('change', updateCards);
    }

    if (filterRow) {
      filterRow.addEventListener('click', function (event) {
        var button = event.target.closest('[data-filter]');

        if (!button) {
          return;
        }

        activeFilter = button.getAttribute('data-filter') || 'all';

        Array.prototype.slice.call(filterRow.querySelectorAll('[data-filter]')).forEach(function (item) {
          item.classList.toggle('active', item === button);
        });

        updateCards();
      });
    }

    updateCards();
  }
})();
