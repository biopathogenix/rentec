/* ═══════════════════════════════════════════════
   ELITE PROPERTIES KY — Rentec Direct Integration
   API Key: eyJzdWIiOjM2MDAz...
   Listings: https://propertymanage.biz/u36003/rentals/listings
═══════════════════════════════════════════════ */

const RENTEC_API_KEY = 'eyJzdWIiOjM2MDAzLCJpYXQiOiIyMDI2LTA3LTAzIDEwOjAyOjIyIiwiaXNzIjoiUmVudGVjIEFQSSBWMyIsInJhbmQiOiI5NjA1ZmQwY2UxZjU5YmY1In0';
const RENTEC_API_URL = 'https://secure.rentecdirect.com/owners/utilities/property_listings_JSON.php';
const RENTEC_LISTINGS = 'https://propertymanage.biz/u36003/rentals/listings';
const MATTERPORT_URL  = 'https://my.matterport.com/show/?m=jr7xb9xrBE8';
const CONTACT_EMAIL   = 'rajeswarigopu.eee@gmail.com';

let ALL_PROPS = [];
let FILTERS   = { search:'', community:'', beds:'', baths:'', price:'', avail:'' };

/* ── HELPERS ── */
const isAvail = p => ['yes','1','true','available'].includes(String(p.available||p.status||'').toLowerCase());
const fmtRent = r => (r && r!=0) ? `$${Number(r).toLocaleString()}<small>/mo</small>` : 'Contact for pricing';
const getPhoto = p => p.photo_url || p.image || (Array.isArray(p.photos) ? p.photos[0] : '') || '';

