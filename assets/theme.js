/**
 * KitchenMixHaven - Theme Engine JavaScript
 * Modular client JS for AJAX Cart, Search, Wishlist, Compare, Configurator, & Dark Mode
 */

document.addEventListener('DOMContentLoaded', () => {
  KMHTheme.init();
});

const KMHTheme = {
  init() {
    this.initStickyHeader();
    this.initCartDrawer();
    this.initSearchOverlay();
    this.initQuickView();
    this.initWishlist();
    this.initCompare();
    this.initAccordions();
    this.initQuantitySelectors();
    this.initTimers();
    this.initMobileNav();
    this.initDarkMode();
    this.initRecipeScaler();
  },

  // Dark Mode Switcher
  initDarkMode() {
    const toggles = document.querySelectorAll('[data-dark-toggle]');
    const isDark = localStorage.getItem('kmh_dark_mode') === 'true';

    if (isDark) {
      document.body.classList.add('dark-mode');
    }

    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const active = document.body.classList.toggle('dark-mode');
        localStorage.setItem('kmh_dark_mode', active);
      });
    });
  },

  // Interactive Recipe Batch Scaler
  initRecipeScaler() {
    const scalerBtns = document.querySelectorAll('[data-recipe-multiplier]');
    if (!scalerBtns.length) return;

    scalerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        scalerBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mult = parseFloat(btn.getAttribute('data-recipe-multiplier')) || 1;

        document.querySelectorAll('[data-ingredient-base]').forEach(item => {
          const base = parseFloat(item.getAttribute('data-ingredient-base'));
          const unit = item.getAttribute('data-ingredient-unit') || 'g';
          if (!isNaN(base)) {
            const val = Math.round(base * mult);
            item.textContent = `${val}${unit}`;
          }
        });

        // Capacity alert message
        const alertEl = document.querySelector('#KMH-CapacityAlert');
        if (alertEl) {
          if (mult >= 4) {
            alertEl.style.display = 'block';
            alertEl.innerHTML = '⚠️ <strong>Capacity Warning:</strong> A 4x batch requires a 7.5QT high-torque mixer bowl.';
          } else {
            alertEl.style.display = 'none';
          }
        }
      });
    });
  },

  // Sticky Header Scroll Handler
  initStickyHeader() {
    const header = document.querySelector('.kmh-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  },

  // AJAX Cart Drawer
  initCartDrawer() {
    const overlay = document.querySelector('#KMH-CartOverlay');
    const drawer = document.querySelector('#KMH-CartDrawer');
    const triggers = document.querySelectorAll('[data-cart-trigger]');
    const closeBtns = document.querySelectorAll('[data-cart-close]');

    if (!drawer) return;

    const openCart = () => {
      overlay?.classList.add('active');
      drawer.classList.add('active');
      document.body.classList.add('scroll-locked');
    };

    const closeCart = () => {
      overlay?.classList.remove('active');
      drawer.classList.remove('active');
      document.body.classList.remove('scroll-locked');
    };

    triggers.forEach(trigger => trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    }));

    closeBtns.forEach(btn => btn.addEventListener('click', closeCart));
    overlay?.addEventListener('click', closeCart);

    window.KMH_OpenCart = openCart;
  },

  // Live Predictive Search Overlay
  initSearchOverlay() {
    const overlay = document.querySelector('#KMH-SearchOverlay');
    const input = document.querySelector('#KMH-SearchInput');
    const triggers = document.querySelectorAll('[data-search-trigger]');
    const closeBtns = document.querySelectorAll('[data-search-close]');
    const resultsContainer = document.querySelector('#KMH-SearchResults');

    if (!overlay || !input) return;

    const openSearch = () => {
      overlay.classList.add('active');
      document.body.classList.add('scroll-locked');
      setTimeout(() => input.focus(), 200);
    };

    const closeSearch = () => {
      overlay.classList.remove('active');
      document.body.classList.remove('scroll-locked');
    };

    triggers.forEach(trig => trig.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    }));

    closeBtns.forEach(btn => btn.addEventListener('click', closeSearch));

    input.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!resultsContainer) return;

      if (query.length < 2) {
        resultsContainer.innerHTML = '<p style="color:#64748B;">Type at least 2 characters to search appliances, recipes, or guides...</p>';
        return;
      }

      resultsContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
          <div class="kmh-card" style="padding: 1rem; text-align: center;">
            <div style="font-weight: 700;">Stand Mixer Pro 7QT</div>
            <div style="color: var(--kmh-gold); font-weight: 700;">$499.00</div>
          </div>
          <div class="kmh-card" style="padding: 1rem; text-align: center;">
            <div style="font-weight: 700;">High-Speed Blender 1500W</div>
            <div style="color: var(--kmh-gold); font-weight: 700;">$249.00</div>
          </div>
          <div class="kmh-card" style="padding: 1rem; text-align: center;">
            <div style="font-weight: 700;">Precision Coffee Espresso</div>
            <div style="color: var(--kmh-gold); font-weight: 700;">$599.00</div>
          </div>
        </div>
      `;
    });
  },

  // Quick View Modal
  initQuickView() {
    const modal = document.querySelector('#KMH-QuickViewModal');
    const overlay = document.querySelector('#KMH-QuickViewOverlay');
    const triggers = document.querySelectorAll('[data-quickview]');
    const closeBtns = document.querySelectorAll('[data-quickview-close]');

    if (!modal) return;

    triggers.forEach(trig => {
      trig.addEventListener('click', (e) => {
        e.preventDefault();
        const title = trig.getAttribute('data-title') || 'KitchenMixHaven Appliance';
        const price = trig.getAttribute('data-price') || '$299.00';
        const image = trig.getAttribute('data-image') || '';

        const titleEl = modal.querySelector('[data-qv-title]');
        const priceEl = modal.querySelector('[data-qv-price]');
        const imgEl = modal.querySelector('[data-qv-image]');

        if (titleEl) titleEl.textContent = title;
        if (priceEl) priceEl.textContent = price;
        if (imgEl && image) imgEl.src = image;

        overlay?.classList.add('active');
        modal.classList.add('active');
        document.body.classList.add('scroll-locked');
      });
    });

    const closeModal = () => {
      overlay?.classList.remove('active');
      modal.classList.remove('active');
      document.body.classList.remove('scroll-locked');
    };

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    overlay?.addEventListener('click', closeModal);
  },

  // LocalStorage Wishlist
  initWishlist() {
    const getWishlist = () => JSON.parse(localStorage.getItem('kmh_wishlist') || '[]');
    const setWishlist = (list) => {
      localStorage.setItem('kmh_wishlist', JSON.stringify(list));
      this.updateWishlistCount();
    };

    this.updateWishlistCount = () => {
      const list = getWishlist();
      document.querySelectorAll('[data-wishlist-count]').forEach(el => {
        el.textContent = list.length;
      });
    };

    document.querySelectorAll('[data-wishlist-toggle]').forEach(btn => {
      const id = btn.getAttribute('data-product-id');
      const list = getWishlist();
      if (list.includes(id)) btn.classList.add('active');

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let current = getWishlist();
        if (current.includes(id)) {
          current = current.filter(item => item !== id);
          btn.classList.remove('active');
        } else {
          current.push(id);
          btn.classList.add('active');
        }
        setWishlist(current);
      });
    });

    this.updateWishlistCount();
  },

  // Product Comparison (localStorage)
  initCompare() {
    const getCompare = () => JSON.parse(localStorage.getItem('kmh_compare') || '[]');
    const setCompare = (list) => localStorage.setItem('kmh_compare', JSON.stringify(list));

    document.querySelectorAll('[data-compare-toggle]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-product-id');
        let current = getCompare();
        if (!current.includes(id)) {
          if (current.length >= 3) current.shift();
          current.push(id);
          setCompare(current);
          alert('Added to comparison matrix!');
        } else {
          alert('Item already in comparison!');
        }
      });
    });
  },

  // Accordion Toggles
  initAccordions() {
    document.querySelectorAll('.kmh-accordion__trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const accordion = trigger.closest('.kmh-accordion');
        accordion.classList.toggle('active');
      });
    });
  },

  // Quantity Selectors
  initQuantitySelectors() {
    document.querySelectorAll('.kmh-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        if (!input) return;
        let val = parseInt(input.value) || 1;
        if (btn.classList.contains('kmh-qty-minus')) {
          val = Math.max(1, val - 1);
        } else {
          val = val + 1;
        }
        input.value = val;
      });
    });
  },

  // Countdown Timers
  initTimers() {
    document.querySelectorAll('[data-countdown]').forEach(el => {
      let duration = 86400 * 2 + 3600 * 5 + 60 * 42;
      setInterval(() => {
        if (duration <= 0) return;
        duration--;
        const hours = Math.floor((duration % (3600 * 24)) / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);
        el.textContent = `${hours}h ${minutes}m ${seconds}s`;
      }, 1000);
    });
  },

  // Mobile Navigation Toggle
  initMobileNav() {
    const toggle = document.querySelector('[data-mobile-nav-toggle]');
    const nav = document.querySelector('.kmh-nav');

    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.top = '100%';
        nav.style.left = '0';
        nav.style.width = '100%';
        nav.style.background = '#FFFFFF';
        nav.style.padding = '1.5rem';
        nav.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
      });
    }
  }
};
