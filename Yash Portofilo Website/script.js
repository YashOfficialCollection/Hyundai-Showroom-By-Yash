/* script.js
   Implements:
   - particles background
   - glass navbar dropdown + mobile simple toggle
   - fade-in on scroll (IntersectionObserver)
   - counters (once visible)
   - modal popup for course cards
   - dark/light mode (localStorage)
   - back-to-top & scroll progress
   - search filter (simple)
   - optional EmailJS send (placeholder)
*/

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------- Particles Background -------------------- */
  // If particles.js is loaded, initialize a simple config.
  if (window.particlesJS) {
    particlesJS('particles-js', {
      "particles": {
        "number": { "value": 40 },
        "color": { "value": ["#38bdf8","#60a5fa","#93c5fd"] },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.6 },
        "size": { "value": 3 },
        "line_linked": { "enable": true, "distance": 150, "color": "#38bdf8", "opacity": 0.08 },
        "move": { "enable": true, "speed": 1.5 }
      },
      "interactivity": {
        "events": {
          "onhover": { "enable": true, "mode": "grab" },
          "onclick": { "enable": true, "mode": "push" }
        },
        "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.2 } } }
      },
      "retina_detect": true
    });
  }

  /* -------------------- Preloader -------------------- */
  window.addEventListener('load', () => {
    const pre = document.getElementById('preloader');
    if (pre) pre.style.display = 'none';
  });

  /* -------------------- Dropdowns & Menu toggle -------------------- */
  const dropBtn = document.querySelector('.has-dropdown .drop-btn');
  const dropdown = document.querySelector('.has-dropdown .dropdown');
  if (dropBtn && dropdown) {
    dropBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });
  }
  document.addEventListener('click', () => {
    if (dropdown) dropdown.classList.remove('show');
  });

  // mobile menu simple toggler (shows nav-list)
  const menuToggle = document.getElementById('menuToggle');
  const navList = document.querySelector('.nav-list');
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => navList.classList.toggle('show'));
  }

  /* -------------------- Typed hero text (simple) -------------------- */
  const typedEl = document.getElementById('typed');
  const typedPhrases = ["Learn. Build. Grow.", "Master your skills.", "Launch your career."];
  let tp_i = 0, tp_j = 0, tp_del = false;
  function typeLoop(){
    const full = typedPhrases[tp_i];
    if (!tp_del) {
      tp_j++;
      typedEl.textContent = full.slice(0,tp_j);
      if (tp_j === full.length) { tp_del = true; setTimeout(typeLoop, 900); return; }
      setTimeout(typeLoop, 90);
    } else {
      tp_j--;
      typedEl.textContent = full.slice(0,tp_j);
      if (tp_j === 0) { tp_del = false; tp_i = (tp_i+1)%typedPhrases.length; setTimeout(typeLoop, 200); return; }
      setTimeout(typeLoop, 45);
    }
  }
  if (typedEl) typeLoop();

  /* -------------------- Fade-in on scroll (IntersectionObserver) -------------------- */
  const animated = document.querySelectorAll('.animate');
  const animObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        ent.target.classList.add('visible');
        obs.unobserve(ent.target);
      }
    });
  }, { threshold: 0.12 });
  animated.forEach(el => animObserver.observe(el));

  /* -------------------- Counters (animate once when visible) -------------------- */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target || 0;
        let current = 0;
        const duration = 1200; // ms
        const stepTime = Math.max(10, Math.floor(duration / target));
        const timer = setInterval(() => {
          current += Math.max(1, Math.floor(target / (duration / stepTime)));
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = current;
          }
        }, stepTime);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObserver.observe(c));

  /* -------------------- Modal for Course Cards -------------------- */
  function openCourseModal(title, description) {
    // backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) document.body.removeChild(backdrop);
    });

    // modal
    const modal = document.createElement('div');
    modal.className = 'modal animate visible';

    modal.innerHTML = `
      <button class="close-btn" aria-label="Close">&times;</button>
      <h3>${title}</h3>
      <p style="color:var(--muted); margin-bottom:8px">${description}</p>
      <div style="display:flex;gap:10px;margin-top:12px">
        <a class="btn" href="#contact">Enroll Now</a>
        <button class="btn ghost close-modal">Close</button>
      </div>
    `;
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    // close handlers
    modal.querySelector('.close-btn').addEventListener('click', () => document.body.removeChild(backdrop));
    modal.querySelector('.close-modal').addEventListener('click', () => document.body.removeChild(backdrop));
  }

  // attach click to course cards
  document.querySelectorAll('#courses .card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const h = card.querySelector('h3') ? card.querySelector('h3').innerText : 'Course';
      const p = card.querySelector('p') ? card.querySelector('p').innerText : '';
      openCourseModal(h, p);
    });
  });

  /* -------------------- Dark / Light theme with localStorage -------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const localTheme = localStorage.getItem('site-theme');
  if (localTheme === 'light') document.body.classList.add('light-theme');
  else document.body.classList.remove('light-theme');

  themeToggle && themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('site-theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
    themeToggle.textContent = document.body.classList.contains('light-theme') ? '🌙' : '☀️';
  });

  /* set initial icon */
  if (themeToggle) {
    themeToggle.textContent = document.body.classList.contains('light-theme') ? '🌙' : '☀️';
  }

  /* -------------------- Back to top & progress bar -------------------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (backToTop) backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    // progress
    const progress = document.getElementById('scrollProgress');
    if (progress) {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      progress.style.width = `${scrolled}%`;
    }
  });
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  /* -------------------- Simple search for courses -------------------- */
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('search');
  searchBtn && searchBtn.addEventListener('click', () => {
    const q = (searchInput.value || '').trim().toLowerCase();
    document.querySelectorAll('#courses .card').forEach(card => {
      const text = (card.innerText || '').toLowerCase();
      card.style.display = q ? (text.includes(q) ? '' : 'none') : '';
    });
  });

  /* -------------------- Contact form (EmailJS placeholder) -------------------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm && window.emailjs) {
    // initialize emailjs - put your userID if needed:
    // emailjs.init('YOUR_USER_ID');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // prepare template params (adjust input names/template keys accordingly)
      const params = {
        from_name: contactForm.name.value,
        from_email: contactForm.email.value,
        message: contactForm.message.value
      };
      // show simple sending UI
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.disabled = true; submitBtn.innerText = 'Sending...';

      // Example send — replace service_id & template_id with yours
      /* emailjs.send('your_service_id','your_template_id', params)
        .then(() => {
          submitBtn.innerText = 'Sent ✓';
          setTimeout(()=> { submitBtn.disabled=false; submitBtn.innerText=originalText; contactForm.reset(); }, 1500);
        }, (err) => {
          alert('Error sending message'); submitBtn.disabled=false; submitBtn.innerText=originalText;
        }); */

      // For demo without credentials, simulate success:
      setTimeout(() => {
        submitBtn.innerText = 'Sent ✓';
        setTimeout(()=> { submitBtn.disabled=false; submitBtn.innerText=originalText; contactForm.reset(); }, 1200);
      }, 900);
    });
  }

  /* -------------------- Dynamic Year -------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