/* ── BUILD CARD ── */
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
      ? `<img class="prop-img" src="${photo}" alt="${p.name||'Property'}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=prop-img-ph><svg width=44 height=44 fill=none viewBox=\\'0 0 24 24\\' stroke=\\'rgba(255,255,255,0.4)\\' stroke-width=1><path d=\\'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z\\'/><polyline points=\\'9 22 9 12 15 12 15 22\\'/></svg></div>'">`
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
        <a href="${detail}" target="_blank" rel="noopener" class="prop-link">More Details →</a>
        <a href="${apply}"  target="_blank" rel="noopener" class="prop-apply">Apply Now →</a>
        <a href="${MATTERPORT_URL}" target="_blank" rel="noopener" class="prop-tour">🏠 3D Tour →</a>
      </div>
    </div>
  </div>`;
}

/* ── RENDER GRID ── */
function renderGrid(props, gridId, countId) {
  const grid  = document.getElementById(gridId);
  const count = document.getElementById(countId);
  if (!grid) return;

  if (!props.length) {
    grid.innerHTML = `
      <div class="state-center">
        <div style="font-size:2.5rem;margin-bottom:.75rem">🏠</div>
        <h3 style="font-size:1.05rem;color:var(--text);margin-bottom:.5rem">No properties match your filters</h3>
        <p style="margin-bottom:1.25rem">Try adjusting or <button onclick="resetFilters('${gridId}','${countId}')" style="background:none;border:none;color:var(--burgundy);font-weight:600;cursor:pointer;font-family:inherit;font-size:inherit">clearing all filters</button></p>
        <a href="${RENTEC_LISTINGS}" target="_blank" class="btn btn-burgundy" style="display:inline-flex;margin:0 auto">Browse All on Rentec ↗</a>
      </div>`;
    if (count) count.style.display = 'none';
    return;
  }

  grid.innerHTML = props.map(buildCard).join('');
  if (count) {
    count.style.display = 'block';
    count.innerHTML = `Showing <strong>${props.length}</strong> of <strong>${ALL_PROPS.length}</strong> propert${ALL_PROPS.length===1?'y':'ies'}`;
  }
}

/* ── FILTERS ── */
function applyFilters(gridId, countId) {
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
      if (FILTERS.beds==='4') { if (b<4) return false; }
      else if (b !== parseInt(FILTERS.beds)) return false;
    }
    if (FILTERS.baths) {
      const b = parseFloat(p.bathrooms||p.baths||0);
      if (FILTERS.baths==='3') { if (b<3) return false; }
      else if (b !== parseFloat(FILTERS.baths)) return false;
    }
    if (FILTERS.price) {
      if ((parseFloat(p.rent||p.price||0)) > parseFloat(FILTERS.price)) return false;
    }
    if (FILTERS.avail === 'available'   && !isAvail(p)) return false;
    if (FILTERS.avail === 'unavailable' &&  isAvail(p)) return false;
    return true;
  });

  renderGrid(filtered, gridId, countId);
}

function resetFilters(gridId, countId) {
  ['fSearch','fCommunity','fBeds','fBaths','fPrice','fAvail'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  FILTERS = { search:'', community:'', beds:'', baths:'', price:'', avail:'' };
  renderGrid(ALL_PROPS, gridId||'propsGrid', countId||'propsCount');
  const count = document.getElementById(countId||'propsCount');
  if (count) count.style.display = 'none';
}

/* ── DEMO DATA (fallback) ── */
function getDemoData() {
  return [
    { name:'Curdsville Rd', address:'Curdsville Rd', city:'Harrodsburg', state:'KY', bedrooms:3, bathrooms:2, sqft:1400, rent:1500, available:'yes', community:'curdsville', photo_url:'https://static.wixstatic.com/media/23b958_ae3217a0ced340349d65001fec90b6ee~mv2.jpg/v1/fit/w_600,h_400,q_90,enc_avif,quality_auto/23b958_ae3217a0ced340349d65001fec90b6ee~mv2.jpg' },
    { name:'Pinehurst Reserve — Unit A', address:'130 Pinehurst Dr', city:'Harrodsburg', state:'KY', bedrooms:2, bathrooms:2, sqft:1200, rent:1200, available:'yes', community:'pinehurst', photo_url:'https://static.wixstatic.com/media/8e1c5f_88a6acd375b24e2f8220c3abd1e22dcf~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80,enc_avif,quality_auto/pinehurst%20reserve%20front.jpg' },
    { name:'Crozer Townhome', address:'Crozer Lane', city:'Harrodsburg', state:'KY', bedrooms:2, bathrooms:2, sqft:1200, rent:1175, available:'yes', community:'crozer', photo_url:'https://static.wixstatic.com/media/23b958_34b740e070714d919759ac3b581544b1~mv2.jpg/v1/fit/w_600,h_400,q_90,enc_avif,quality_auto/23b958_34b740e070714d919759ac3b581544b1~mv2.jpg' },
    { name:'342 Proctor St', address:'342 Proctor St', city:'Danville', state:'KY', bedrooms:3, bathrooms:2, sqft:1350, rent:1100, available:'no', community:'proctor', photo_url:'https://static.wixstatic.com/media/23b958_57499c3244734cce8464cceef54cd14e~mv2.jpg/v1/fit/w_600,h_400,q_90,enc_avif,quality_auto/23b958_57499c3244734cce8464cceef54cd14e~mv2.jpg' },
  ];
}

/* ── MAIN LOADER ── */
async function loadProperties(opts = {}) {
  const { gridId='propsGrid', countId='propsCount', communityFilter='', limit=0 } = opts;
  const grid = document.getElementById(gridId);
  if (!grid) return;

  grid.innerHTML = `<div class="state-center"><div class="spinner"></div><p>Loading properties from Rentec…</p></div>`;

  try {
    // Direct API call — works on GitHub Pages since Rentec API key is public-safe
    // For production, proxy through a serverless function
    const res = await fetch(RENTEC_API_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `key=${encodeURIComponent(RENTEC_API_KEY)}`
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

    // Populate community dropdown from real data
    if (!communityFilter) {
      const comms = [...new Set((data.properties||[]).map(p=>p.community||p.group).filter(Boolean))];
      populateSelect(comms);
    }

    ALL_PROPS = props;
    renderGrid(ALL_PROPS, gridId, countId);

    // Update listing count in stats
    const lc = document.getElementById('listCount');
    if (lc) lc.textContent = (data.properties||[]).length + '+';

  } catch(err) {
    console.warn('Rentec API error, showing demo + direct link:', err.message);

    let demo = getDemoData();
    if (communityFilter) demo = demo.filter(p=>(p.community||'').includes(communityFilter));
    if (limit > 0) demo = demo.slice(0, limit);
    ALL_PROPS = demo;
    renderGrid(ALL_PROPS, gridId, countId);

    // Show soft notice at bottom of grid
    grid.insertAdjacentHTML('afterend', `
      <p style="text-align:center;margin-top:1.25rem;font-size:0.83rem;color:var(--muted);">
        Showing demo data. 
        <a href="${RENTEC_LISTINGS}" target="_blank" style="color:var(--burgundy);font-weight:600;">
          View live listings on Rentec ↗
        </a>
      </p>`);
  }
}

function populateSelect(communities) {
  const sel = document.getElementById('fCommunity');
  if (!sel || !communities.length) return;
  const cur = sel.value;
  sel.innerHTML = '<option value="">All Communities</option>';
  communities.forEach(c => sel.innerHTML += `<option value="${c.toLowerCase()}">${c}</option>`);
  sel.value = cur;
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

  // Wire filter dropdowns to auto-apply
  ['fCommunity','fBeds','fBaths','fPrice','fAvail'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', () => applyFilters());
  });
  document.getElementById('fSearch')?.addEventListener('keyup', e => {
    if (e.key === 'Enter') applyFilters();
  });
});

/* ── CONTACT FORM ── */
async function handleContact(e) {
  e.preventDefault();
  const form    = e.target;
  const btn     = form.querySelector('button[type=submit]');
  const success = document.getElementById('formSuccess');
  const orig    = btn.textContent;
  btn.disabled  = true; btn.textContent = 'Sending…';

  const data = {
    firstName: form.firstName?.value,
    lastName:  form.lastName?.value,
    email:     form.email?.value,
    phone:     form.phone?.value,
    interest:  form.interest?.value,
    message:   form.message?.value,
  };

  // Try Formspree if configured
  const action = form.action;
  if (action && !action.includes('YOUR_FORMSPREE')) {
    try {
      const res = await fetch(action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ ...data, _replyto: data.email, _subject: `Inquiry — ${data.interest||'Elite Properties KY'}` })
      });
      if (res.ok) {
        form.style.display = 'none';
        if (success) success.style.display = 'block';
        return;
      }
    } catch(err) { /* fall through */ }
  }

  // Fallback: mailto
  const sub  = encodeURIComponent(`Inquiry — ${data.interest||'Elite Properties KY'} — ${data.firstName} ${data.lastName}`);
  const body = encodeURIComponent(`Name: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\nPhone: ${data.phone||'—'}\nInterested in: ${data.interest||'—'}\n\nMessage:\n${data.message}`);
  window.open(`mailto:${CONTACT_EMAIL}?subject=${sub}&body=${body}`);
  form.style.display = 'none';
  if (success) success.style.display = 'block';
}
