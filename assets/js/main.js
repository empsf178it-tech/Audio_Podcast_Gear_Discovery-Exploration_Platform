/**
 * AUDIOVAULT - Master JavaScript Application Logic
 * Clean Vanilla ES6 Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  initProductFilters();
  initProductSearch();
  initComparison();
  initProductGallery();
  init360Viewer();
  initSetupBuilder();
  initWarrantyForm();
  initGuideInteractions();
  initScrollAnimations();
  initToast();
  init3DCardParallax();
  initNumberCounters();
  initBackToTop();
  initMagneticButtons();
});

/* ==========================================================================
   1. NAVIGATION & SCROLL EFFECTS
   ========================================================================== */
function initNavigation() {
  const navbar = document.querySelector('.vault-navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   2. MOBILE OVERLAY MENU (< 992px)
   ========================================================================== */
function initMobileMenu() {
  const openBtn = document.getElementById('mobileMenuOpen');
  const closeBtn = document.getElementById('mobileMenuClose');
  const overlay = document.getElementById('mobileOverlay');

  if (!openBtn || !overlay) return;

  // Auto-highlight active link based on current page URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const mobileNavItems = overlay.querySelectorAll('.mobile-nav-item');
  mobileNavItems.forEach(item => {
    const link = item.querySelector('a');
    if (link) {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || (currentPath === '' && href === 'index.html') || (currentPath.includes('product-detail') && href === 'products.html'))) {
        item.classList.add('active');
        link.classList.add('active');
      }
    }
  });

  function openMenu() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    ariaExpand(openBtn, true);
  }

  function closeMenu() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    ariaExpand(openBtn, false);
  }

  function ariaExpand(el, state) {
    if (el) el.setAttribute('aria-expanded', state);
  }

  openBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeMenu();
    }
  });

  // Close on nav link click
  const navLinks = overlay.querySelectorAll('.mobile-nav-item a, .mobile-nav-item button');
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   3. PRODUCT FILTERS (Vanilla JS - products.html)
   ========================================================================== */
function initProductFilters() {
  const filterBtns = document.querySelectorAll('.category-filter-btn');
  const productCards = document.querySelectorAll('.product-grid-item');
  const emptyState = document.getElementById('productEmptyState');

  if (!filterBtns.length || !productCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active', 'btn-vault-primary'));
      filterBtns.forEach(b => b.classList.add('btn-vault-secondary'));
      
      btn.classList.remove('btn-vault-secondary');
      btn.classList.add('active', 'btn-vault-primary');

      const selectedCategory = btn.dataset.category || 'all';
      let visibleCount = 0;

      productCards.forEach(card => {
        const cardCategory = card.dataset.category || '';
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    });
  });
}

/* ==========================================================================
   4. PRODUCT SEARCH (Instant Filtering)
   ========================================================================== */
function initProductSearch() {
  const searchInput = document.getElementById('productSearchInput');
  const productCards = document.querySelectorAll('.product-grid-item');
  const emptyState = document.getElementById('productEmptyState');

  if (!searchInput || !productCards.length) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    let visibleCount = 0;

    productCards.forEach(card => {
      const title = (card.querySelector('.product-title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.product-desc')?.textContent || '').toLowerCase();
      const spec = (card.querySelector('.product-spec')?.textContent || '').toLowerCase();
      const cat = (card.dataset.category || '').toLowerCase();

      if (title.includes(query) || desc.includes(query) || spec.includes(query) || cat.includes(query)) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  });
}

/* ==========================================================================
   5. 3-PRODUCT COMPARISON SYSTEM (LocalStorage + Bottom Sheet Drawer)
   ========================================================================== */
const COMPARE_KEY = 'audioVaultCompare';

