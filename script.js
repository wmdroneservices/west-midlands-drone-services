/* =========================================================
   WEST MIDLANDS DRONE SERVICES — SCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile navigation ---------- */
  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');

  if (toggle && header && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close menu when a nav link is clicked
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });

    // Close menu on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        toggle.focus();
      }
    });
  }

  /* ---------- Quote form validation & submission ---------- */
  var form = document.getElementById('quoteForm');
  if (!form) return;

  var statusBox = document.getElementById('formStatus');

  var requiredFields = [
    { id: 'fullName', errorId: 'fullName-error', type: 'text' },
    { id: 'email', errorId: 'email-error', type: 'email' },
    { id: 'telephone', errorId: 'telephone-error', type: 'text' },
    { id: 'address', errorId: 'address-error', type: 'text' },
    { id: 'service', errorId: 'service-error', type: 'text' },
    { id: 'description', errorId: 'description-error', type: 'text' },
    { id: 'consent', errorId: 'consent-error', type: 'checkbox' }
  ];

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function showError(field) {
    var el = document.getElementById(field.id);
    var errorEl = document.getElementById(field.errorId);
    if (el) el.setAttribute('aria-invalid', 'true');
    if (errorEl) errorEl.classList.add('visible');
  }

  function clearError(field) {
    var el = document.getElementById(field.id);
    var errorEl = document.getElementById(field.errorId);
    if (el) el.removeAttribute('aria-invalid');
    if (errorEl) errorEl.classList.remove('visible');
  }

  function validateForm() {
    var isValid = true;
    var firstInvalid = null;

    requiredFields.forEach(function (field) {
      var el = document.getElementById(field.id);
      if (!el) return;

      var fieldValid = true;

      if (field.type === 'checkbox') {
        fieldValid = el.checked;
      } else {
        var value = el.value.trim();
        fieldValid = value.length > 0;
        if (fieldValid && field.type === 'email') {
          fieldValid = isValidEmail(value);
        }
      }

      if (fieldValid) {
        clearError(field);
      } else {
        showError(field);
        isValid = false;
        if (!firstInvalid) firstInvalid = el;
      }
    });

    if (firstInvalid) firstInvalid.focus();
    return isValid;
  }

  // Clear individual field errors as the user corrects them
  requiredFields.forEach(function (field) {
    var el = document.getElementById(field.id);
    if (!el) return;
    var eventName = (field.type === 'checkbox') ? 'change' : 'input';
    el.addEventListener(eventName, function () {
      if (field.type === 'checkbox') {
        if (el.checked) clearError(field);
      } else {
        var value = el.value.trim();
        var ok = value.length > 0 && (field.type !== 'email' || isValidEmail(value));
        if (ok) clearError(field);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    statusBox.classList.remove('success', 'error', 'visible');
    statusBox.textContent = '';

    if (!validateForm()) {
      statusBox.textContent = 'Please check the highlighted fields and try again.';
      statusBox.classList.add('error', 'visible');
      return;
    }

    var endpoint = form.getAttribute('action');

    if (!endpoint || endpoint === 'YOUR_FORM_ENDPOINT_HERE') {
      statusBox.textContent = 'This form is not yet connected to a live email endpoint. Add your Formspree or Web3Forms endpoint in services.html to enable submissions.';
      statusBox.classList.add('error', 'visible');
      return;
    }

    var submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
    }

    var formData = new FormData(form);

    fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          form.reset();
          statusBox.textContent = "Thank you. Your quote request has been received. We'll review your requirements and get back to you.";
          statusBox.classList.add('success', 'visible');
        } else {
          statusBox.textContent = "Sorry, something went wrong sending your request. Please try again, or contact us directly by phone or email.";
          statusBox.classList.add('error', 'visible');
        }
      })
      .catch(function () {
        statusBox.textContent = "Sorry, something went wrong sending your request. Please check your internet connection and try again, or contact us directly by phone or email.";
        statusBox.classList.add('error', 'visible');
      })
      .finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Request a Quote';
        }
      });
  });

});
