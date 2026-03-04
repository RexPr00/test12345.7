document.addEventListener('DOMContentLoaded', () => {
  const langTrigger = document.querySelector('[data-lang-trigger]');
  const langMenu = document.querySelector('[data-lang-menu]');
  if (langTrigger && langMenu) {
    langTrigger.addEventListener('click', () => langMenu.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.lang-switcher')) langMenu.classList.remove('open');
    });
  }

  const drawer = document.querySelector('[data-drawer]');
  const openBtn = document.querySelector('[data-open-drawer]');
  const closeBtn = document.querySelector('[data-close-drawer]');
  let lastFocus = null;
  const focusables = () => drawer ? drawer.querySelectorAll('a,button,input,[tabindex]:not([tabindex="-1"])') : [];

  function trapFocus(e) {
    if (!drawer || !drawer.classList.contains('open') || e.key !== 'Tab') return;
    const items = Array.from(focusables());
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    document.body.classList.add('no-scroll');
    const f = focusables()[0];
    if (f) f.focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
  }
  openBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  drawer?.addEventListener('click', (e) => { if (e.target.matches('[data-drawer]')) closeDrawer(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal();
    }
    trapFocus(e);
  });

  document.querySelectorAll('.faq-item').forEach((item) => {
    item.querySelector('button')?.addEventListener('click', () => {
      document.querySelectorAll('.faq-item').forEach((other) => other.classList.remove('open'));
      item.classList.add('open');
    });
  });

  const modal = document.querySelector('[data-modal]');
  const openModal = document.querySelectorAll('[data-open-modal]');
  const closeModalBtns = document.querySelectorAll('[data-close-modal]');
  function showModal() {
    if (!modal) return;
    modal.classList.add('open');
    document.body.classList.add('no-scroll');
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
  openModal.forEach((btn) => btn.addEventListener('click', (e) => { e.preventDefault(); showModal(); }));
  closeModalBtns.forEach((btn) => btn.addEventListener('click', closeModal));
  modal?.addEventListener('click', (e) => { if (e.target.matches('[data-modal]')) closeModal(); });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
});