function getCompareList() {
  try {
    return JSON.parse(localStorage.getItem(COMPARE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCompareList(list) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
}

function initComparison() {
  const compareCheckboxes = document.querySelectorAll('.compare-check');
  const drawer = document.getElementById('comparisonDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const clearAllBtn = document.getElementById('clearAllCompareBtn');

  // Initial UI update on page load (do not force-open if user previously minimized)
  updateCompareUI(false);

  if (compareCheckboxes.length) {
    compareCheckboxes.forEach(cb => {
      cb.addEventListener('change', (e) => {
        let list = getCompareList();
        const productData = {
          id: cb.dataset.id,
          name: cb.dataset.name,
          type: cb.dataset.type || 'N/A',
          pattern: cb.dataset.pattern || 'N/A',
          conn: cb.dataset.conn || 'N/A',
          freq: cb.dataset.freq || 'N/A',
          sens: cb.dataset.sens || 'N/A',
          weight: cb.dataset.weight || 'N/A',
          bestFor: cb.dataset.bestfor || 'N/A',
          img: cb.dataset.img || ''
        };

        if (e.target.checked) {
          if (list.length >= 3) {
            e.target.checked = false;
            showToast('You can compare up to 3 products at a time.', 'warning');
            return;
          }
          if (!list.some(item => item.id === productData.id)) {
            list.push(productData);
            showToast(`Added "${productData.name}" to comparison.`, 'info');
          }
        } else {
          list = list.filter(item => item.id !== productData.id);
          showToast(`Removed "${productData.name}" from comparison.`, 'info');
        }

        saveCompareList(list);
        updateCompareUI(true); // Open drawer on user action
      });
    });
  }

  // Navbar and compare buttons toggle drawer
  document.querySelectorAll('a[href*="comparisonDrawer"], [data-trigger="compareDrawer"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const list = getCompareList();
      if (list.length === 0) {
        showToast('No products selected for comparison yet. Check the "Compare" box on products.', 'info');
        return;
      }
      e.preventDefault();
      if (drawer) {
        drawer.classList.add('active');
        sessionStorage.setItem('compareDrawerDismissed', 'false');
        drawer.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', () => {
      if (drawer) {
        drawer.classList.remove('active');
        sessionStorage.setItem('compareDrawerDismissed', 'true');
      }
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      saveCompareList([]);
      sessionStorage.setItem('compareDrawerDismissed', 'true');
      updateCompareUI(false);
      showToast('Cleared all comparison items.', 'info');
    });
  }
}

function updateCompareUI(shouldOpenDrawer = false) {
  const drawer = document.getElementById('comparisonDrawer');
  const drawerCount = document.getElementById('drawerCompareCount');
  const drawerContent = document.getElementById('drawerCompareContent');
  const compareCheckboxes = document.querySelectorAll('.compare-check');
  const navCounts = document.querySelectorAll('#navCompareCount');
  
  const list = getCompareList();

  // Sync navbar counts
  navCounts.forEach(el => {
    el.textContent = list.length;
  });

  // Sync checkboxes across current page
  compareCheckboxes.forEach(cb => {
    cb.checked = list.some(item => item.id === cb.dataset.id);
  });

  if (drawerCount) {
    drawerCount.textContent = list.length;
  }

  if (!drawer) return;

  if (list.length === 0) {
    drawer.classList.remove('active');
    return;
  }

  // Determine whether to show drawer
  const isDismissed = sessionStorage.getItem('compareDrawerDismissed') === 'true';
  if (shouldOpenDrawer) {
    drawer.classList.add('active');
    sessionStorage.setItem('compareDrawerDismissed', 'false');
  } else if (!isDismissed) {
    drawer.classList.add('active');
  } else {
    drawer.classList.remove('active');
  }

  if (drawerContent) {
    const remainingSlots = Math.max(0, 3 - list.length);
    let html = `
      <div class="comparison-table-wrap">
        <table class="comparison-table">
          <thead>
            <tr>
              <th class="align-middle">Specification</th>
              ${list.map(p => `
                <th class="text-center">
                  <div class="d-flex flex-column align-items-center gap-1 py-1">
                    <img src="${p.img}" alt="${p.name}" class="compare-card-thumb">
                    <span class="compare-product-name text-truncate w-100">${p.name}</span>
                    <button class="btn-remove-compare" onclick="removeCompareItem('${p.id}')">✕ Remove</button>
                  </div>
                </th>
              `).join('')}
              ${Array.from({ length: remainingSlots }).map(() => `
                <th class="text-center text-muted-custom opacity-50 fw-normal">
                  <div class="d-flex flex-column align-items-center justify-content-center p-2 rounded border border-dashed border-secondary my-1" style="min-height: 75px;">
                    <span class="small">+ Add Gear Slot</span>
                  </div>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            <tr><td><strong>Hardware Type</strong></td>${list.map(p => `<td>${p.type}</td>`).join('')}${Array.from({ length: remainingSlots }).map(() => `<td class="text-muted small text-center">-</td>`).join('')}</tr>
            <tr><td><strong>Pickup Pattern</strong></td>${list.map(p => `<td>${p.pattern}</td>`).join('')}${Array.from({ length: remainingSlots }).map(() => `<td class="text-muted small text-center">-</td>`).join('')}</tr>
            <tr><td><strong>Connection</strong></td>${list.map(p => `<td>${p.conn}</td>`).join('')}${Array.from({ length: remainingSlots }).map(() => `<td class="text-muted small text-center">-</td>`).join('')}</tr>
            <tr><td><strong>Frequency Range</strong></td>${list.map(p => `<td>${p.freq}</td>`).join('')}${Array.from({ length: remainingSlots }).map(() => `<td class="text-muted small text-center">-</td>`).join('')}</tr>
            <tr><td><strong>Sensitivity</strong></td>${list.map(p => `<td>${p.sens}</td>`).join('')}${Array.from({ length: remainingSlots }).map(() => `<td class="text-muted small text-center">-</td>`).join('')}</tr>
            <tr><td><strong>Weight</strong></td>${list.map(p => `<td>${p.weight}</td>`).join('')}${Array.from({ length: remainingSlots }).map(() => `<td class="text-muted small text-center">-</td>`).join('')}</tr>
            <tr><td><strong>Best Recommended</strong></td>${list.map(p => `<td><span class="vault-badge">${p.bestFor}</span></td>`).join('')}${Array.from({ length: remainingSlots }).map(() => `<td class="text-muted small text-center">-</td>`).join('')}</tr>
          </tbody>
        </table>
      </div>
    `;
    drawerContent.innerHTML = html;
  }
}

window.removeCompareItem = function(id) {
  let list = getCompareList();
  list = list.filter(p => p.id !== id);
  saveCompareList(list);
  updateCompareUI(list.length > 0);
  showToast('Item removed from comparison', 'info');
};

/* ==========================================================================
   6. PRODUCT GALLERY THUMBNAIL SWITCHER (product-detail.html)
   ========================================================================== */
function initProductGallery() {
  const mainImg = document.getElementById('mainProductImage');
  const thumbs = document.querySelectorAll('.gallery-thumb');

  if (!mainImg || !thumbs.length) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active', 'border-cyan'));
      thumb.classList.add('active');

      const newSrc = thumb.dataset.imgSrc || thumb.src;
      mainImg.src = newSrc;
    });
  });
}

/* ==========================================================================
   7. 360° PRODUCT VIEWER (Interactive drag/slide fallback)
   ========================================================================== */
function init360Viewer() {
  const container = document.getElementById('viewer360');
  const imgEl = document.getElementById('viewer360Image');
  const prevBtn = document.getElementById('viewerPrev');
  const nextBtn = document.getElementById('viewerNext');
  const indicator = document.getElementById('viewerAngleDegree');

  if (!container || !imgEl) return;

  // Use provided product images as multi-angle sequence fallback
  const frameImages = [
    'assets/images/1.jpg',
    'assets/images/2.jpg',
    'assets/images/5.jpg',
    'assets/images/6.jpg',
    'assets/images/8.jpg',
    'assets/images/9.jpg'
  ];

  let currentFrame = 0;
  let isDragging = false;
  let startX = 0;

  function updateFrame(index) {
    currentFrame = (index + frameImages.length) % frameImages.length;
    imgEl.src = frameImages[currentFrame];
    if (indicator) {
      const degrees = Math.round((currentFrame / frameImages.length) * 360);
      indicator.textContent = `${degrees}°`;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => updateFrame(currentFrame - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => updateFrame(currentFrame + 1));
  }

  // Mouse / Touch Drag Rotation
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 25) {
      if (diff > 0) {
        updateFrame(currentFrame - 1);
      } else {
        updateFrame(currentFrame + 1);
      }
      startX = e.clientX;
    }
  });

  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
  });

  container.addEventListener('touchend', () => {
    isDragging = false;
  });

  container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    if (Math.abs(diff) > 25) {
      if (diff > 0) {
        updateFrame(currentFrame - 1);
      } else {
        updateFrame(currentFrame + 1);
      }
      startX = e.touches[0].clientX;
    }
  });
}

/* ==========================================================================
   8. INTERACTIVE SETUP BUILDER (Homepage Section 04)
   ========================================================================== */
function initSetupBuilder() {
  const stepBtns = document.querySelectorAll('.setup-step-btn');
  const displayTitle = document.getElementById('setupDisplayTitle');
  const displayDesc = document.getElementById('setupDisplayDesc');
  const displayImg = document.getElementById('setupDisplayImg');
  const displaySpec = document.getElementById('setupDisplaySpec');
  const displayLink = document.getElementById('setupDisplayLink');

  if (!stepBtns.length) return;

  const setupData = {
    mic: {
      title: "StudioCast M7 - Dynamic Microphone",
      desc: "Designed for spoken word clarity. High off-axis rejection prevents room reverberation from bleeding into your podcast.",
      img: "assets/images/7.jpg",
      spec: "XLR | Cardioid | Dynamic | 50Hz-18kHz",
      link: "product-detail.html"
    },
    interface: {
      title: "TrackHub 4 - Dual Channel Audio Interface",
      desc: "Ultra-low-noise preamps providing +68dB of gain to power dynamic broadcast microphones without inline boosters.",
      img: "assets/images/21.jpg",
      spec: "24-bit / 192kHz | USB-C | Direct Monitoring",
      link: "products.html"
    },
    headphones: {
      title: "Monitor H7 - Closed-Back Studio Headphones",
      desc: "Neutral frequency response ensures exact vocal representation with zero sound leakage back into the mic capsule.",
      img: "assets/images/11.jpg",
      spec: "45mm Neodymium | 15Hz-28kHz | 38 Ohms",
      link: "products.html"
    },
    accessories: {
      title: "FlexArm Pro + Studio Pop Shield",
      desc: "Heavy-duty internal spring boom arm paired with dual-layer mesh shield for clean pop-free vocal capture.",
      img: "assets/images/54.jpg",
      spec: "360° Rotation | Silent Movement | Desk Clamp",
      link: "products.html"
    }
  };

  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stepBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.setupStep;
      const data = setupData[category];

      if (data) {
        if (displayTitle) displayTitle.textContent = data.title;
        if (displayDesc) displayDesc.textContent = data.desc;
        if (displayImg) displayImg.src = data.img;
        if (displaySpec) displaySpec.textContent = data.spec;
        if (displayLink) displayLink.href = data.link;
      }
    });
  });
}

/* ==========================================================================
   9. WARRANTY FORM REGISTRATION (warranty.html)
   ========================================================================== */
function initWarrantyForm() {
  const form = document.getElementById('warrantyForm');
  const resultCard = document.getElementById('warrantyResultCard');
  const regIdSpan = document.getElementById('regIdSpan');
  const regNameSpan = document.getElementById('regNameSpan');
  const regProductSpan = document.getElementById('regProductSpan');
  const regDateSpan = document.getElementById('regDateSpan');

  if (!form) return;

  // Check if existing registration in localStorage
  const existingReg = localStorage.getItem('audioVaultWarrantyDemo');
  if (existingReg) {
    try {
      const data = JSON.parse(existingReg);
      displayWarrantyStatus(data);
    } catch (e) {}
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('wFullName')?.value.trim();
    const email = document.getElementById('wEmail')?.value.trim();
    const product = document.getElementById('wProduct')?.value;
    const serial = document.getElementById('wSerial')?.value.trim();
    const purchaseDate = document.getElementById('wDate')?.value;

    if (!fullName || !email || !product || !serial || !purchaseDate) {
      showToast('Please complete all required fields.', 'warning');
      return;
    }

    const regId = `AV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const regData = {
      regId,
      fullName,
      email,
      product,
      serial,
      purchaseDate,
      registeredAt: new Date().toLocaleDateString()
    };

    localStorage.setItem('audioVaultWarrantyDemo', JSON.stringify(regData));
    displayWarrantyStatus(regData);
    showToast('Warranty registration completed in this demo experience!', 'success');
  });

  function displayWarrantyStatus(data) {
    if (resultCard) {
      resultCard.style.display = 'block';
    }
    if (regIdSpan) regIdSpan.textContent = data.regId;
    if (regNameSpan) regNameSpan.textContent = data.fullName;
    if (regProductSpan) regProductSpan.textContent = data.product;
    if (regDateSpan) regDateSpan.textContent = data.registeredAt || data.purchaseDate;
  }
}

/* ==========================================================================
   10. INTERACTIVE GUIDE NOISE SIMULATOR (guides.html)
   ========================================================================== */
function initGuideInteractions() {
  const rangeInput = document.getElementById('noiseRangeInput');
  const bars = document.querySelectorAll('.sound-wave-bar');
  const noiseStatusText = document.getElementById('noiseStatusText');

  if (!rangeInput || !bars.length) return;

  rangeInput.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10); // 0 to 100

    bars.forEach((bar, idx) => {
      // Create wave height multiplier
      const baseHeight = Math.sin(idx + val * 0.1) * 20 + (val * 0.4) + 10;
      bar.style.height = `${Math.min(Math.max(baseHeight, 10), 65)}px`;

      if (val < 30) {
        bar.style.backgroundColor = '#22C55E'; // Low Noise / Clean
      } else if (val < 70) {
        bar.style.backgroundColor = '#22D3EE'; // Moderate Noise
      } else {
        bar.style.backgroundColor = '#EF4444'; // High Noise / Untreated
      }
    });

    if (noiseStatusText) {
      if (val < 30) {
        noiseStatusText.textContent = "Clean Studio Recording Level (Low Noise)";
        noiseStatusText.style.color = "#22C55E";
      } else if (val < 70) {
        noiseStatusText.textContent = "Moderate Room Ambience & Fan Hiss";
        noiseStatusText.style.color = "#22D3EE";
      } else {
        noiseStatusText.textContent = "High Background Echo & HVAC Noise!";
        noiseStatusText.style.color = "#EF4444";
      }
    }
  });
}

