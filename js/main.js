/* ============================================================
   Symphony & Harmony Physical Therapy — main.js
   jQuery-based interactive functionality
   ============================================================ */

$(document).ready(function() {

  /* ── 1. Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $('.nav-links a').each(function() {
    const href = $(this).attr('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      $(this).addClass('active');
    }
  });

  /* ── 2. Hamburger menu toggle ── */
  const $toggle = $('.nav-toggle');
  const $navLinks = $('.nav-links');

  $toggle.on('click', function() {
    $toggle.toggleClass('open');
    $navLinks.toggleClass('open');
    $('body').css('overflow', $navLinks.hasClass('open') ? 'hidden' : '');
  });

  // Close menu on link click
  $navLinks.find('a').on('click', function() {
    $toggle.removeClass('open');
    $navLinks.removeClass('open');
    $('body').css('overflow', '');
  });

  // Close menu on outside click
  $(document).on('click', function(e) {
    if (!$toggle.is(e.target) && !$toggle.has(e.target).length && 
        !$navLinks.is(e.target) && !$navLinks.has(e.target).length) {
      $toggle.removeClass('open');
      $navLinks.removeClass('open');
      $('body').css('overflow', '');
    }
  });

  /* ── 3. Fade-in on scroll (Intersection Observer with jQuery) ── */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $(entry.target).addClass('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => observer.observe(el));
  }

  /* ── 4. Testimonials Carousel (jQuery) ── */
  const $track = $('.testimonial-track');
  const $prevBtn = $('.carousel-btn--prev');
  const $nextBtn = $('.carousel-btn--next');
  const $dotsWrap = $('.carousel-dots');

  if ($track.length && $prevBtn.length && $nextBtn.length) {
    const $cards = $track.find('.testimonial-card');
    const total = $cards.length;
    let current = 0;

    // Determine visible count based on viewport
    const getVisible = () => $(window).width() <= 768 ? 1 : 3;

    // Build carousel dots
    const buildDots = () => {
      if (!$dotsWrap.length) return;
      $dotsWrap.empty();
      const pages = Math.ceil(total / getVisible());
      for (let i = 0; i < pages; i++) {
        const $dot = $('<button>')
          .addClass('carousel-dot' + (i === 0 ? ' active' : ''))
          .attr('aria-label', `Go to slide ${i + 1}`)
          .on('click', function() {
            goTo(i * getVisible());
          });
        $dotsWrap.append($dot);
      }
    };

    // Update active dot
    const updateDots = () => {
      if (!$dotsWrap.length) return;
      const $dots = $dotsWrap.find('.carousel-dot');
      const page = Math.floor(current / getVisible());
      $dots.each(function(i) {
        $(this).toggleClass('active', i === page);
      });
    };

    // Navigate to index
    const goTo = (idx) => {
      const visible = getVisible();
      const maxIdx = Math.max(0, total - visible);
      current = Math.min(Math.max(idx, 0), maxIdx);
      const cardWidth = $cards.eq(0).outerWidth();
      const gap = parseInt($track.css('gap')) || 24;
      $track.css('transform', `translateX(-${current * (cardWidth + gap)}px)`);
      updateDots();
    };

    // Button click handlers
    $prevBtn.on('click', function() {
      goTo(current - getVisible());
    });

    $nextBtn.on('click', function() {
      goTo(current + getVisible());
    });

    // Touch/swipe support
    let touchStartX = 0;
    $track.on('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
    });
    $track.on('touchend', function(e) {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
    });

    // Initialize
    buildDots();
    $(window).on('resize', function() {
      buildDots();
      goTo(0);
    });
  }

  /* ── 5. Accordion (jQuery) ── */
  $('.accordion-trigger').each(function(idx) {
    const $trigger = $(this);
    const $body = $trigger.next('.accordion-body');

    // First item open by default
    if (idx === 0) {
      $trigger.addClass('open');
      $body.addClass('open');
    }

    $trigger.on('click', function() {
      const isOpen = $trigger.hasClass('open');

      // Close all
      $('.accordion-trigger').removeClass('open');
      $('.accordion-body').removeClass('open');

      // Open clicked if it was closed
      if (!isOpen) {
        $trigger.addClass('open');
        $body.addClass('open');
      }
    });
  });

  /* ── 6. Contact Form Validation + Progress Bar (jQuery) ── */
  const $form = $('#appointment-form');
  if ($form.length) {
    const $progressFill = $('.progress-bar__fill');
    const $progressLabel = $('.progress-bar-label span:last-child');
    const $allRequired = $form.find('[required]');

    // Update progress bar
    const updateProgress = () => {
      let filled = 0;
      $allRequired.each(function() {
        if ($(this).val().trim() !== '') filled++;
      });
      const pct = Math.round((filled / $allRequired.length) * 100);
      $progressFill.css('width', pct + '%');
      $progressLabel.text(pct + '%');
    };

    // Listen for input changes
    $allRequired.on('input', updateProgress);
    updateProgress();

    // Show/clear error messages
    const showError = ($field, msg) => {
      $field.addClass('error');
      const $err = $field.parent().find('.form-error');
      if ($err.length) {
        $err.text(msg).addClass('visible');
      }
    };

    const clearError = ($field) => {
      $field.removeClass('error');
      const $err = $field.parent().find('.form-error');
      if ($err.length) {
        $err.removeClass('visible');
      }
    };

    // Blur validation
    $allRequired.on('blur', function() {
      if (!$(this).val().trim()) {
        showError($(this), 'This field is required.');
      } else {
        clearError($(this));
      }
    });

    // Input validation
    $allRequired.on('input', function() {
      if ($(this).val().trim()) {
        clearError($(this));
      }
    });

    // Email validation
    const $emailField = $form.find('#email');
    if ($emailField.length) {
      $emailField.on('blur', function() {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if ($(this).val() && !re.test($(this).val())) {
          showError($(this), 'Please enter a valid email address.');
        }
      });
    }

    // Form submission
    $form.on('submit', function(e) {
      e.preventDefault();
      let valid = true;

      // Validate all required fields
      $allRequired.each(function() {
        if (!$(this).val().trim()) {
          showError($(this), 'This field is required.');
          valid = false;
        }
      });

      // Validate email
      if ($emailField.length) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if ($emailField.val() && !re.test($emailField.val())) {
          showError($emailField, 'Please enter a valid email address.');
          valid = false;
        }
      }

      if (!valid) return;

      // Loading state
      const $submitBtn = $form.find('.submit-btn');
      $submitBtn.addClass('loading').prop('disabled', true);

      setTimeout(() => {
        $submitBtn.removeClass('loading').prop('disabled', false);
        $form.fadeOut(300);
        const $successMsg = $('.success-msg');
        if ($successMsg.length) {
          $successMsg.addClass('visible').fadeIn(300);
        }
      }, 1800);
    });
  }

  /* ── 7. Smooth scroll for anchor links (jQuery) ── */
  $('a[href^="#"]').on('click', function(e) {
    const href = $(this).attr('href');
    const $target = $(href);

    if ($target.length) {
      e.preventDefault();
      const navH = parseInt($(':root').css('--nav-h')) || 72;
      const top = $target.offset().top - navH;
      $('html, body').animate({ scrollTop: top }, 600);
    }
  });

});
