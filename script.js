// EliteStaff - Main JavaScript

// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', function() {

  if (window.AOS) {
    AOS.init({
      once: true,
      duration: 900,
      offset: 80,
      easing: 'ease-out-cubic'
    });
  }

  if (document.body.classList.contains('standalone-page') && !window.location.hash) {
    window.scrollTo(0, 0);
  }

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Don't prevent default for links with just "#"
      if (href === '#') {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add active state to navigation on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavigation);

  // Count up numeric stats when they enter the viewport
  const countTargets = document.querySelectorAll('[data-count-to]');

  if (countTargets.length) {
    const animateCount = (element) => {
      const target = Number(element.getAttribute('data-count-to')) || 0;
      const suffix = element.getAttribute('data-count-suffix') || '';
      const duration = Number(element.getAttribute('data-count-duration')) || 1700;
      const startTime = performance.now();

      function tick(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${Math.round(target * easedProgress)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          element.textContent = `${target}${suffix}`;
        }
      }

      requestAnimationFrame(tick);
    };

    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.45
    });

    countTargets.forEach(target => countObserver.observe(target));
  }

  // Mobile menu toggle with error handling
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Make service cards open their detail pages reliably when the media area is clicked
  const serviceMediaCards = document.querySelectorAll('.service-card-media[data-href]');
  serviceMediaCards.forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.closest('a.btn-outline')) {
        return;
      }

      const href = this.getAttribute('data-href');
      if (href) {
        window.location.href = href;
      }
    });
  });

  if (hamburger && mobileMenu) {
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    const mobileNavLinks = mobileMenu.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Allow navigation to happen
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });

    // Close menu when clicking outside nav
    document.addEventListener('click', function(e) {
      if (!e.target.closest('nav')) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    });

    console.log('Mobile menu initialized successfully');
  } else {
    console.warn('Mobile menu elements not found. Mobile menu will not work.');
    if (!hamburger) console.warn('Hamburger element with id="hamburger" not found');
    if (!mobileMenu) console.warn('Mobile menu element with id="mobileMenu" not found');
  }

  // Parallax - lightweight transform-based layers for hero
  (function() {
    const heroEl = document.querySelector('.hero');
    const parallaxLayers = [
      { el: document.querySelector('.hero-bg'), speed: 0.18 },
      { el: document.querySelector('.hero-pattern'), speed: 0.35 },
      { el: document.querySelector('.hero-glow'), speed: 0.55 },
      { el: document.querySelector('.hero-brand-logo'), speed: 0.9 }
    ].filter(l => l.el);

    if (!heroEl || parallaxLayers.length === 0) return;

    let ticking = false;

    function updateParallax() {
      ticking = false;
      const heroTop = heroEl.offsetTop;
      const scrolled = window.pageYOffset - heroTop;
      parallaxLayers.forEach(layer => {
        const y = Math.round(scrolled * layer.speed);
        layer.el.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateParallax);
    updateParallax();
  })();

  // Scroll-triggered animations
  (function() {
    // Apply scroll-reveal class to all sections and cards
    const elementsToReveal = document.querySelectorAll(
      'section:not(.hero), .service-card, .detail-card, .about-card, .contact-card, .service-detail-section'
    );
    elementsToReveal.forEach(el => {
      if (!el.classList.contains('service-card')) {
        el.classList.add('scroll-reveal');
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
  })();

  // Service cards stagger animation on visibility
  (function() {
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) return;

    const cards = servicesGrid.querySelectorAll('.service-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => observer.observe(card));
  })();

  console.log('EliteStaff site loaded successfully with professional animations');
});

