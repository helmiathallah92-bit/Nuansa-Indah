/**
 * ==========================================================================
 * CAFE NUANSA INDAH - JAVASCRIPT UTAMA (VANILLA JS)
 * Style & Interactivity: Inspired by TOYAN - Coffee & Social Space
 * ==========================================================================
 * DAFTAR FITUR:
 * 1. initThemeManager()            -> Dark / Light Mode Switcher & LocalStorage
 * 2. initMobileDrawer()            -> Off-Canvas Mobile Navigation Drawer
 * 3. initMenuFilter()              -> Filter Tab Kategori Menu
 * 4. initBookingForm()             -> Form Booking Meja Otomatis Kirim ke WhatsApp
 * 5. initScrollSpyAndSmoothScroll() -> Active State Nav Links & Smooth Offset Scrolling
 * 6. initScrollReveal()            -> IntersectionObserver Scroll Animation
 * 7. initStickyHeader()            -> Blur Header Elevation on Scroll
 * ==========================================================================
 */

function initApp() {
  initThemeManager();
  initMobileDrawer();
  initMenuFilter();
  initBookingForm();
  initScrollSpyAndSmoothScroll();
  initScrollReveal();
  initStickyHeader();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* --------------------------------------------------------------------------
   1. PENGATUR TEMA (DARK MODE & LIGHT MODE)
   -------------------------------------------------------------------------- */
function initThemeManager() {
  const themeToggleBtn = document.getElementById('themeToggle');
  const root = document.documentElement;
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  const savedTheme = localStorage.getItem('nuansa-theme');
  let currentTheme = savedTheme ? savedTheme : 'dark';
  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      currentTheme = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
      applyTheme(currentTheme);
      localStorage.setItem('nuansa-theme', currentTheme);
    });
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0E0E11' : '#F8F8FA');
    }
  }
}

/* --------------------------------------------------------------------------
   2. OFF-CANVAS MOBILE DRAWER NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileDrawer || !mobileMenuBtn) return;

  function openDrawer() {
    mobileDrawer.classList.add('active');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('active');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileMenuBtn.addEventListener('click', openDrawer);

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   3. FILTER KATEGORI MENU (SEMUA, KOPI, NON-KOPI, FOODS, PASTRY)
   -------------------------------------------------------------------------- */
function initMenuFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  if (!filterBtns.length || !menuCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const selectedCategory = btn.getAttribute('data-category');

      menuCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. FORM BOOKING MEJA OTOMATIS KIRIM KE WHATSAPP
   -------------------------------------------------------------------------- */
function initBookingForm() {
  const bookingForm = document.getElementById('bookingForm');
  if (!bookingForm) return;

  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('bookingName').value.trim();
    const phone = document.getElementById('bookingPhone').value.trim();
    const guests = document.getElementById('bookingGuests').value;
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    const notes = document.getElementById('bookingNotes').value.trim() || 'Tidak ada catatan tambahan';

    if (!name || !phone || !guests || !date || !time) {
      alert('Mohon lengkapi semua kolom wajib reservasi.');
      return;
    }

    const waAdminNumber = '6281234567890';
    const message = `Halo Admin Cafe Nuansa Indah, saya ingin reservasi meja dengan detail berikut:

👤 *Nama:* ${name}
📱 *No. WhatsApp:* ${phone}
👥 *Jumlah Tamu:* ${guests}
📅 *Tanggal:* ${date}
⏰ *Waktu/Sesi:* ${time} WIB
📝 *Catatan Khusus:* ${notes}

Mohon konfirmasi ketersediaan meja untuk kami. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${waAdminNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });
}

/* --------------------------------------------------------------------------
   5. SCROLL SPY & SMOOTH SCROLL DENGAN OFFSET HEADER
   -------------------------------------------------------------------------- */
function initScrollSpyAndSmoothScroll() {
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('main > section, footer');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const header = document.getElementById('navbar');
        const dynamicHeaderHeight = header ? header.offsetHeight : 76;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - dynamicHeaderHeight + 2;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (id) {
          updateActiveLink(id);
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    if (section.getAttribute('id')) {
      observer.observe(section);
    }
  });

  function updateActiveLink(activeId) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   6. ANIMASI SCROLL REVEAL (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   7. STICKY HEADER ELEVATION SAAT SCROLL
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.getElementById('navbar');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}