/* ==========================================================================
   11. SCROLL REVEAL ANIMATIONS & RIPPLE EFFECTS
   ========================================================================== */
function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Automatically tag cards & sections for scroll reveal entrance if not already tagged
  const cards = document.querySelectorAll('.vault-card, .category-card, .guide-card, .feature-card, section .h2, section .display-5');
  cards.forEach((card, index) => {
    if (!card.classList.contains('scroll-reveal')) {
      card.classList.add('scroll-reveal');
      const delayMod = (index % 4) + 1;
      card.classList.add(`delay-${delayMod}00`);
    }
  });

  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
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

  revealElements.forEach(el => observer.observe(el));

  // Interactive Button Click Ripple Wave Effect
  document.querySelectorAll('.btn-vault-primary, .btn-vault-secondary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple-wave');

      const ripple = this.querySelector('.ripple-wave');
      if (ripple) ripple.remove();

      this.appendChild(circle);
    });
  });
}

/* ==========================================================================
   12. TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function initToast() {
  let container = document.querySelector('.vault-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'vault-toast-container';
    document.body.appendChild(container);
  }
}

function showToast(message, type = 'info') {
  const container = document.querySelector('.vault-toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `vault-toast vault-toast-${type}`;

  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'warning') icon = '⚠️';
  if (type === 'danger') icon = '🚨';

  toast.innerHTML = `
    <span>${icon}</span>
    <span style="font-size: 0.9rem; font-weight: 500;">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove after 3.5s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   13. ADVANCED INTERACTIVE JS ANIMATIONS & ENHANCEMENTS
   ========================================================================== */

