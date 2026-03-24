/* ============================================================
   Symphony & Harmony Physical Therapy — main.js
   Enhanced: scroll animations, modals, parallax, counters,
   tooltips, floating CTA, sticky nav, micro-interactions,
   page transitions, magnetic buttons, back-to-top
   ============================================================ */

$(document).ready(function () {

  /* ══════════════════════════════════════════════════════════
     1. ACTIVE NAV LINK
  ══════════════════════════════════════════════════════════ */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $('.nav-links a').each(function () {
    const href = $(this).attr('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      $(this).addClass('active');
    }
  });

  /* ══════════════════════════════════════════════════════════
     2. NAVBAR — scroll shrink + hamburger
  ══════════════════════════════════════════════════════════ */
  const $navbar = $('.navbar');
  $(window).on('scroll.navbar', function () {
    $(this).scrollTop() > 60 ? $navbar.addClass('navbar--scrolled') : $navbar.removeClass('navbar--scrolled');
  });

  const $toggle   = $('.nav-toggle');
  const $navLinks = $('.nav-links');

  $toggle.on('click', function () {
    $toggle.toggleClass('open');
    $navLinks.toggleClass('open');
    $('body').css('overflow', $navLinks.hasClass('open') ? 'hidden' : '');
  });

  $navLinks.find('a').on('click', function () {
    $toggle.removeClass('open');
    $navLinks.removeClass('open');
    $('body').css('overflow', '');
  });

  $(document).on('click', function (e) {
    if (!$toggle.is(e.target) && !$toggle.has(e.target).length &&
        !$navLinks.is(e.target) && !$navLinks.has(e.target).length) {
      $toggle.removeClass('open');
      $navLinks.removeClass('open');
      $('body').css('overflow', '');
    }
  });

  /* ══════════════════════════════════════════════════════════
     3. SCROLL PROGRESS BAR
  ══════════════════════════════════════════════════════════ */
  const $scrollBar = $('<div class="scroll-progress-bar"></div>').prependTo('body');

  $(window).on('scroll.progress', function () {
    const scrollTop = $(this).scrollTop();
    const docHeight = $(document).height() - $(this).height();
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    $scrollBar.css('width', pct + '%');
  });

  /* ══════════════════════════════════════════════════════════
     4. INTERSECTION OBSERVER — Scroll animations
  ══════════════════════════════════════════════════════════ */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const fadeObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { $(e.target).addClass('visible'); fadeObs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => fadeObs.observe(el));
  }

  // slide-in classes
  document.querySelectorAll('.slide-in-left, .slide-in-right, .scale-in').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    obs.observe(el);
  });

  /* ══════════════════════════════════════════════════════════
     5. ANIMATED STAT COUNTERS
  ══════════════════════════════════════════════════════════ */
  function animateCounter($el) {
    const target    = parseInt($el.data('target'));
    const suffix    = $el.data('suffix') || '';
    const dur       = 1800;
    const step      = 16;
    const steps     = dur / step;
    let current     = 0;
    const inc       = target / steps;
    const timer     = setInterval(() => {
      current += inc;
      if (current >= target) { current = target; clearInterval(timer); }
      $el.text(Math.floor(current).toLocaleString() + suffix);
    }, step);
  }

  const $statsBar = $('.stats-bar');
  if ($statsBar.length) {
    $statsBar.find('.stat-item__number').each(function () {
      const raw = $(this).text();
      $(this).attr('data-target', parseInt(raw.replace(/\D/g, '')));
      $(this).attr('data-suffix', raw.replace(/[\d,]/g, ''));
      $(this).text('0');
    });

    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          $(e.target).find('.stat-item__number').each(function () { animateCounter($(this)); });
          counterObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counterObs.observe($statsBar[0]);
  }

  /* ══════════════════════════════════════════════════════════
     6. PARALLAX HERO
  ══════════════════════════════════════════════════════════ */
  const $parallaxBg = $('.hero__bg img, .hero-strip--img .hero-strip__bg img');
  if ($parallaxBg.length && window.innerWidth > 768) {
    $(window).on('scroll.parallax', function () {
      $parallaxBg.css('transform', `translateY(${$(this).scrollTop() * 0.25}px) scale(1.05)`);
    });
  }

  /* ══════════════════════════════════════════════════════════
     7. FLOATING BOOK CTA
  ══════════════════════════════════════════════════════════ */
  if (currentPage !== 'contact.html') {
    const $floatCTA = $(`
      <div class="float-cta" id="float-cta" role="complementary" aria-label="Book a call">
        <a href="contact.html" class="float-cta__btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>Book a Call</span>
        </a>
      </div>
    `).appendTo('body');

    $(window).on('scroll.floatcta', function () {
      const heroH = $('.hero').outerHeight() || 400;
      $(this).scrollTop() > heroH * 0.6 ? $floatCTA.addClass('visible') : $floatCTA.removeClass('visible');
    });
  }

  /* ══════════════════════════════════════════════════════════
     8. TESTIMONIALS CAROUSEL + AUTO-PLAY
  ══════════════════════════════════════════════════════════ */
  const $track    = $('.testimonial-track');
  const $prevBtn  = $('.carousel-btn--prev');
  const $nextBtn  = $('.carousel-btn--next');
  const $dotsWrap = $('.carousel-dots');

  if ($track.length && $prevBtn.length) {
    const $cards  = $track.find('.testimonial-card');
    const total   = $cards.length;
    let current   = 0;
    let autoTimer;

    const getVisible = () => $(window).width() <= 768 ? 1 : 3;

    const buildDots = () => {
      $dotsWrap.empty();
      const pages = Math.ceil(total / getVisible());
      for (let i = 0; i < pages; i++) {
        $('<button>').addClass('carousel-dot' + (i === 0 ? ' active' : ''))
          .attr('aria-label', `Go to slide ${i + 1}`)
          .on('click', () => { goTo(i * getVisible()); resetAuto(); })
          .appendTo($dotsWrap);
      }
    };

    const updateDots = () => {
      const page = Math.floor(current / getVisible());
      $dotsWrap.find('.carousel-dot').each(function (i) { $(this).toggleClass('active', i === page); });
    };

    const goTo = (idx) => {
      const visible = getVisible();
      const maxIdx  = Math.max(0, total - visible);
      current       = Math.min(Math.max(idx, 0), maxIdx);
      const cardW   = $cards.eq(0).outerWidth(true);
      $track.css('transform', `translateX(-${current * cardW}px)`);
      updateDots();
    };

    const startAuto = () => {
      autoTimer = setInterval(() => {
        const vis  = getVisible();
        const next = current + vis >= total ? 0 : current + vis;
        goTo(next);
      }, 5000);
    };
    const resetAuto = () => { clearInterval(autoTimer); startAuto(); };

    $prevBtn.on('click', () => { goTo(current - getVisible()); resetAuto(); });
    $nextBtn.on('click', () => { goTo(current + getVisible()); resetAuto(); });

    let touchStartX = 0;
    $track.on('touchstart', e => { touchStartX = e.touches[0].clientX; });
    $track.on('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
    });

    $track.on('mouseenter', () => clearInterval(autoTimer)).on('mouseleave', startAuto);

    buildDots();
    startAuto();
    $(window).on('resize', () => { buildDots(); goTo(0); });
  }

  /* ══════════════════════════════════════════════════════════
     9. ACCORDION
  ══════════════════════════════════════════════════════════ */
  $('.accordion-trigger').each(function (idx) {
    const $trigger = $(this);
    const $body    = $trigger.next('.accordion-body');
    if (idx === 0) { $trigger.addClass('open'); $body.addClass('open'); }
    $trigger.on('click', function () {
      const open = $trigger.hasClass('open');
      $('.accordion-trigger').removeClass('open');
      $('.accordion-body').removeClass('open');
      if (!open) { $trigger.addClass('open'); $body.addClass('open'); }
    });
  });

  /* ══════════════════════════════════════════════════════════
     10. SMOOTH SCROLL
  ══════════════════════════════════════════════════════════ */
  $('a[href^="#"]').on('click', function (e) {
    const $target = $($(this).attr('href'));
    if ($target.length) {
      e.preventDefault();
      const navH = parseInt($(':root').css('--nav-h')) || 72;
      $('html, body').animate({ scrollTop: $target.offset().top - navH - 16 }, 600);
    }
  });

  /* ══════════════════════════════════════════════════════════
     11. SERVICE / INFO MODALS
  ══════════════════════════════════════════════════════════ */
  const modals = {
    vm: {
      title: 'Visceral Manipulation',
      badge: 'Signature Service', badgeClass: 'badge--signature',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
      body: `<p>Visceral Manipulation (VM) is a gentle, hands-on technique developed by Jean-Pierre Barral. It works with the body's internal organs and connective tissue to release restrictions that cause pain throughout the body.</p>
        <p style="margin-top:0.75rem;">When an organ loses mobility — through illness, injury, or stress — it creates tension patterns felt far from the original source. Dr. Friedman uses exquisitely sensitive palpation to detect and release these restrictions.</p>
        <h4 style="margin:1rem 0 0.5rem;font-size:0.95rem;">Commonly addressed conditions:</h4>
        <ul class="modal-list">
          <li>Chronic lower back &amp; hip pain</li><li>Digestive disorders (IBS, GERD)</li>
          <li>Post-surgical adhesions</li><li>Pelvic pain &amp; dysfunction</li>
          <li>Shoulder &amp; neck pain</li><li>Unexplained chronic pain</li>
        </ul>`,
      cta: 'contact.html', ctaText: 'Book a Consultation'
    },
    nm: {
      title: 'Neural Manipulation',
      badge: 'Advanced Technique', badgeClass: 'badge--neural',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
      body: `<p>Neural Manipulation (NM) assesses and treats mechanical dysfunction of the nervous system. Nerves need to move freely — when they don't, the result can be pain, numbness, weakness, and neurological symptoms.</p>
        <p style="margin-top:0.75rem;">Dr. Friedman applies gentle, specific pressure along nerve pathways to release fixations and restore normal neural mobility. Results are often immediate and profound.</p>
        <h4 style="margin:1rem 0 0.5rem;font-size:0.95rem;">Commonly addressed conditions:</h4>
        <ul class="modal-list">
          <li>Headaches &amp; migraines</li><li>Sciatica &amp; radiculopathy</li>
          <li>Carpal tunnel syndrome</li><li>Post-concussion syndrome</li>
          <li>Tinnitus &amp; vertigo</li><li>Chronic nerve pain</li>
        </ul>`,
      cta: 'contact.html', ctaText: 'Book a Consultation'
    },
    dr: {
      title: "Dr. Friedman's Approach",
      badge: 'Clinical Philosophy', badgeClass: '',
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`,
      body: `<div class="modal-philosophy">
        <div class="modal-phil-item"><div class="modal-phil-num">01</div><div><strong>Listen First</strong><p>Every session starts with deep listening — to the patient's history and what the body communicates through palpation. No assumptions. No shortcuts.</p></div></div>
        <div class="modal-phil-item"><div class="modal-phil-num">02</div><div><strong>Treat the Cause</strong><p>Symptoms are signals, not diagnoses. Dr. Friedman traces each symptom back to its structural origin — organ restriction, fascial adhesion, or neural tension — and addresses it directly.</p></div></div>
        <div class="modal-phil-item"><div class="modal-phil-num">03</div><div><strong>Restore, Don't Force</strong><p>Healing is a gentle process. Dr. Friedman works with the body's inherent rhythms to guide it toward balance — sustainably, without trauma.</p></div></div>
      </div>`,
      cta: 'about.html', ctaText: 'Learn More About Dr. Friedman'
    }
  };

  const $modal = $(`
    <div class="modal-overlay" id="site-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
      <div class="modal-box">
        <button class="modal-close" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="modal-header">
          <div class="modal-icon-wrap" id="modal-icon"></div>
          <div><span class="badge" id="modal-badge"></span><h3 id="modal-title" style="margin-top:0.4rem;line-height:1.2;"></h3></div>
        </div>
        <div class="modal-body" id="modal-body"></div>
        <div class="modal-footer">
          <button class="btn btn--outline-navy modal-close-btn">Maybe Later</button>
          <a href="#" class="btn btn--primary" id="modal-cta">Book a Consultation →</a>
        </div>
      </div>
    </div>
  `).appendTo('body');

  function openModal(key) {
    const d = modals[key]; if (!d) return;
    $('#modal-icon').html(d.icon);
    $('#modal-badge').text(d.badge).attr('class', 'badge ' + (d.badgeClass || ''));
    $('#modal-title').text(d.title);
    $('#modal-body').html(d.body);
    $('#modal-cta').attr('href', d.cta).text((d.ctaText || 'Book a Consultation') + ' →');
    $modal.addClass('open'); $('body').css('overflow', 'hidden');
    setTimeout(() => $modal.find('.modal-box').addClass('in'), 10);
    $modal.focus();
  }

  function closeModal() {
    $modal.find('.modal-box').removeClass('in');
    setTimeout(() => { $modal.removeClass('open'); $('body').css('overflow', ''); }, 280);
  }

  $(document).on('click', '[data-modal]', function (e) { e.preventDefault(); openModal($(this).data('modal')); });
  $modal.on('click', function (e) { if ($(e.target).is($modal)) closeModal(); });
  $(document).on('click', '.modal-close, .modal-close-btn', closeModal);
  $(document).on('keydown', function (e) { if (e.key === 'Escape') { closeModal(); closeLightbox(); } });

  /* ══════════════════════════════════════════════════════════
     12. TESTIMONIAL LIGHTBOX (click to expand)
  ══════════════════════════════════════════════════════════ */
  const $lightbox = $(`
    <div class="modal-overlay" id="test-lightbox" role="dialog" aria-modal="true" aria-label="Patient story" tabindex="-1">
      <div class="modal-box modal-box--sm">
        <button class="modal-close" aria-label="Close"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        <div id="tl-inner"></div>
      </div>
    </div>
  `).appendTo('body');

  function closeLightbox() {
    $lightbox.find('.modal-box').removeClass('in');
    setTimeout(() => { $lightbox.removeClass('open'); $('body').css('overflow', ''); }, 280);
  }

  $(document).on('click', '.testimonial-card', function () {
    const initials  = $(this).find('.testimonial-avatar').text();
    const name      = $(this).find('.testimonial-card__name').text();
    const condition = $(this).find('.testimonial-card__condition').text();
    const quote     = $(this).find('.testimonial-card__quote').text();
    const stars     = $(this).find('.stars').html();

    $('#tl-inner').html(`
      <div style="text-align:center;padding-bottom:var(--space-md);">
        <div class="tl-avatar">${initials}</div>
        <div class="stars" style="font-size:1.1rem;margin:0.6rem 0 0.2rem;">${stars}</div>
        <h4 style="margin-bottom:0.15rem;">${name}</h4>
        <div style="font-size:0.82rem;color:var(--text-light);">${condition}</div>
      </div>
      <p class="tl-quote">${quote}</p>
      <a href="contact.html" class="btn btn--primary" style="margin-top:var(--space-md);width:100%;justify-content:center;">Book Your Consultation</a>
    `);

    $lightbox.addClass('open'); $('body').css('overflow', 'hidden');
    setTimeout(() => $lightbox.find('.modal-box').addClass('in'), 10);
  });

  $lightbox.on('click', function (e) { if ($(e.target).is($lightbox)) closeLightbox(); });
  $lightbox.find('.modal-close').on('click', closeLightbox);

  /* ══════════════════════════════════════════════════════════
     13. TOOLTIPS — data-tooltip="..."
  ══════════════════════════════════════════════════════════ */
  const $tooltip = $('<div class="site-tooltip" role="tooltip" aria-hidden="true"></div>').appendTo('body');

  $(document).on('mouseenter', '[data-tooltip]', function () {
    $tooltip.text($(this).data('tooltip')).addClass('visible');
    const r = this.getBoundingClientRect();
    $tooltip.css({ top: r.top + window.scrollY - $tooltip.outerHeight() - 10, left: Math.max(8, r.left + r.width/2 - $tooltip.outerWidth()/2) });
  }).on('mouseleave', '[data-tooltip]', function () { $tooltip.removeClass('visible'); });

  /* ══════════════════════════════════════════════════════════
     14. RIPPLE on card clicks
  ══════════════════════════════════════════════════════════ */
  $(document).on('click', '.why-card, .benefit-card, .philosophy-card', function (e) {
    const $c  = $(this);
    const off = $c.offset();
    $('<span class="ripple"></span>').css({ left: e.pageX - off.left, top: e.pageY - off.top }).appendTo($c);
    setTimeout(() => $c.find('.ripple').remove(), 700);
  });

  /* ══════════════════════════════════════════════════════════
     15. QUICK-NAV (services page)
  ══════════════════════════════════════════════════════════ */
  if (currentPage === 'services.html') {
    const $qn = $(`
      <nav class="quick-nav" aria-label="Jump to section">
        <a href="#visceral-manipulation" class="quick-nav__item active">Visceral Manipulation</a>
        <a href="#neural-manipulation" class="quick-nav__item">Neural Manipulation</a>
        <a href="#who-can-benefit" class="quick-nav__item">Who Benefits</a>
      </nav>
    `).insertAfter('.hero-strip');

    const sections = ['visceral-manipulation','neural-manipulation','who-can-benefit'];
    $(window).on('scroll.qn', function () {
      const scrollY = $(this).scrollTop() + 160;
      sections.forEach(id => {
        const $s = $(`#${id}`);
        if ($s.length && scrollY >= $s.offset().top) {
          $('.quick-nav__item').removeClass('active');
          $(`.quick-nav__item[href="#${id}"]`).addClass('active');
        }
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     16. BACK TO TOP
  ══════════════════════════════════════════════════════════ */
  const $backTop = $(`
    <button class="back-to-top" aria-label="Back to top">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>
    </button>
  `).appendTo('body');

  $(window).on('scroll.backtop', function () {
    $(this).scrollTop() > 400 ? $backTop.addClass('visible') : $backTop.removeClass('visible');
  });

  $backTop.on('click', function () { $('html, body').animate({ scrollTop: 0 }, 500); });

  /* ══════════════════════════════════════════════════════════
     17. MAGNETIC BUTTONS (desktop)
  ══════════════════════════════════════════════════════════ */
  if (window.innerWidth > 1024) {
    $(document).on('mousemove', '.btn--primary, .btn--outline', function (e) {
      const r = this.getBoundingClientRect();
      $(this).css('transform', `translate(${(e.clientX - r.left - r.width/2) * 0.2}px, ${(e.clientY - r.top - r.height/2) * 0.2}px)`);
    }).on('mouseleave', '.btn--primary, .btn--outline', function () {
      $(this).css('transform', '');
    });
  }

  /* ══════════════════════════════════════════════════════════
     18. PAGE TRANSITION
  ══════════════════════════════════════════════════════════ */
  $('body').addClass('page-loaded');

  $(document).on('click', 'a[href]', function (e) {
    const href = $(this).attr('href');
    if (!href || href.startsWith('#') || href.startsWith('tel:') ||
        href.startsWith('mailto:') || href.startsWith('http') ||
        $(this).attr('target') === '_blank' || $(this).hasClass('no-transition')) return;
    e.preventDefault();
    $('body').addClass('page-leaving');
    setTimeout(() => { window.location.href = href; }, 300);
  });

  /* ══════════════════════════════════════════════════════════
     19. HEALTH PAGE — mobile expand steps
  ══════════════════════════════════════════════════════════ */
  if (currentPage === 'health.html' && window.innerWidth <= 768) {
    $('.ex-card__body').each(function () {
      const $steps = $(this).find('.ex-steps');
      const $tog = $('<button class="ex-expand-btn">View Steps <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>');
      $steps.hide().before($tog);
      $tog.on('click', function () {
        const open = $steps.is(':visible');
        $steps.slideToggle(280);
        $tog.html((open ? 'View' : 'Hide') + ` Steps <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="${open ? '6 9 12 15 18 9' : '18 15 12 9 6 15'}"/></svg>`);
      });
    });
  }
/* ══════════════════════════════════════════════════════════
     20. FULLSCREEN HERO — hide scroll arrow after user scrolls
  ══════════════════════════════════════════════════════════ */
  const $scrollCta = $('.hero-scroll-cta');
  if ($scrollCta.length) {
    $(window).on('scroll.scrollcta', function () {
      if ($(this).scrollTop() > 80) {
        $scrollCta.addClass('hidden');
      } else {
        $scrollCta.removeClass('hidden');
      }
    });
  }
});

/* ══════════════════════════════════════════════════════════
   TYPEWRITER for elements with .typewriter class
   Usage: <span class="typewriter" data-words="word1,word2,word3"></span>
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.typewriter').forEach(el => {
    const words = (el.dataset.words || '').split(',').map(w => w.trim()).filter(Boolean);
    if (!words.length) return;
    let wIdx = 0, cIdx = 0, deleting = false, pausing = false;

    function loop() {
      if (pausing) return;
      const word    = words[wIdx];
      const display = deleting ? word.substring(0, cIdx - 1) : word.substring(0, cIdx + 1);
      el.textContent = display;

      if (!deleting && cIdx === word.length) {
        pausing = true;
        return setTimeout(() => { pausing = false; deleting = true; loop(); }, 2000);
      }
      if (deleting && cIdx === 0) {
        deleting = false;
        wIdx = (wIdx + 1) % words.length;
      }
      cIdx = deleting ? Math.max(0, cIdx - 1) : Math.min(word.length, cIdx + 1);
      setTimeout(loop, deleting ? 50 : 95);
    }
    loop();
  });
});