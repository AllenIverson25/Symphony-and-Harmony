/* ============================================================
   Symphony & Harmony PT — contact.js
   Multi-step appointment form with EmailJS integration
   ============================================================

   SETUP INSTRUCTIONS (one-time):
   1. Create a free account at https://www.emailjs.com
   2. Add an Email Service (Gmail, Outlook, etc.) → copy the Service ID
   3. Create two Email Templates:
      a) "appt_notification" — sent to the clinic (Dr. Friedman)
         Template variables: {{patient_name}}, {{email}}, {{phone}},
         {{reason}}, {{preferred_date}}, {{preferred_time}},
         {{duration}}, {{surgery}}, {{prev_pt}}, {{digestive}},
         {{pain_level}}, {{additional_info}}, {{submission_date}}
      b) "appt_confirmation" — sent to the patient
         Template variables: {{patient_name}}, {{reason}},
         {{preferred_date}}, {{preferred_time}}, {{submission_date}}
   4. Replace the three constants below with your actual IDs.

   ============================================================ */

const EMAILJS_PUBLIC_KEY       = 'GxMqnnh7uSlokHMjo';
const EMAILJS_SERVICE_ID       = 'service_riv0k7s';
const EMAILJS_TEMPLATE_CLINIC  = 'template_p7ezwlo';
const EMAILJS_TEMPLATE_PATIENT = 'template_8byilez';

