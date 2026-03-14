/* ============================================================
   DAR ZITOUN — script.js
   Handles: Navbar, Mobile Menu, Menu Expand Cards,
            Category Tabs, Scroll Reveal, Reservation Form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR scroll effect ─────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load


  /* ── 2. MOBILE MENU toggle ───────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Animate hamburger to X
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      const spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });


  /* ── 3. MENU CARD expand / collapse ─────────────────────── */
  const menuCards = document.querySelectorAll('.menu-card');

  menuCards.forEach(card => {
    const top = card.querySelector('.menu-card-top');

    top.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');

      // Close all others (accordion behaviour)
      menuCards.forEach(c => {
        if (c !== card) c.classList.remove('open');
      });

      // Toggle this card
      card.classList.toggle('open', !isOpen);

      // Smooth scroll to keep card in view
      if (!isOpen) {
        setTimeout(() => {
          const rect = card.getBoundingClientRect();
          const offset = rect.top + window.scrollY - 100;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }, 50);
      }
    });
  });


  /* ── 4. CATEGORY TABS filter ────────────────────────────── */
  const tabBtns  = document.querySelectorAll('.tab-btn');
  const menuGrid = document.getElementById('menuGrid');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active tab
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category;

      menuCards.forEach(card => {
        const cardCat = card.dataset.category;
        const matches = (category === 'all') || (cardCat === category);

        if (matches) {
          card.classList.remove('hidden');
          // Stagger fade-in
          card.style.animation = 'none';
          card.offsetHeight; // trigger reflow
          card.style.animation = 'fadeUp 0.45s ease both';
        } else {
          card.classList.add('hidden');
          card.classList.remove('open');
        }
      });
    });
  });


  /* ── 5. SCROLL REVEAL (Intersection Observer) ───────────── */
  const revealEls = document.querySelectorAll(
    '.highlight-item, .about-text, .about-image-wrap, .menu-card, .gallery-item, .reservation-text, .reservation-form, .stat'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on position in parent
        const siblings = Array.from(entry.target.parentElement.children);
        const index    = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 0.07}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ── 6. RESERVATION FORM ────────────────────────────────── */
  const form  = document.getElementById('reservationForm');
  const toast = document.getElementById('toast');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect form data
    const inputs = form.querySelectorAll('input, select, textarea');
    let valid = true;

    inputs.forEach(input => {
      if (input.required && !input.value.trim()) {
        valid = false;
        input.style.borderColor = '#E24B4A';
        input.addEventListener('input', () => {
          input.style.borderColor = '';
        }, { once: true });
      }
    });

    if (!valid) return;

    // Simulate submission
    const submitBtn = form.querySelector('.btn-gold');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = '✓ Reservation Sent!';
      submitBtn.style.background = '#1A4A3A';

      // Show toast
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);

      // Reset after delay
      setTimeout(() => {
        form.reset();
        submitBtn.textContent = 'Confirm Reservation';
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    }, 1200);
  });


  /* ── 7. SMOOTH SCROLL for anchor links ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });


  /* ── 8. GALLERY hover depth effect ──────────────────────── */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect   = item.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      item.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
      item.style.transition = 'transform 0.5s ease';
    });

    item.addEventListener('mouseenter', () => {
      item.style.transition = 'transform 0.15s ease';
    });
  });


  /* ── 9. Active nav link highlight on scroll ─────────────── */
  const sections = document.querySelectorAll('section[id], .menu-section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        allNavLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--gold-light)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));


  /* ── 10. Menu card — keyboard accessibility ─────────────── */
  menuCards.forEach(card => {
    const top = card.querySelector('.menu-card-top');
    top.setAttribute('tabindex', '0');
    top.setAttribute('role', 'button');

    top.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        top.click();
      }
    });
  });

});
