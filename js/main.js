/* ============================================================
   Symphony & Harmony Physical Therapy — main.js
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

  $toggle.on('click', function (e) {
    e.stopPropagation();
    const isOpen = $navLinks.hasClass('open');
    $toggle.toggleClass('open');
    $navLinks.toggleClass('open');
    $toggle.attr('aria-expanded', String(!isOpen));
    $('body').css('overflow', !isOpen ? 'hidden' : '');
  });

  $navLinks.find('a').on('click', function () {
    $toggle.removeClass('open').attr('aria-expanded', 'false');
    $navLinks.removeClass('open');
    $('body').css('overflow', '');
  });

  $(document).on('click.navclose', function (e) {
    if ($navLinks.hasClass('open') &&
        !$toggle.is(e.target) && !$toggle.has(e.target).length &&
        !$navLinks.is(e.target) && !$navLinks.has(e.target).length) {
      $toggle.removeClass('open').attr('aria-expanded', 'false');
      $navLinks.removeClass('open');
      $('body').css('overflow', '');
    }
  });

  $(document).on('keydown.navclose', function (e) {
    if (e.key === 'Escape' && $navLinks.hasClass('open')) {
      $toggle.removeClass('open').attr('aria-expanded', 'false');
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
    const target = parseInt($el.data('target'));
    const suffix = $el.data('suffix') || '';
    const dur    = 1800, step = 16;
    let current  = 0;
    const inc    = target / (dur / step);
    const timer  = setInterval(() => {
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
     8. TESTIMONIALS — Auto-rotate, no arrows, click to expand
  ══════════════════════════════════════════════════════════ */
  const $track    = $('.testimonial-track');
  const $dotsWrap = $('.carousel-dots');

  // Remove arrow buttons entirely
  $('.carousel-btn--prev, .carousel-btn--next').remove();

  if ($track.length) {
    const $cards  = $track.find('.testimonial-card');
    const total   = $cards.length;
    let currentPage = 0;
    let autoTimer;
    let isPaused  = false;

    const getVisible = () => $(window).width() <= 900 ? 1 : 3;
    const getPageCount = () => Math.ceil(total / getVisible());

    // Get the pixel offset for a given page — uses actual DOM positions
    // so it's immune to gap/padding calculation bugs
    const getPageOffset = (page) => {
      const vis     = getVisible();
      const cardIdx = page * vis;
      if (cardIdx >= total) return getPageOffset(getPageCount() - 1);
      const trackLeft  = $track[0].getBoundingClientRect().left;
      const cardLeft   = $cards.eq(cardIdx)[0].getBoundingClientRect().left;
      // current transform offset + delta
      const currentTranslate = getCurrentTranslate();
      return currentTranslate + (cardLeft - trackLeft);
    };

    const getCurrentTranslate = () => {
      const style = window.getComputedStyle($track[0]);
      const matrix = new DOMMatrix(style.transform);
      return Math.abs(matrix.m41); // absolute value of translateX
    };

    const buildDots = () => {
      $dotsWrap.empty();
      const pages = getPageCount();
      for (let i = 0; i < pages; i++) {
        $('<button>').addClass('carousel-dot' + (i === 0 ? ' active' : ''))
          .attr('aria-label', `Go to page ${i + 1}`)
          .on('click', () => { goToPage(i); resetAuto(); })
          .appendTo($dotsWrap);
      }
    };

    const updateDots = () => {
      $dotsWrap.find('.carousel-dot').each(function (i) {
        $(this).toggleClass('active', i === currentPage);
      });
    };

    const goToPage = (page) => {
      const pages = getPageCount();
      currentPage = Math.max(0, Math.min(page, pages - 1));

      const vis      = getVisible();
      const cardIdx  = currentPage * vis;
      // For the last page, align so the LAST card is flush right — no partial cards
      const lastPage = pages - 1;
      let translateX;

      if (currentPage === lastPage && total % vis !== 0) {
        // Snap so last 'vis' cards are shown without partial
        const startIdx   = total - vis;
        const trackLeft  = $track[0].getBoundingClientRect().left;
        // Reset transform to 0 first to get clean measurements
        $track.css('transition', 'none').css('transform', 'translateX(0)');
        // Force reflow
        $track[0].offsetHeight;
        $track.css('transition', '');
        const cardLeft   = $cards.eq(startIdx)[0].getBoundingClientRect().left;
        translateX       = cardLeft - $track[0].getBoundingClientRect().left;
      } else {
        // Reset transform temporarily to measure from origin
        $track.css('transition', 'none').css('transform', 'translateX(0)');
        $track[0].offsetHeight;
        $track.css('transition', '');
        const trackLeft = $track[0].getBoundingClientRect().left;
        const cardLeft  = $cards.eq(cardIdx)[0].getBoundingClientRect().left;
        translateX      = cardLeft - trackLeft;
      }

      $track.css('transform', `translateX(-${translateX}px)`);
      updateDots();
    };

    const startAuto = () => {
      clearInterval(autoTimer);
      if (isPaused) return;
      autoTimer = setInterval(() => {
        const nextPage = currentPage + 1 >= getPageCount() ? 0 : currentPage + 1;
        goToPage(nextPage);
      }, 4500);
    };
    const resetAuto = () => { clearInterval(autoTimer); startAuto(); };

    // Pause on hover
    $track.on('mouseenter', () => { isPaused = true; clearInterval(autoTimer); })
          .on('mouseleave', () => { isPaused = false; startAuto(); });

    // Touch swipe
    let touchStartX = 0;
    $track.on('touchstart', e => { touchStartX = e.touches[0].clientX; isPaused = true; });
    $track.on('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goToPage(diff > 0 ? currentPage + 1 : currentPage - 1);
      }
      isPaused = false; startAuto();
    });

    buildDots();
    // Small delay so layout is fully rendered before first measurement
    setTimeout(() => { goToPage(0); startAuto(); }, 100);

    let resizeTimer;
    $(window).on('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { buildDots(); goToPage(0); }, 150);
    });
  }

  /* ══════════════════════════════════════════════════════════
     9. ACCORDION — Enhanced with icons
  ══════════════════════════════════════════════════════════ */
  const accordionIcons = [
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12h8M12 8v8"/></svg>`,
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`,
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2l18 9-18 9V2z"/></svg>`,
  ];

  $('.accordion-trigger').each(function (idx) {
    const $trigger = $(this);
    // Extract the text label only
    const text = $trigger.contents().filter(function() {
      return this.nodeType === 3; // text nodes only
    }).text().trim() || $trigger.text().replace(/[\n\r]+/g, ' ').trim().replace(/\s+/g, ' ');

    const icon = accordionIcons[idx % accordionIcons.length];

    $trigger.html(`
      <span class="accordion-trigger-left">
        <span class="accordion-trigger-icon">${icon}</span>
        <span class="accordion-trigger-text">${text}</span>
      </span>
      <span class="accordion-icon" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </span>
    `);
  });

  $('.accordion-trigger').each(function (idx) {
    const $trigger = $(this);
    const $item    = $trigger.closest('.accordion-item');
    const $body    = $trigger.next('.accordion-body');

    if (idx === 0) {
      $trigger.addClass('open').attr('aria-expanded', 'true');
      $body.addClass('open');
      $item.addClass('is-open');
    }

    $trigger.on('click', function () {
      const isOpen = $trigger.hasClass('open');
      $('.accordion-trigger').removeClass('open').attr('aria-expanded', 'false');
      $('.accordion-body').removeClass('open');
      $('.accordion-item').removeClass('is-open');
      if (!isOpen) {
        $trigger.addClass('open').attr('aria-expanded', 'true');
        $body.addClass('open');
        $item.addClass('is-open');
      }
    });
  });

  /* ══════════════════════════════════════════════════════════
     10. SMOOTH SCROLL
  ══════════════════════════════════════════════════════════ */
  $('a[href^="#"]').on('click', function (e) {
    const $target = $($(this).attr('href'));
    if ($target.length) {
      e.preventDefault();
      const navH = $navbar.outerHeight() || 72;
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
        <div id="tl-inner" style="padding:var(--space-lg);"></div>
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
        <div class="stars" style="font-size:1.2rem;margin:0.6rem 0 0.25rem;">${stars}</div>
        <h4 style="margin-bottom:0.15rem;font-size:1.1rem;">${name}</h4>
        <div style="font-size:0.82rem;color:var(--text-light);">${condition}</div>
      </div>
      <p class="tl-quote">${quote}</p>
      <a href="contact.html" class="btn btn--primary" style="margin-top:var(--space-md);width:100%;justify-content:center;display:flex;">Book Your Consultation</a>
    `);

    $lightbox.addClass('open'); $('body').css('overflow', 'hidden');
    setTimeout(() => $lightbox.find('.modal-box').addClass('in'), 10);
  });

  $lightbox.on('click', function (e) { if ($(e.target).is($lightbox)) closeLightbox(); });
  $lightbox.find('.modal-close').on('click', closeLightbox);

  /* ══════════════════════════════════════════════════════════
     13. TOOLTIPS
  ══════════════════════════════════════════════════════════ */
  const $tooltip = $('<div class="site-tooltip" role="tooltip" aria-hidden="true"></div>').appendTo('body');
  $(document).on('mouseenter', '[data-tooltip]', function () {
    $tooltip.text($(this).data('tooltip')).addClass('visible');
    const r = this.getBoundingClientRect();
    $tooltip.css({ top: r.top + window.scrollY - $tooltip.outerHeight() - 10, left: Math.max(8, r.left + r.width/2 - $tooltip.outerWidth()/2) });
  }).on('mouseleave', '[data-tooltip]', function () { $tooltip.removeClass('visible'); });

  /* ══════════════════════════════════════════════════════════
     14. RIPPLE on cards
  ══════════════════════════════════════════════════════════ */
  $(document).on('click', '.why-card, .benefit-card, .philosophy-card', function (e) {
    const $c  = $(this);
    const off = $c.offset();
    $('<span class="ripple"></span>').css({ left: e.pageX - off.left, top: e.pageY - off.top }).appendTo($c);
    setTimeout(() => $c.find('.ripple').remove(), 700);
  });

  /* Quick-nav insertion removed — using static markup in services.html to avoid duplicates. */

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
     17. PAGE TRANSITION
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
     18. HEALTH PAGE — mobile expand steps
  ══════════════════════════════════════════════════════════ */
  if (currentPage === 'health.html' && window.innerWidth <= 768) {
    $('.ex-card__body').each(function () {
      const $steps = $(this).find('.ex-steps');
      const $tog = $('<button class="ex-expand-btn">View Steps <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>');
      $steps.hide().before($tog);
      $tog.on('click', function () {
        const open = $steps.is(':visible');
        $steps.slideToggle(280);
        $tog.html((open ? 'View' : 'Hide') + ` Steps`);
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     19. SCROLL ARROW — hide after scrolling
  ══════════════════════════════════════════════════════════ */
  const $scrollCta = $('.hero-scroll-cta');
  if ($scrollCta.length) {
    $(window).on('scroll.scrollcta', function () {
      $(this).scrollTop() > 80 ? $scrollCta.addClass('hidden') : $scrollCta.removeClass('hidden');
    });
  }

  /* ══════════════════════════════════════════════════════════
     20. EXERCISE STEP STAGGER
  ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.ex-card').forEach(card => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.ex-step').forEach((step, i) => {
            step.style.opacity = '0';
            step.style.transform = 'translateX(-12px)';
            step.style.transition = `opacity 0.4s ease ${i*0.1}s, transform 0.4s ease ${i*0.1}s`;
            setTimeout(() => { step.style.opacity='1'; step.style.transform='translateX(0)'; }, 50 + i*100);
          });
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    obs.observe(card);
  });

  /* ══════════════════════════════════════════════════════════
     21. PILL STAGGER (about page)
  ══════════════════════════════════════════════════════════ */
  const $pillWrap = $('.credential-pills');
  if ($pillWrap.length) {
    const pillObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          $(e.target).find('.pill').each(function(i) {
            const $p = $(this).css({ opacity: 0, transform: 'translateY(10px)' });
            setTimeout(() => $p.css({ transition: 'opacity 0.4s ease, transform 0.4s ease', opacity: 1, transform: 'translateY(0)' }), i * 80);
          });
          pillObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    pillObs.observe($pillWrap[0]);
  }

});

/* ══════════════════════════════════════════════════════════
   TYPEWRITER
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.typewriter').forEach(el => {
    const words = (el.dataset.words || '').split(',').map(w => w.trim()).filter(Boolean);
    if (!words.length) return;
    let wIdx = 0, cIdx = 0, deleting = false, pausing = false;
    function loop() {
      if (pausing) return;
      const word = words[wIdx];
      el.textContent = deleting ? word.substring(0, cIdx - 1) : word.substring(0, cIdx + 1);
      if (!deleting && cIdx === word.length) { pausing = true; return setTimeout(() => { pausing=false; deleting=true; loop(); }, 2000); }
      if (deleting && cIdx === 0) { deleting = false; wIdx = (wIdx + 1) % words.length; }
      cIdx = deleting ? Math.max(0, cIdx - 1) : Math.min(word.length, cIdx + 1);
      setTimeout(loop, deleting ? 50 : 95);
    }
    loop();
  });
});