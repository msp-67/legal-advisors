const FORM_ENDPOINT = 'https://hook.eu1.make.com/nsdlzn1790p9rivhjuq2keg7qqzkqvgy'; // Make.com webhook. Prazdne = fallback na mailto.
const CONTACT_EMAIL = 'jan@spacil.attorney';

(function () {
  'use strict';

  const lang = document.documentElement.lang === 'cs' ? 'cs' : 'en';
  const t = {
    cs: {
      sending: 'Odesílám…',
      sent: 'Děkuji, zpráva byla odeslána. Ozvu se Vám co nejdříve.',
      error: 'Něco se pokazilo. Zkuste to prosím znovu nebo mi napište na ' + CONTACT_EMAIL + '.',
      required: 'Toto pole je povinné.',
      email: 'Zadejte prosím platnou emailovou adresu.',
      consent: 'Pro odeslání je nutný souhlas se zpracováním osobních údajů.',
      mailSubject: 'Poptávka z webu LegalAdvisors.cz'
    },
    en: {
      sending: 'Sending…',
      sent: 'Thank you, your message has been sent. I will get back to you shortly.',
      error: 'Something went wrong. Please try again or email me at ' + CONTACT_EMAIL + '.',
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

  /* ---------- Cookie banner ----------
     Zadne cookies ani skripty se nespousti pred volbou uzivatele.
     Volba se uklada do localStorage pod klicem la-cookie-consent. */
  const CONSENT_KEY = 'la-cookie-consent';

  const cookieCopy = {
    cs: {
      title: 'Používáme cookies',
      text: 'Nezbytné cookies používáme k zajištění správného fungování webu. Se svým souhlasem nám umožníte používat také analytické cookies, které nám pomáhají pochopit, jak návštěvníci web využívají, abychom jej mohli zlepšovat.',
      accept: 'Přijmout vše',
      essential: 'Pouze nezbytné',
      policy: 'Zásady cookies',
      policyHref: '/cz/zasady-cookies/',
      label: 'Nastavení souhlasu s cookies'
    },
    en: {
      title: 'We use cookies',
      text: 'We use essential cookies to keep this website running, and — with your consent — analytics cookies to help us understand how visitors use the site so we can improve it.',
      accept: 'Accept all',
      essential: 'Essential only',
      policy: 'Cookie Policy',
      policyHref: '/cookie-policy/',
      label: 'Cookie consent settings'
    }
  }[lang];

  function readConsent() {
    try {
      return window.localStorage.getItem(CONSENT_KEY);
    } catch (err) {
      return null;
    }
  }

  function writeConsent(value) {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch (err) {
      /* localStorage nedostupne (private mode) — volba plati jen pro tuto navstevu */
    }
  }

  function clearConsent() {
    try {
      window.localStorage.removeItem(CONSENT_KEY);
    } catch (err) {
      /* nic */
    }
  }

  /* Misto pro budouci analytiku. Volat pouze pri souhlasu 'all'. */
  function enableAnalytics() {}

  let banner = null;

  function buildBanner() {
    const el = document.createElement('aside');
    el.className = 'cookie-banner';
    el.id = 'cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', cookieCopy.label);
    el.setAttribute('aria-describedby', 'cookie-banner-text');
    el.tabIndex = -1;

    const inner = document.createElement('div');
    inner.className = 'container cookie-inner';

    const copy = document.createElement('div');
    copy.className = 'cookie-copy';
    const title = document.createElement('p');
    title.className = 'cookie-title';
    title.textContent = cookieCopy.title;
    const text = document.createElement('p');
    text.className = 'cookie-text';
    text.id = 'cookie-banner-text';
    text.textContent = cookieCopy.text;
    copy.appendChild(title);
    copy.appendChild(text);

    const actions = document.createElement('div');
    actions.className = 'cookie-actions';

    const acceptBtn = document.createElement('button');
    acceptBtn.type = 'button';
    acceptBtn.className = 'btn btn-primary';
    acceptBtn.textContent = cookieCopy.accept;
    acceptBtn.addEventListener('click', function () {
      choose('all');
    });

    const essentialBtn = document.createElement('button');
    essentialBtn.type = 'button';
    essentialBtn.className = 'btn btn-outline';
    essentialBtn.textContent = cookieCopy.essential;
    essentialBtn.addEventListener('click', function () {
      choose('essential');
    });

    const policyLink = document.createElement('a');
    policyLink.className = 'cookie-link';
    policyLink.href = cookieCopy.policyHref;
    policyLink.textContent = cookieCopy.policy;

    actions.appendChild(acceptBtn);
    actions.appendChild(essentialBtn);
    actions.appendChild(policyLink);

    inner.appendChild(copy);
    inner.appendChild(actions);
    el.appendChild(inner);
    document.body.appendChild(el);
    return el;
  }

  function showBanner(focus) {
    if (!banner) banner = buildBanner();
    banner.hidden = false;
    if (focus) banner.focus();
  }

  function choose(value) {
    writeConsent(value);
    if (banner) banner.hidden = true;
    if (value === 'all') enableAnalytics();
  }

  const storedConsent = readConsent();
  if (storedConsent === 'all') {
    enableAnalytics();
  } else if (storedConsent !== 'essential') {
    showBanner(false);
  }

  document.querySelectorAll('[data-cookie-settings]').forEach(function (el) {
    el.addEventListener('click', function () {
      clearConsent();
      showBanner(true);
    });
  });

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
