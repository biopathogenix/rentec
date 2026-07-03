/* ═══════════════════════════════════════════════
   ELITE PROPERTIES KY — Rentec Direct Integration
   Uses corsproxy.io to bypass CORS on GitHub Pages
═══════════════════════════════════════════════ */

const RENTEC_API_KEY  = 'eyJzdWIiOjM2MDAzLCJpYXQiOiIyMDI2LTA3LTAzIDEwOjAyOjIyIiwiaXNzIjoiUmVudGVjIEFQSSBWMyIsInJhbmQiOiI5NjA1ZmQwY2UxZjU5YmY1In0';
const RENTEC_API_URL  = 'https://secure.rentecdirect.com/owners/utilities/property_listings_JSON.php';
const RENTEC_LISTINGS = 'https://propertymanage.biz/u36003/rentals/listings';
const MATTERPORT_URL  = 'https://my.matterport.com/show/?m=jr7xb9xrBE8';
const CONTACT_EMAIL   = 'rajeswarigopu.eee@gmail.com';

// corsproxy.io supports github.io — solves CORS for free
const CORS_PROXY = 'https://corsproxy.io/?url=';

let ALL_PROPS = [];
let FILTERS   = { search:'', community:'', beds:'', baths:'', price:'', avail:'' };

/* ── HELPERS ── */
const isAvail = p => ['yes','1','true','available'].includes(String(p.available||p.status||'').toLowerCase());
const fmtRent = r => (r && r!=0) ? `$${Number(r).toLocaleString()}<small>/mo</small>` : 'Contact for pricing';
const getPhoto = p => p.photo_url || p.image || (Array.isArray(p.photos) ? p.photos[0] : '') || '';

