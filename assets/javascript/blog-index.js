document.addEventListener('DOMContentLoaded', function () {
  var root = document.querySelector('[data-writing-index]');
  var searchInput = document.getElementById('writing-search');
  var yearSelect = document.getElementById('writing-year-filter');
  var resultsText = document.getElementById('writing-results');
  var loadMoreBtn = document.getElementById('writing-load-more');
  var appliedWrap = document.getElementById('writing-applied');
  var appliedList = document.getElementById('writing-applied-list');
  var clearBtn = document.getElementById('writing-clear-filters');
  var items = Array.prototype.slice.call(document.querySelectorAll('.js-writing-item'));

  if (!root || !searchInput || !yearSelect || !resultsText || !loadMoreBtn || !items.length) {
    return;
  }

  var initialCount = 6;
  var step = 6;
  var visibleCount = initialCount;

  function normalize(text) {
    return (text || '').toLowerCase().trim();
  }

  function buildChip(label, removeType, ariaLabel) {
    var chip = document.createElement('span');
    chip.className = 'writing-chip';

    var chipText = document.createTextNode(label);
    chip.appendChild(chipText);

    var button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('data-remove', removeType);
    button.setAttribute('aria-label', ariaLabel);
    button.textContent = 'x';
    chip.appendChild(button);

    return chip;
  }

  function applyFilters(resetCount) {
    var query = normalize(searchInput.value);
    var year = yearSelect.value;

    if (resetCount) {
      visibleCount = initialCount;
    }

    var matched = items.filter(function (item) {
      var itemYear = item.getAttribute('data-year') || '';
      var searchText = normalize(item.getAttribute('data-search'));
      var yearMatch = year === 'all' || itemYear === year;
      var queryMatch = !query || searchText.indexOf(query) !== -1;
      return yearMatch && queryMatch;
    });

    items.forEach(function (item) {
      item.hidden = true;
    });

    matched.slice(0, visibleCount).forEach(function (item) {
      item.hidden = false;
    });

    if (matched.length === 0) {
      resultsText.textContent = 'No posts matched this filter. Try a different keyword or year.';
    } else {
      var showing = Math.min(visibleCount, matched.length);
      resultsText.textContent = 'Showing ' + showing + ' of ' + matched.length + ' posts.';
    }

    if (appliedWrap && appliedList && clearBtn) {
      appliedList.innerHTML = '';

      if (query) {
        var queryChip = buildChip('Search: ' + query, 'query', 'Remove search filter');
        appliedList.appendChild(queryChip);
      }

      if (year !== 'all') {
        var yearChip = buildChip('Year: ' + year, 'year', 'Remove year filter');
        appliedList.appendChild(yearChip);
      }

      var hasFilters = !!query || year !== 'all';
      appliedWrap.hidden = !hasFilters;
      clearBtn.hidden = !hasFilters;
    }

    loadMoreBtn.hidden = matched.length <= visibleCount;
    loadMoreBtn.disabled = matched.length <= visibleCount;
  }

  searchInput.addEventListener('input', function () {
    applyFilters(true);
  });

  yearSelect.addEventListener('change', function () {
    applyFilters(true);
  });

  loadMoreBtn.addEventListener('click', function () {
    visibleCount += step;
    applyFilters(false);
  });

  if (appliedList) {
    appliedList.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || !target.getAttribute) {
        return;
      }

      var removeType = target.getAttribute('data-remove');
      if (!removeType) {
        return;
      }

      if (removeType === 'query') {
        searchInput.value = '';
      }

      if (removeType === 'year') {
        yearSelect.value = 'all';
      }

      applyFilters(true);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      searchInput.value = '';
      yearSelect.value = 'all';
      applyFilters(true);
    });
  }

  applyFilters(true);
});
