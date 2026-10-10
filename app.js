(() => {
  'use strict';
  const config = window.SITE_CONFIG || {};
  const products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
  const whatsapp = (productName = '') => {
    const number = String(config.whatsappNumber || '27710331241').replace(/\D/g, '');
    const message = productName
      ? `Hello, I am interested in ordering ${productName}. Please provide more information about the price, availability, and delivery.`
      : 'Hello, I would like more information about your products, prices, availability, and delivery.';
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };
  const el = id => document.getElementById(id);
  const grid = el('productGrid');
  const searchInput = el('productSearch');
  const sortSelect = el('sortProducts');
  const categoryBar = el('categoryBar');
  const emptyState = el('emptyState');
  const modal = el('galleryModal');
  let selectedCategory = 'All products';
  let searchTerm = '';
  let sortMode = 'featured';
  let activeProduct = null;
  let activeImageIndex = 0;
  let lastFocused = null;
  let toastTimer;

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const imgPath = imageId => `assets/images/photo-${String(imageId).padStart(3, '0')}.jpg`;
  const categoryNames = ['All products', ...new Set(products.map(p => p.category))];

  function renderCategories() {
    categoryBar.innerHTML = categoryNames.map(category => {
      const count = category === 'All products' ? products.length : products.filter(p => p.category === category).length;
      return `<button type="button" class="category-chip${category === selectedCategory ? ' selected' : ''}" data-category="${esc(category)}" aria-pressed="${category === selectedCategory}">${esc(category)}<span>${count}</span></button>`;
    }).join('');
  }

  function visibleProducts() {
    let list = products.filter(p => {
      const categoryMatch = selectedCategory === 'All products' || p.category === selectedCategory;
      const searchable = `${p.name} ${p.category} ${p.description} ${(p.colours || []).join(' ')}`.toLowerCase();
      return categoryMatch && searchable.includes(searchTerm);
    });
    if (sortMode === 'az') list.sort((a,b) => a.name.localeCompare(b.name));
    else if (sortMode === 'za') list.sort((a,b) => b.name.localeCompare(a.name));
    else list.sort((a,b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
    return list;
  }

  function productCard(p, index) {
    const cover = p.images[0];
    const alt = `${p.name} product photo`;
    const photosLabel = p.images.length > 1 ? `${p.images.length} photos` : 'View photo';
    const colourLine = p.colours && p.colours.length ? `<p class="product-variants"><span class="variant-dot"></span>${esc(p.colours.join(' · '))}</p>` : '';
    return `<article class="product-card${p.featured ? ' product-featured' : ''}" style="--card-index:${Math.min(index,12)}">
      <div class="product-image-wrap">
        <button type="button" class="product-image-button" data-gallery="${esc(p.id)}" aria-label="View photos of ${esc(p.name)}"><img src="${imgPath(cover)}" alt="${esc(alt)}" loading="lazy" decoding="async"><span class="photo-count">▧ ${esc(photosLabel)}</span></button>
        <span class="product-category-tag">${esc(p.category)}</span>
      </div>
      <div class="product-info"><div class="product-title-row"><h3>${esc(p.name)}</h3></div><p class="product-description">${esc(p.description)}</p>${colourLine}
        <div class="product-buy-row"><div class="price-label"><small>PRICE</small><strong>On enquiry</strong></div><a class="order-button" href="${whatsapp(p.name)}" target="_blank" rel="noopener noreferrer" aria-label="Order ${esc(p.name)} on WhatsApp"><span>Order on WhatsApp</span><b aria-hidden="true">↗</b></a></div>
      </div>
    </article>`;
  }

  function renderProducts() {
    const list = visibleProducts();
    grid.innerHTML = list.map(productCard).join('');
    el('productCount').textContent = String(products.length);
    el('resultsText').textContent = list.length === products.length ? `Showing all ${list.length} products` : `Showing ${list.length} of ${products.length} products`;
    emptyState.hidden = list.length > 0;
    grid.hidden = list.length === 0;
    renderCategories();
  }

  function openGallery(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    activeProduct = product;
    activeImageIndex = 0;
    lastFocused = document.activeElement;
    el('galleryTitle').textContent = product.name;
    el('galleryDescription').textContent = product.description;
    refreshGallery();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    el('modalClose').focus();
  }

  function refreshGallery() {
    if (!activeProduct) return;
    const imageId = activeProduct.images[activeImageIndex];
    el('galleryImage').src = imgPath(imageId);
    el('galleryImage').alt = `${activeProduct.name}, photo ${activeImageIndex + 1}`;
    el('galleryPosition').textContent = `${activeImageIndex + 1} / ${activeProduct.images.length}`;
    el('galleryPrev').disabled = activeProduct.images.length < 2;
    el('galleryNext').disabled = activeProduct.images.length < 2;
    el('galleryThumbnails').innerHTML = activeProduct.images.map((id, i) => `<button type="button" class="gallery-thumb${i === activeImageIndex ? ' active' : ''}" data-image-index="${i}" aria-label="Show photo ${i+1}" aria-pressed="${i === activeImageIndex}"><img src="${imgPath(id)}" alt="" loading="lazy"></button>`).join('');
    el('galleryThumbnails').hidden = activeProduct.images.length < 2;
  }

  function closeGallery() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    activeProduct = null;
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function stepGallery(direction) {
    if (!activeProduct || activeProduct.images.length < 2) return;
    activeImageIndex = (activeImageIndex + direction + activeProduct.images.length) % activeProduct.images.length;
    refreshGallery();
  }

  function showToast(message) {
    const toast = el('toast');
    toast.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 2600);
  }

  categoryBar.addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    selectedCategory = button.dataset.category;
    renderProducts();
  });
  searchInput.addEventListener('input', () => { searchTerm = searchInput.value.trim().toLowerCase(); renderProducts(); });
  sortSelect.addEventListener('change', () => { sortMode = sortSelect.value; renderProducts(); });
  el('resetFilters').addEventListener('click', () => { selectedCategory = 'All products'; searchTerm = ''; searchInput.value = ''; sortMode = 'featured'; sortSelect.value = 'featured'; renderProducts(); });
  el('emptyReset').addEventListener('click', () => { selectedCategory = 'All products'; searchTerm = ''; searchInput.value = ''; renderProducts(); });
  grid.addEventListener('click', event => { const button = event.target.closest('[data-gallery]'); if (button) openGallery(button.dataset.gallery); });
  el('modalClose').addEventListener('click', closeGallery);
  el('galleryPrev').addEventListener('click', () => stepGallery(-1));
  el('galleryNext').addEventListener('click', () => stepGallery(1));
  el('galleryThumbnails').addEventListener('click', event => { const button = event.target.closest('[data-image-index]'); if (!button) return; activeImageIndex = Number(button.dataset.imageIndex); refreshGallery(); });
  modal.addEventListener('click', event => { if (event.target.matches('[data-close-modal]')) closeGallery(); });
  document.addEventListener('keydown', event => {
    if (!modal.classList.contains('open')) return;
    if (event.key === 'Escape') closeGallery();
    if (event.key === 'ArrowLeft') stepGallery(-1);
    if (event.key === 'ArrowRight') stepGallery(1);
  });
  const menuToggle = el('menuToggle');
  const siteNav = el('siteNav');
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    siteNav.classList.toggle('nav-open', open);
  });
  siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { menuToggle.setAttribute('aria-expanded','false'); menuToggle.setAttribute('aria-label','Open navigation'); siteNav.classList.remove('nav-open'); }));
  const waUrl = whatsapp();
  ['mainWhatsApp','floatingWhatsApp','phoneLink'].forEach(id => { if (el(id)) el(id).href = waUrl; });
  if (el('phoneLink')) el('phoneLink').textContent = config.displayPhone || '071 033 1241';
  if (el('mapsLink') && config.mapUrl) el('mapsLink').href = config.mapUrl;
  if (el('copyPhone')) el('copyPhone').addEventListener('click', async () => {
    const number = config.displayPhone || '071 033 1241';
    try { await navigator.clipboard.writeText(number); showToast('Phone number copied.'); }
    catch { showToast(`Phone / WhatsApp: ${number}`); }
  });
  el('year').textContent = String(new Date().getFullYear());
  renderProducts();
})();