// A. 3D Card Parallax Tilt & Cursor Spotlight Tracking
function init3DCardParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cards = document.querySelectorAll('.vault-card, .category-card, .guide-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.012)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
    });
  });
}

// B. Scroll-Triggered Animated Number Counters
function initNumberCounters() {
  const statElements = document.querySelectorAll('.animate-num');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetNum = parseFloat(el.dataset.target || el.textContent);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const decimals = parseInt(el.dataset.decimals || 0);
        const duration = 1500;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = (targetNum * easeOut).toFixed(decimals);

          el.textContent = `${prefix}${currentVal}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        };

        requestAnimationFrame(updateCounter);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  statElements.forEach(el => observer.observe(el));
}

// C. Back-to-Top Floating Button with Single Sleek Progress Ring & Studio Mic Icon
function initBackToTop() {
  let btn = document.getElementById('backToTopBtn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'backToTopBtn';
    btn.className = 'back-to-top-btn';
    btn.setAttribute('aria-label', 'Back to top');
    btn.title = 'Back to Top';
    btn.innerHTML = `
      <svg class="progress-ring" width="52" height="52" viewBox="0 0 52 52">
        <circle class="progress-ring-bg" cx="26" cy="26" r="23"></circle>
        <circle class="progress-ring-fill" cx="26" cy="26" r="23"></circle>
      </svg>
      <div class="mic-icon-wrap">
        <svg class="mic-icon" width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" stroke-width="2"/>
          <line x1="9" y1="8" x2="15" y2="8" stroke="currentColor" stroke-width="1.5"/>
          <path d="M5 10c0 4.418 3.582 8 8 8s8-3.582 8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="12" y1="18" x2="12" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    `;
    document.body.appendChild(btn);
  }

  const ringFill = btn.querySelector('.progress-ring-fill');
  const circumference = 2 * Math.PI * 23; // ~144.51

  if (ringFill) {
    ringFill.style.strokeDasharray = `${circumference} ${circumference}`;
    ringFill.style.strokeDashoffset = circumference;
  }

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

    if (scrollTop > 220) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }

    if (ringFill) {
      const offset = circumference - (scrollPercent * circumference);
      ringFill.style.strokeDashoffset = offset;
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// D. Magnetic Hover Effect on Interactive Primary & Secondary Buttons
function initMagneticButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const magBtns = document.querySelectorAll('.btn-vault-primary, .btn-vault-secondary');

  magBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}
