/* Floating "scroll to top" button: appears after scrolling down */
(function () {
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'scroll-top';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>';
  document.body.appendChild(btn);

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  // Project pages: show the header's background/outline only once it sticks
  var header = document.querySelector('nav.top');
  var landingHeader = document.querySelector('.container > header');
  var stickTop = header ? parseFloat(getComputedStyle(header).top) || 0 : 0;

  function toggle() {
    btn.classList.toggle('is-visible', window.scrollY > 400);
    if (header) {
      header.classList.toggle('is-stuck', window.scrollY > 0 && header.getBoundingClientRect().top <= stickTop + 0.5);
    }
    // Landing page: header is fixed, so it "sticks" as soon as the page scrolls
    if (landingHeader) {
      landingHeader.classList.toggle('is-stuck', window.scrollY > 10);
    }
  }
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
})();
