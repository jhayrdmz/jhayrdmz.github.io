/* Theater mode for project screenshots: click a gallery image to view it full screen */
(function () {
  var images = Array.prototype.slice.call(document.querySelectorAll('.gallery img'));
  if (!images.length) return;

  var icon = function (path) {
    return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
  };

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Screenshot viewer');
  box.hidden = true;
  box.innerHTML =
    '<button type="button" class="lightbox-btn lightbox-close" aria-label="Close">' + icon('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>') + '</button>' +
    '<button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous screenshot">' + icon('<path d="m15 18-6-6 6-6"/>') + '</button>' +
    '<figure class="lightbox-figure"><img class="lightbox-img" alt="" /><figcaption class="lightbox-caption"></figcaption></figure>' +
    '<button type="button" class="lightbox-btn lightbox-next" aria-label="Next screenshot">' + icon('<path d="m9 18 6-6-6-6"/>') + '</button>';
  document.body.appendChild(box);

  var img = box.querySelector('.lightbox-img');
  var caption = box.querySelector('.lightbox-caption');
  var closeBtn = box.querySelector('.lightbox-close');
  var prevBtn = box.querySelector('.lightbox-prev');
  var nextBtn = box.querySelector('.lightbox-next');
  var current = 0;
  var lastFocus = null;
  var multiple = images.length > 1;

  prevBtn.hidden = nextBtn.hidden = !multiple;

  function show(i) {
    current = (i + images.length) % images.length;
    var src = images[current];
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    caption.textContent = (multiple ? (current + 1) + ' / ' + images.length + '  ·  ' : '') + src.alt;
  }

  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    box.hidden = false;
    document.documentElement.classList.add('lightbox-open');
    requestAnimationFrame(function () { box.classList.add('is-open'); });
    closeBtn.focus();
  }

  function close() {
    box.classList.remove('is-open');
    document.documentElement.classList.remove('lightbox-open');
    box.hidden = true;
    img.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }

  images.forEach(function (el, i) {
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'View screenshot: ' + el.alt);
    el.addEventListener('click', function () { open(i); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { show(current - 1); });
  nextBtn.addEventListener('click', function () { show(current + 1); });

  // Clicking the dark backdrop (not the image or buttons) closes the viewer
  box.addEventListener('click', function (e) {
    if (e.target === box || e.target.classList.contains('lightbox-figure')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && multiple) show(current - 1);
    else if (e.key === 'ArrowRight' && multiple) show(current + 1);
    else if (e.key === 'Tab') {
      // Keep keyboard focus inside the viewer
      var focusable = [closeBtn, prevBtn, nextBtn].filter(function (b) { return !b.hidden; });
      var idx = focusable.indexOf(document.activeElement);
      e.preventDefault();
      focusable[(idx + (e.shiftKey ? -1 : 1) + focusable.length) % focusable.length].focus();
    }
  });

  // Swipe left/right on touch screens
  var startX = null;
  box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (startX === null || !multiple) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
