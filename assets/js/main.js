const FORM_ENDPOINT = 'https://hook.eu1.make.com/nsdlzn1790p9rivhjuq2keg7qqzkqvgy'; // Make.com webhook. Prazdne = fallback na mailto.
const CONTACT_EMAIL = 'jan@spacil.attorney';

(function () {
  'use strict';

  const lang = document.documentElement.lang === 'cs' ? 'cs' : 'en';
  const t = {
    cs: {
      sending: 'Odesílám…',
      sent: 'Děkujeme, zpráva byla odeslána. Ozveme se Vám co nejdříve.',
      error: 'Něco se pokazilo. Zkuste to prosím znovu nebo nám napište na ' + CONTACT_EMAIL + '.',
      required: 'Toto pole je povinné.',
      email: 'Zadejte prosím platnou emailovou adresu.',
      consent: 'Pro odeslání je nutný souhlas se zpracováním osobních údajů.',
      mailSubject: 'Poptávka z webu LegalAdvisors.cz'
    },
    en: {
      sending: 'Sending…',
      sent: 'Thank you, your message has been sent. We will get back to you shortly.',
      error: 'Something went wrong. Please try again or email us at ' + CONTACT_EMAIL + '.',
      required: 'This field is required.',
      email: 'Please enter a valid email address.',
      consent: 'Consent to personal data processing is required.',
      mailSubject: 'Enquiry from LegalAdvisors.cz'
    }
  }[lang];

  /* Footer year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Header shadow on scroll */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Mobile nav */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Language switch keeps the current anchor */
  document.querySelectorAll('[data-lang-link]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.location.hash) {
        link.href = link.getAttribute('href').split('#')[0] + window.location.hash;
      }
    });
  });

  /* Services accordion */
  document.querySelectorAll('.service-trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.service');
      const open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* Contact form */
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = form.querySelector('.form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitLabel = submitBtn.querySelector('.btn-label').textContent;

  function setError(input, message) {
    const err = document.getElementById(input.getAttribute('aria-describedby'));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (err) err.textContent = message || '';
  }

  function validate() {
    let ok = true;
    const name = form.elements.name;
    const email = form.elements.email;
    const message = form.elements.message;
    const consent = form.elements.consent;

    [name, email, message].forEach(function (input) {
      if (!input.value.trim()) {
        setError(input, t.required);
        ok = false;
      } else {
        setError(input, '');
      }
    });
    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setError(email, t.email);
      ok = false;
    }
    if (!consent.checked) {
      status.dataset.state = 'error';
      status.textContent = t.consent;
      ok = false;
    }
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.dataset.state = '';
    status.textContent = '';

    if (form.elements.company.value) return; // honeypot
    if (!validate()) return;

    const data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      message: form.elements.message.value.trim(),
      lang: lang,
      page: window.location.href
    };

    if (!FORM_ENDPOINT) {
      const body = data.message + '\n\n' + data.name + '\n' + data.email + (data.phone ? '\n' + data.phone : '');
      window.location.href =
        'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(t.mailSubject) +
        '&body=' + encodeURIComponent(body);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-label').textContent = t.sending;

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        status.dataset.state = 'ok';
        status.textContent = t.sent;
      })
      .catch(function () {
        status.dataset.state = 'error';
        status.textContent = t.error;
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-label').textContent = submitLabel;
      });
  });
})();