/* ── BUILD CARD (homepage style) ── */
function buildCard(p) {
  const photo  = getPhoto(p);
  const beds   = p.bedrooms  || p.beds  || '–';
  const baths  = p.bathrooms || p.baths || '–';
  const addr   = [p.address, p.city, p.state].filter(Boolean).join(', ') || 'Harrodsburg, KY';
  const avail  = isAvail(p);
  const detail = p.detail_url || p.listing_url || RENTEC_LISTINGS;
  const apply  = p.apply_url  || RENTEC_LISTINGS;

  return `
  <div class="prop-card">
    ${photo
      ? `<img class="prop-img" src="${photo}" alt="${p.name||'Property'}" loading="lazy">`
      : `<div class="prop-img-ph"><svg width="44" height="44" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.4)" stroke-width="1"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`}
    <div class="prop-body">
      <span class="prop-badge ${avail?'avail':'soon'}">${avail?'Available':'Coming Soon'}</span>
      <p class="prop-name">${p.name||p.property_name||'Available Unit'}</p>
      <p class="prop-addr">📍 ${addr}</p>
      <div class="prop-stats">
        <span>🛏 ${beds} Bed${beds!=1?'s':''}</span>
        <span>🚿 ${baths} Bath${baths!=1?'s':''}</span>
        ${p.sqft?`<span>📐 ${Number(p.sqft).toLocaleString()} sqft</span>`:''}
      </div>
      <p class="prop-price">${fmtRent(p.rent||p.price)}</p>
      <div class="prop-actions">
        <a href="${apply}"  target="_blank" rel="noopener" class="prop-apply">Apply Now →</a>
        <a href="${detail}" target="_blank" rel="noopener" class="prop-link">More Details →</a>
        <a href="${MATTERPORT_URL}" target="_blank" rel="noopener" class="prop-tour">🏠 3D Tour →</a>
      </div>
    </div>
  </div>`;
}

/* ── BUILD LARGE CARD (rentals page) ── */
function buildLargeCard(p) {
  const photo  = getPhoto(p);
  const beds   = p.bedrooms  || p.beds  || '–';
  const baths  = p.bathrooms || p.baths || '–';
  const addr   = [p.address, p.city, p.state].filter(Boolean).join(', ') || 'Harrodsburg, KY';
  const avail  = isAvail(p);
  const detail = p.detail_url || p.listing_url || RENTEC_LISTINGS;
  const apply  = p.apply_url  || RENTEC_LISTINGS;
  const desc   = p.description || p.desc || '';

  return `
  <div class="prop-card-lg">
    ${photo
      ? `<img class="prop-card-lg-img" src="${photo}" alt="${p.name||'Property'}" loading="lazy">`
      : `<div class="prop-card-lg-img-ph"><svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.4)" stroke-width="1"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`}
    <div class="prop-card-lg-body">
      <span class="prop-badge ${avail?'avail':'soon'}">${avail?'✅ Available Now':'⏳ Coming Soon'}</span>
      <p class="prop-name-lg">${p.name||p.property_name||'Available Unit'}</p>
      <p class="prop-addr">📍 ${addr}</p>
      <div class="prop-stats-lg">
        <span>🛏 ${beds} Bed${beds!=1?'s':''}</span>
        <span>🚿 ${baths} Bath${baths!=1?'s':''}</span>
        ${p.sqft?`<span>📐 ${Number(p.sqft).toLocaleString()} sqft</span>`:''}
      </div>
      ${desc?`<p class="prop-desc">${desc.substring(0,180)}${desc.length>180?'…':''}</p>`:''}
      <p class="prop-price-lg">${fmtRent(p.rent||p.price)}</p>
      <div class="prop-btn-row">
        <a href="${apply}"  target="_blank" rel="noopener" class="btn-apply">Apply Now ↗</a>
        <a href="${detail}" target="_blank" rel="noopener" class="btn-details">More Details →</a>
        <a href="${MATTERPORT_URL}" target="_blank" rel="noopener" class="btn-tour">🏠 3D Tour</a>
      </div>
      <div style="margin-top:.85rem;padding-top:.85rem;border-top:1px solid var(--cream-dark);">
        <a href="contact.html?p=${encodeURIComponent(p.name||addr)}"
           style="font-size:.82rem;color:var(--muted);font-weight:500;text-decoration:none;">
          📧 Inquire about this property →
        </a>
      </div>
    </div>
  </div>`;
}

/* ── RENDER GRID ── */
function renderGrid(props, gridId, countId, large=false) {
  const grid  = document.getElementById(gridId);
  const count = document.getElementById(countId);
  if (!grid) return;

  if (!props.length) {
    grid.innerHTML = `
      <div class="state-center" style="grid-column:1/-1">
        <div style="font-size:2.5rem;margin-bottom:.75rem">🏠</div>
        <h3 style="font-size:1.05rem;color:var(--text);margin-bottom:.5rem">No properties match your filters</h3>
        <p style="margin-bottom:1.25rem">Try adjusting or clearing your filters.</p>
        <a href="${RENTEC_LISTINGS}" target="_blank" class="btn btn-burgundy" style="display:inline-flex">Browse All on Rentec ↗</a>
      </div>`;
    if (count) count.style.display = 'none';
    return;
  }

  grid.innerHTML = props.map(p => large ? buildLargeCard(p) : buildCard(p)).join('');
  if (count) {
    count.style.display = 'block';
    count.innerHTML = `Showing <strong style="color:var(--forest)">${props.length}</strong> of <strong style="color:var(--forest)">${ALL_PROPS.length}</strong> propert${ALL_PROPS.length===1?'y':'ies'}`;
  }

  // Update stats count
  const lc = document.getElementById('listCount');
  if (lc) lc.textContent = ALL_PROPS.length || props.length;
}

/* ── FILTERS ── */
function applyFilters(gridId, countId, large) {
  gridId  = gridId  || 'propsGrid';
  countId = countId || 'propsCount';

  FILTERS.search    = (document.getElementById('fSearch')?.value    || '').trim().toLowerCase();
  FILTERS.community = document.getElementById('fCommunity')?.value  || '';
  FILTERS.beds      = document.getElementById('fBeds')?.value       || '';
  FILTERS.baths     = document.getElementById('fBaths')?.value      || '';
  FILTERS.price     = document.getElementById('fPrice')?.value      || '';
  FILTERS.avail     = document.getElementById('fAvail')?.value      || '';

  const filtered = ALL_PROPS.filter(p => {
    if (FILTERS.search) {
      const h = `${p.name||''} ${p.address||''} ${p.city||''} ${p.community||p.group||''}`.toLowerCase();
      if (!h.includes(FILTERS.search)) return false;
    }
    if (FILTERS.community) {
      const c = `${p.community||p.group||p.name||p.address||''}`.toLowerCase();
      if (!c.includes(FILTERS.community)) return false;
    }
    if (FILTERS.beds) {
      const b = parseInt(p.bedrooms||p.beds||0);
      if (FILTERS.beds==='4') { if(b<4) return false; }
      else if (b !== parseInt(FILTERS.beds)) return false;
    }
    if (FILTERS.baths) {
      const b = parseFloat(p.bathrooms||p.baths||0);
      if (FILTERS.baths==='3') { if(b<3) return false; }
      else if (b !== parseFloat(FILTERS.baths)) return false;
    }
    if (FILTERS.price && parseFloat(p.rent||p.price||0) > parseFloat(FILTERS.price)) return false;
    if (FILTERS.avail==='available'   && !isAvail(p)) return false;
    if (FILTERS.avail==='unavailable' &&  isAvail(p)) return false;
    return true;
  });

  renderGrid(filtered, gridId, countId, large);
}

function applyRentalsFilter() { applyFilters('rentalsGrid','propsCount',true); }
function resetRentalsFilter()  {
  ['fSearch','fCommunity','fBeds','fBaths','fPrice','fAvail'].forEach(id => {
    const el = document.getElementById(id); if(el) el.value='';
  });
  FILTERS = { search:'', community:'', beds:'', baths:'', price:'', avail:'' };
  renderGrid(ALL_PROPS,'rentalsGrid','propsCount',true);
}

function resetFilters(gridId, countId) {
  ['fSearch','fCommunity','fBeds','fBaths','fPrice','fAvail'].forEach(id => {
    const el = document.getElementById(id); if(el) el.value='';
  });
  FILTERS = { search:'', community:'', beds:'', baths:'', price:'', avail:'' };
  renderGrid(ALL_PROPS, gridId||'propsGrid', countId||'propsCount', false);
  const c = document.getElementById(countId||'propsCount'); if(c) c.style.display='none';
}

/* ── DEMO DATA ── */
function getDemoData() {
  return [
    { name:'Curdsville Rd', address:'Curdsville Rd', city:'Harrodsburg', state:'KY',
      bedrooms:3, bathrooms:2, sqft:1400, rent:1500, available:'yes',
      description:'Newly constructed 3 bedroom, 2 bathroom duplex. Modern finishes, spacious living areas, scenic views.',
      photo_url:'https://static.wixstatic.com/media/23b958_ae3217a0ced340349d65001fec90b6ee~mv2.jpg/v1/fit/w_600,h_400,q_90,enc_avif,quality_auto/23b958_ae3217a0ced340349d65001fec90b6ee~mv2.jpg',
      detail_url:RENTEC_LISTINGS, apply_url:RENTEC_LISTINGS },
    { name:'Pinehurst Reserve — Unit A', address:'130 Pinehurst Dr', city:'Harrodsburg', state:'KY',
      bedrooms:2, bathrooms:2, sqft:1200, rent:1200, available:'yes',
      description:'Spacious 2 bed 2 bath townhome. Open floor plan, natural light, fully equipped kitchen.',
      photo_url:'https://static.wixstatic.com/media/8e1c5f_88a6acd375b24e2f8220c3abd1e22dcf~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80,enc_avif,quality_auto/pinehurst%20reserve%20front.jpg',
      detail_url:RENTEC_LISTINGS, apply_url:RENTEC_LISTINGS },
    { name:'Crozer Townhome', address:'Crozer Lane', city:'Harrodsburg', state:'KY',
      bedrooms:2, bathrooms:2, sqft:1200, rent:1175, available:'yes',
      description:'Contemporary townhome with modern finishes in convenient Central Kentucky location.',
      photo_url:'https://static.wixstatic.com/media/23b958_34b740e070714d919759ac3b581544b1~mv2.jpg/v1/fit/w_600,h_400,q_90,enc_avif,quality_auto/23b958_34b740e070714d919759ac3b581544b1~mv2.jpg',
      detail_url:RENTEC_LISTINGS, apply_url:RENTEC_LISTINGS },
  ];
}

/* ── MAIN LOADER — uses corsproxy.io to bypass CORS ── */
async function loadProperties(opts = {}) {
  const { gridId='propsGrid', countId='propsCount', communityFilter='', limit=0, large=false } = opts;
  const grid = document.getElementById(gridId);
  if (!grid) return;

  grid.innerHTML = `<div class="state-center"><div class="spinner"></div><p>Loading live listings from Rentec…</p></div>`;

  try {
    // Build the POST request body
    const postBody = `key=${encodeURIComponent(RENTEC_API_KEY)}`;

    // Use corsproxy.io which supports github.io origins for free
    const proxyUrl = CORS_PROXY + encodeURIComponent(RENTEC_API_URL);

    const res = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: postBody
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data.errorstring && data.errorstring !== '') throw new Error(data.errorstring);

    let props = data.properties || [];

    if (communityFilter) {
      props = props.filter(p =>
        `${p.community||p.group||p.name||p.address||''}`.toLowerCase().includes(communityFilter.toLowerCase())
      );
    }
    if (limit > 0) props = props.slice(0, limit);

    // Auto-populate community dropdown from real Rentec data
    if (!communityFilter) {
      const comms = [...new Set((data.properties||[]).map(p=>p.community||p.group).filter(Boolean))];
      if (comms.length) {
        const sel = document.getElementById('fCommunity');
        if (sel) {
          const cur = sel.value;
          sel.innerHTML = '<option value="">All Communities</option>';
          comms.forEach(c => sel.innerHTML += `<option value="${c.toLowerCase()}">${c}</option>`);
          sel.value = cur;
        }
      }
    }

    ALL_PROPS = props;
    renderGrid(ALL_PROPS, gridId, countId, large);
    console.log(`✅ Loaded ${props.length} properties from Rentec`);

  } catch(err) {
    console.warn('Rentec load error:', err.message, '— showing demo data');

    let demo = getDemoData();
    if (communityFilter) demo = demo.filter(p=>(p.community||p.address||'').toLowerCase().includes(communityFilter));
    if (limit > 0) demo = demo.slice(0, limit);
    ALL_PROPS = demo;
    renderGrid(ALL_PROPS, gridId, countId, large);

    // Soft notice
    if (grid.parentElement) {
      const existing = grid.parentElement.querySelector('.rentec-fallback-notice');
      if (!existing) {
        grid.insertAdjacentHTML('afterend', `
          <p class="rentec-fallback-notice" style="text-align:center;margin-top:1.25rem;font-size:.83rem;color:var(--muted);">
            Showing sample listings.
            <a href="${RENTEC_LISTINGS}" target="_blank" style="color:var(--burgundy);font-weight:600;">
              View all live listings on Rentec ↗
            </a>
          </p>`);
      }
    }
  }
}

/* ── NAV MOBILE ── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.nav-toggle')?.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.toggle('open');
  });
  document.querySelectorAll('.nav-dropdown > a').forEach(a => {
    a.addEventListener('click', e => {
      if (window.innerWidth < 960) {
        e.preventDefault();
        a.parentElement.classList.toggle('open');
      }
    });
  });

  ['fCommunity','fBeds','fBaths','fPrice','fAvail'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        const isRentals = !!document.getElementById('rentalsGrid');
        if (isRentals) applyRentalsFilter();
        else applyFilters();
      });
    }
  });
  document.getElementById('fSearch')?.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
      const isRentals = !!document.getElementById('rentalsGrid');
      if (isRentals) applyRentalsFilter();
      else applyFilters();
    }
  });
});

/* ── CONTACT FORM ── */
async function handleSubmit(e) {
  e.preventDefault();
  const form    = e.target;
  const btn     = form.querySelector('button[type=submit]');
  const success = document.getElementById('formSuccess');
  const error   = document.getElementById('formError');

  if (success) success.style.display = 'none';
  if (error)   error.style.display   = 'none';
  btn.disabled    = true;
  btn.textContent = 'Sending…';

  try {
    const formData = new FormData(form);
    const res = await fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Accept': 'application/json' },
      body:    formData
    });
    const data = await res.json();
    if (data.success) {
      form.style.display = 'none';
      if (success) success.style.display = 'block';
    } else {
      throw new Error(data.message || 'Submission failed');
    }
  } catch(err) {
    if (error) error.style.display = 'block';
    btn.disabled    = false;
    btn.textContent = 'Send Message ↘';
  }
}