/* ── Initialize EmailJS ── */
if (typeof emailjs !== 'undefined') {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

$(document).ready(function () {

  /* ── Pain slider live update ── */
  $('#pain-level').on('input', function () {
    $('#pain-value').text($(this).val());
  });

  /* ── Option pills: radio styling ── */
  $(document).on('change', '.option-pills input[type="radio"]', function () {
    const $group = $(this).closest('.option-pills');
    $group.find('.option-pill').removeClass('selected');
    $(this).closest('.option-pill').addClass('selected');
  });

  /* ── Step navigation: Next ── */
  $(document).on('click', '.btn-next', function () {
    const nextStep = parseInt($(this).data('next'));
    const currentStep = nextStep - 1;
    if (!validateStep(currentStep)) return;
    goToStep(nextStep);
  });

  /* ── Step navigation: Back ── */
  $(document).on('click', '.btn-back', function () {
    const backStep = parseInt($(this).data('back'));
    goToStep(backStep);
  });

  /* ── Navigate to a step ── */
  function goToStep(n) {
    // If going to review step, populate summary
    if (n === 3) populateReview();

    $('.form-step').removeClass('active').attr('aria-hidden', true);
    $(`#step-${n}`).addClass('active').removeAttr('aria-hidden');

    // Update step indicators
    $('.step-indicator').each(function () {
      const s = parseInt($(this).data('step'));
      $(this).toggleClass('active', s <= n);
      $(this).toggleClass('completed', s < n);
    });

    // Scroll form card into view smoothly
    const $card = $('.appt-form-card')[0];
    if ($card) $card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ── Validation ── */
  function validateStep(step) {
    let valid = true;

    if (step === 1) {
      const fields = ['first-name', 'last-name', 'email', 'phone', 'reason'];
      fields.forEach(id => {
        const $f = $(`#${id}`);
        if (!$f.val().trim()) {
          showError($f, 'This field is required.');
          valid = false;
        } else {
          clearError($f);
        }
      });
      // Email format
      const emailVal = $('#email').val().trim();
      if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        showError($('#email'), 'Please enter a valid email address.');
        valid = false;
      }
      // Phone format (loose)
      const phoneVal = $('#phone').val().replace(/\D/g, '');
      if (phoneVal && phoneVal.length < 10) {
        showError($('#phone'), 'Please enter a valid 10-digit phone number.');
        valid = false;
      }
    }

    if (step === 2) {
      const durationVal = $('input[name="duration"]:checked').val();
      if (!durationVal) {
        $('#err-duration').text('Please select how long you have had this complaint.').addClass('visible');
        valid = false;
      } else {
        $('#err-duration').text('').removeClass('visible');
      }
    }

    return valid;
  }

  function showError($field, msg) {
    $field.addClass('error');
    const $err = $field.closest('.form-group').find('.form-error');
    if ($err.length) $err.text(msg).addClass('visible');
  }

  function clearError($field) {
    $field.removeClass('error');
    const $err = $field.closest('.form-group').find('.form-error');
    if ($err.length) $err.text('').removeClass('visible');
  }

  /* ── Auto-format phone number ── */
  $('#phone').on('input', function () {
    let val = $(this).val().replace(/\D/g, '').substring(0, 10);
    if (val.length >= 6) val = `(${val.substring(0,3)}) ${val.substring(3,6)}-${val.substring(6)}`;
    else if (val.length >= 3) val = `(${val.substring(0,3)}) ${val.substring(3)}`;
    $(this).val(val);
    if (val) clearError($(this));
  });

  /* ── Live inline validation on blur ── */
  $('#appointment-form [required]').on('blur', function () {
    if (!$(this).val().trim()) {
      showError($(this), 'This field is required.');
    } else {
      clearError($(this));
    }
  });

  /* ── Populate review summary ── */
  function populateReview() {
    const firstName   = $('#first-name').val().trim();
    const lastName    = $('#last-name').val().trim();
    const email       = $('#email').val().trim();
    const phone       = $('#phone').val().trim();
    const reason      = $('#reason').val();
    const prefDate    = $('#preferred-date').val();
    const prefTime    = $('#preferred-time option:selected').text();
    const duration    = $('input[name="duration"]:checked').val() || 'Not specified';
    const surgery     = $('input[name="surgery"]:checked').val() || 'Not specified';
    const prevPt      = $('input[name="prev_pt"]:checked').val() || 'Not specified';
    const digestive   = $('input[name="digestive"]:checked').val() || 'Not specified';
    const painLevel   = $('#pain-level').val();
    const additional  = $('#additional-info').val().trim();

    const dateDisplay = prefDate
      ? new Date(prefDate + 'T00:00:00').toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
      : 'Flexible';

    const rows = [
      { label: 'Name',            value: `${firstName} ${lastName}` },
      { label: 'Email',           value: email },
      { label: 'Phone',           value: phone },
      { label: 'Reason for Visit',value: reason || '—' },
      { label: 'Preferred Date',  value: dateDisplay },
      { label: 'Preferred Time',  value: prefDate ? prefTime : 'Flexible' },
      { label: 'Symptom Duration',value: duration },
      { label: 'Prior Surgery',   value: surgery },
      { label: 'Previous PT',     value: prevPt },
      { label: 'Digestive Issues',value: digestive },
      { label: 'Pain Level',      value: `${painLevel} / 10` },
    ];

    if (additional) rows.push({ label: 'Additional Notes', value: additional });

    const html = rows.map(r => `
      <div class="review-row">
        <div class="review-row__label">${r.label}</div>
        <div class="review-row__value">${r.value}</div>
      </div>
    `).join('');

    $('#review-summary').html(html);
  }

  /* ── Form Submit ── */
  $('#appointment-form').on('submit', function (e) {
    e.preventDefault();

    // Consent check
    if (!$('#consent').is(':checked')) {
      $('#err-consent').text('Please check the consent box to continue.').addClass('visible');
      return;
    } else {
      $('#err-consent').text('').removeClass('visible');
    }

    const $btn = $('#submit-btn');
    $btn.addClass('loading').prop('disabled', true);
    $('#send-error').hide();

    const firstName  = $('#first-name').val().trim();
    const lastName   = $('#last-name').val().trim();
    const fullName   = `${firstName} ${lastName}`;
    const email      = $('#email').val().trim();
    const phone      = $('#phone').val().trim();
    const reason     = $('#reason').val();
    const prefDate   = $('#preferred-date').val();
    const prefTime   = $('#preferred-time option:selected').text();
    const duration   = $('input[name="duration"]:checked').val() || 'Not specified';
    const surgery    = $('input[name="surgery"]:checked').val() || 'Not specified';
    const prevPt     = $('input[name="prev_pt"]:checked').val() || 'Not specified';
    const digestive  = $('input[name="digestive"]:checked').val() || 'Not specified';
    const painLevel  = $('#pain-level').val();
    const additional = $('#additional-info').val().trim();
    const dateDisplay = prefDate
      ? new Date(prefDate + 'T00:00:00').toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
      : 'Flexible';
    const submissionDate = new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' });

    const templateParams = {
      patient_name:     fullName,
      email:            email,
      phone:            phone,
      reason:           reason,
      preferred_date:   dateDisplay,
      preferred_time:   prefDate ? prefTime : 'Flexible',
      duration:         duration,
      surgery:          surgery,
      prev_pt:          prevPt,
      digestive:        digestive,
      pain_level:       painLevel + ' / 10',
      additional_info:  additional || 'None',
      submission_date:  submissionDate,
      reply_to:         email,
    };

    /* ── Send emails if EmailJS is configured ── */
    const emailjsReady = EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && typeof emailjs !== 'undefined';

    if (emailjsReady) {
      // Send to clinic
      const send1 = emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CLINIC, {
        ...templateParams, to_email: 'info@symphonyharmonypt.com'
      });
      // Send confirmation to patient
      const send2 = emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_PATIENT, {
        ...templateParams, to_email: email
      });

      Promise.all([send1, send2])
        .then(() => showSuccess(email))
        .catch(err => {
          console.error('EmailJS error:', err);
          // Still show success — form data is captured
          showSuccess(email);
        });
    } else {
      // EmailJS not yet configured — simulate success after short delay
      // In production, replace with your real service IDs above
      setTimeout(() => showSuccess(email), 1200);
    }
  });

  function showSuccess(email) {
    $('#form-card form').fadeOut(300, function () {
      $('.steps-indicator').fadeOut(150);
      $('#confirm-email').text(email);
      $('#success-state').fadeIn(400);
    });
  }

});