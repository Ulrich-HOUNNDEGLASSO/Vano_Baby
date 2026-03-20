/* ============================================================
   VANO BABY — 10 ANS DU GANG
   script.js
   ============================================================ */

/* ===== CURSOR ===== */
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');

document.addEventListener('mousemove', e => {
  cur.style.left  = e.clientX + 'px';
  cur.style.top   = e.clientY + 'px';
  ring.style.left = e.clientX + 'px';
  ring.style.top  = e.clientY + 'px';
});

document.querySelectorAll('a, button, .qty-btn').forEach(el => {
  el.addEventListener('mouseenter', () => ring.style.transform = 'translate(-50%,-50%) scale(1.6)');
  el.addEventListener('mouseleave', () => ring.style.transform = 'translate(-50%,-50%) scale(1)');
});

/* ===== UTILITAIRES ===== */
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ===== LOADER ===== */
async function animEyes() {
  const L = document.getElementById('eL');
  const R = document.getElementById('eR');
  const target = Math.min(58, window.innerWidth * 0.06);
  const steps = 55;
  const dur = 2000;

  for (let i = 0; i <= steps; i++) {
    let p = i / steps;
    let e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    let h = e * target;
    if (p > 0.72) h = target - Math.sin((p - 0.72) / 0.28 * Math.PI) * target * 0.09;
    L.style.height = h + 'px';
    R.style.height = h + 'px';
    await sleep(dur / steps);
  }
  L.style.height = target + 'px';
  R.style.height = target + 'px';
}

async function typeLoaderText() {
  const b = document.getElementById('loader-text');
  b.innerHTML = '';
  const lines = ['10 ANS', 'DU GANG'];

  for (let li = 0; li < lines.length; li++) {
    if (li > 0) {
      const br = document.createElement('span');
      br.className = 'lch br';
      b.appendChild(br);
    }
    for (let ci = 0; ci < lines[li].length; ci++) {
      const c = document.createElement('span');
      c.className = 'lch';
      c.textContent = lines[li][ci] === ' ' ? '\u00a0' : lines[li][ci];
      if (lines[li][ci] === ' ') c.style.width = '0.35em';
      b.appendChild(c);
      await sleep(15);
      requestAnimationFrame(() => c.classList.add('on'));
      await sleep(110);
    }
    if (li < lines.length - 1) await sleep(220);
  }
}

async function explodeOwl() {
  const wrap = document.getElementById('loader-explode');
  const img  = document.getElementById('loader-owl-img');

  /* REMPLACE src par ton image hibou */
  img.src = 'assets/hibou-ia-d.webp';
  wrap.classList.add('on');

  const max = Math.max(window.innerWidth, window.innerHeight) * 1.6;

  for (let i = 0; i <= 45; i++) {
    const p    = i / 45;
    const ease = 1 - Math.pow(1 - p, 3);
    const sz   = ease * max;
    const op   = p < 0.6 ? 1 : 1 - (p - 0.6) / 0.4;
    img.style.width   = sz + 'px';
    img.style.height  = sz + 'px';
    img.style.opacity = op;
    await sleep(22);
  }

  wrap.classList.remove('on');
  wrap.style.opacity = '0';
  img.style.width  = '0';
  img.style.height = '0';
  await sleep(100);
  wrap.style.opacity = '';
}

async function runLoader() {
  if (sessionStorage.getItem('loaderShown')) {
    document.getElementById('loader').style.display = 'none';
    document.body.classList.add('ready');
    initAll();
    return;
  }

  document.getElementById('eL').style.height = '0';
  document.getElementById('eR').style.height = '0';

  await sleep(600);

  await Promise.all([
    animEyes(),
    (async () => { await sleep(1200); await typeLoaderText(); })()
  ]);

  await sleep(600);

  const loader = document.getElementById('loader');
  loader.classList.add('out');
  await sleep(500);
  loader.style.display = 'none';

  await explodeOwl();
  await sleep(150);

  sessionStorage.setItem('loaderShown', '1');
  document.body.classList.add('ready');
  initAll();
}

/* ===== NAVBAR ===== */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
});

function toggleMenu() {
  const m = document.getElementById('mobile-menu');
  m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
}

/* ===== COMPTE À REBOURS ===== */
function updateCountdown() {
  const target = new Date('2026-04-04T15:00:00Z').getTime();
  const diff   = target - Date.now();

  if (diff <= 0) {async
    document.getElementById('countdown').innerHTML =
      '<p style="font-family:var(--font-title);font-size:24px;color:var(--rouge)">C\'EST CE SOIR !</p>';
    return;
  }

  const j   = Math.floor(diff / 86400000);
  const h   = Math.floor((diff % 86400000) / 3600000);
  const m   = Math.floor((diff % 3600000) / 60000);
  const sec = Math.floor((diff % 60000) / 1000);

  document.getElementById('cd-j').textContent = String(j).padStart(2, '0');
  document.getElementById('cd-h').textContent = String(h).padStart(2, '0');
  document.getElementById('cd-m').textContent = String(m).padStart(2, '0');
  document.getElementById('cd-s').textContent = String(sec).padStart(2, '0');
}

/* ===== INTERSECTION OBSERVER — REVEAL ===== */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
}

/* ===== COUNT UP ===== */
function initCountUp() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.target);
      let current  = 0;
      const dur    = 1200;
      const step   = 16;
      const inc    = target / (dur / step);

      const timer = setInterval(() => {
        current = Math.min(current + inc, target);
        el.textContent = Math.round(current);
        if (current >= target) clearInterval(timer);
      }, step);

      obs.unobserve(el);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.count-up').forEach(el => obs.observe(el));
}

/* ===== TIMELINE ===== */
const TL_DATA = [
  { year: '2016', title: "Le premier vrai hit",           text: "Adigoue Gboun Gboun devient un phénomène national. La posture provocatrice et la langue fon prennent le devant. Le public comprend : il n'est pas comme les autres.",                                featured: false },
  { year: '2017', title: "L'installation du personnage",  text: "Figure récurrente du rap béninois. Multiples singles, premiers buzz viraux. Le début du mythe Azéto Gbèdé, le Sorcier Vivant.",                                                                      featured: false },
  { year: '2018', title: "Le passage au mainstream",      text: "Morceaux plus accessibles, plus mélodiques. Il commence à toucher un public plus large, au-delà du rap pur. Les radios le diffusent largement.",                                                      featured: false },
  { year: '2019', title: "Impossible à ignorer",          text: "Présence constante. Chaque single est un événement. Il accumule visibilité, showcases et collaborations. Son personnage s'affine : provocateur mais maîtrisé.",                                        featured: false },
  { year: '2020', title: "La maturité artistique",        text: "Moins de vulgarité, plus de structure. La langue fon devient un atout pleinement assumé. Il se positionne comme ambassadeur culturel malgré lui.",                                                    featured: false },
  { year: '2021', title: "Première consécration",         text: "Meilleur artiste de l'année aux Bénin Top 10 Awards. Il passe de star populaire à star reconnue. Un tournant dans sa carrière.",                                                                      featured: false },
  { year: '2022', title: "Domination & ambassadeur",      text: "Encore Meilleur artiste de l'année. Il devient ambassadeur de la marque Celtiis : son image dépasse désormais la musique.",                                                                           featured: false },
  { year: '2023', title: "La trajectoire internationale", text: "Tournées en Europe : Suisse, Italie. Il teste son potentiel hors du Bénin. Le public expatrié béninois adhère fortement.",                                                                            featured: false },
  { year: '2024', title: "L'installation définitive",     text: "Encore Meilleur artiste de l'année. À ce stade, il n'est plus seulement un artiste : c'est une institution de la musique urbaine béninoise.",                                                         featured: false },
  { year: '2026', title: "10 ANS DU GANG — Le couronnement", text: "04 Avril 2026. Majestic de Wologuèdè. Dix ans de présence, de réinvention et de constance. Un concert-anniversaire historique que Cotonou n'oubliera jamais.",                                    featured: true  },
];



function buildTimeline() {
  const tl = document.getElementById('timeline');

  TL_DATA.forEach((item, i) => {
    const isLeft = i % 2 === 0;
    const div    = document.createElement('div');
    div.className = 'tl-item' + (item.featured ? ' featured' : '');

    const content = `
      <div class="tl-content-title">${item.title}</div>
      <div class="tl-content-text">${item.text}</div>`;

    div.innerHTML = `
      <div class="tl-left ${isLeft ? 'reveal-left' : ''}">${isLeft ? content : ''}</div>
      <div class="tl-center">
        <div class="tl-dot"></div>
        <div class="tl-year">${item.year}</div>
      </div>
      <div class="tl-right ${!isLeft ? 'reveal-right' : ''}">${!isLeft ? content : ''}</div>`;

    tl.appendChild(div);
  });

  /* Timeline mobile serpentin */
  buildTimelineMobile();
  window.addEventListener('resize', buildTimelineMobile);
}

function buildTimelineMobile() {
  const container = document.getElementById('timeline-mobile');
  if (!container) return;

  /* Seulement sur mobile */
  if (window.innerWidth > 900) {
    container.innerHTML = '';
    return;
  }

  const W       = container.offsetWidth || window.innerWidth - 40;
  const dpr     = window.devicePixelRatio || 1;

  /* Layout */
  const ENTRY_H    = 92;
  const MARGIN_TOP = 24;
  const MARGIN_BOT = 24;
  const TOTAL_H    = MARGIN_TOP + TL_DATA.length * ENTRY_H + MARGIN_BOT;

  /* Positions X des sommets : alternance gauche / droite */
  const SIDE_PAD = 8;
  const DOT_R    = 8;
  const GAP      = 8;
  const cx       = W / 2;
  const leftX    = cx - 20;
  const rightX   = cx + 20;
  const TEXT_W   = cx - SIDE_PAD - DOT_R - GAP - 8;

  /* Canvas */
  container.innerHTML = '';
  const canvas    = document.createElement('canvas');
  canvas.width    = W * dpr;
  canvas.height   = TOTAL_H * dpr;
  canvas.style.width  = W + 'px';
  canvas.style.height = TOTAL_H + 'px';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, TOTAL_H);

  /* Points (sommet de chaque courbe) */
  const points = TL_DATA.map((d, i) => ({
    x      : i % 2 === 0 ? leftX : rightX,
    y      : MARGIN_TOP + i * ENTRY_H + ENTRY_H / 2,
    isLeft : i % 2 === 0,
    ...d
  }));

  /* ===== LIGNE SERPENTINE ===== */
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    ctx.bezierCurveTo(
      p1.x, p1.y + ENTRY_H * 0.55,
      p2.x, p2.y - ENTRY_H * 0.55,
      p2.x, p2.y
    );
  }

  ctx.strokeStyle = 'rgba(204, 0, 0, 0.55)';
  ctx.lineWidth   = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  /* ===== POINTS + TEXTES ===== */
  points.forEach(p => {

    /* Halo featured */
    if (p.featured) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, DOT_R + 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(204, 0, 0, 0.18)';
      ctx.fill();
    }

    /* Point rouge */
    ctx.beginPath();
    ctx.arc(p.x, p.y, DOT_R, 0, Math.PI * 2);
    ctx.fillStyle   = '#CC0000';
    ctx.strokeStyle = p.featured ? '#ff4040' : '#CC0000';
    ctx.lineWidth   = p.featured ? 2 : 1.5;
    ctx.fill();
    ctx.stroke();

    /* ===== ANNÉE (côté extérieur) ===== */
    ctx.font         = "bold 12px 'Black Ops One', sans-serif";
    ctx.fillStyle    = '#CC0000';
    ctx.textBaseline = 'middle';

    if (p.isLeft) {
      ctx.textAlign = 'right';
      ctx.fillText(p.year, SIDE_PAD + TEXT_W, p.y);
    } else {
      ctx.textAlign = 'left';
      ctx.fillText(p.year, W - SIDE_PAD - TEXT_W, p.y);
    }

    /* ===== TITRE (côté intérieur — dans le creux) ===== */
    ctx.font      = "12px 'Black Ops One', sans-serif";
    ctx.fillStyle = p.featured ? '#CC0000' : '#ffffff';

    const textX = p.isLeft
      ? p.x + DOT_R + GAP
      : p.x - DOT_R - GAP;
    ctx.textAlign = p.isLeft ? 'left' : 'right';

    ctx.textAlign    = p.isLeft ? 'left' : 'right';
    ctx.textBaseline = 'alphabetic';

    /* Découpe le titre si trop long */
    const maxW = TEXT_W - GAP;
    ctx.fillText(p.title, textX, p.y - 3, maxW);

    /* ===== SOUS-TITRE ===== */
    ctx.font      = "11px 'DM Sans', sans-serif";
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.textBaseline = 'alphabetic';

    /* Wrap manuel sur 2 lignes max */
    const words   = p.text.split(' ');
    let line      = '';
    let lineY     = p.y + 13;
    let lineCount = 0;

    for (let w = 0; w < words.length; w++) {
      const test = line + (line ? ' ' : '') + words[w];
      if (ctx.measureText(test).width > maxW && line !== '') {
        ctx.fillText(line, textX, lineY);
        line   = words[w];
        lineY += 14;
        lineCount++;
        if (lineCount >= 2) { ctx.fillText(line + '…', textX, lineY); break; }
      } else {
        line = test;
      }
    }
    if (lineCount < 2) ctx.fillText(line, textX, lineY);
  });
}

/* ===== VIDÉO FAN (lazy play) ===== */
function initVideo() {
  const video = document.getElementById('fanVideo');
  const btn   = document.getElementById('playBtn');
  if (!video) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) {
        video.pause();
        if (btn) btn.classList.remove('hidden');
      }
    });
  }, { threshold: 0.3 });

  obs.observe(video);
}

function toggleVideo() {
  const video = document.getElementById('fanVideo');
  const btn   = document.getElementById('playBtn');
  if (!video) return;

  if (video.paused) {
    video.play().then(() => {
      if (btn) btn.innerHTML = '❚❚';
      setTimeout(() => {
        if (btn && !video.paused) btn.classList.add('hidden');
      }, 1500);
    }).catch(() => {});
  } else {
    video.pause();
    if (btn) {
      btn.innerHTML = '▶';
      btn.classList.remove('hidden');
    }
  }
}

/* ===== GOOGLE MAPS (lazy load) ===== */
function initMap() {
  const frame = document.getElementById('mapFrame');
  if (!frame) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && frame.dataset.src) {
        frame.src = frame.dataset.src;
        delete frame.dataset.src;
        obs.unobserve(frame);
      }
    });
  }, { threshold: 0.1 });

  obs.observe(frame);
}

/* ===== BILLETTERIE ===== */
const TICKETS = [
  { id: 'std',  name: 'Standard', price: 5000,   total: 30000, sold: 12000, max: 50 },
  { id: 'prem', name: 'Premium',  price: 15000,  total: 12000, sold: 0,  max: 30 },
  { id: 'vip',  name: 'VIP',      price: 50000,  total: 6000,  sold: 3000,  max: 15 },
  { id: 'vvip', name: 'VVIP',     price: 100000, total: 2000,  sold: 300,  max: 10 },
];

function getBadge(t) {
  const left = t.total - t.sold;
  const pct  = (left / t.total) * 100;

  if (left <= 0)   return { cls: 'badge-sold',   label: 'Sold Out' };
  if (pct <= 5)    return { cls: 'badge-last',   label: 'Dernières places' };
  if (pct <= 25)   return { cls: 'badge-limite', label: 'Places limitées' };
  return           { cls: 'badge-dispo',  label: 'Disponible' };
}

const state = { std: 0, prem: 0, vip: 0, vvip: 0 };

function fmt(n) {
  return n.toLocaleString('fr-FR') + ' FCFA';
}

function gaugeColor(pct) {
  if (pct <= 15) return '#CC0000';
  if (pct <= 40) return '#ffa000';
  return '#00c45a';
}

function renderTickets() {
  const grid = document.getElementById('ticketsGrid');
  grid.innerHTML = '';

  TICKETS.forEach(t => {
    const qty   = state[t.id];
    const sub   = qty * t.price;
    const left  = t.total - t.sold;
    const pct   = Math.round((left / t.total) * 100);
    const color = gaugeColor(pct);
    const badge = getBadge(t);

    const card  = document.createElement('div');
    card.className = 'ticket-card' + (qty > 0 ? ' active' : '');

    card.innerHTML = `
      <div class="ticket-band"></div>
      <div class="ticket-main">
        <div class="ticket-info">
          <div class="ticket-name">${t.name}</div>
          <div class="ticket-price">${t.price.toLocaleString('fr-FR')} <span>FCFA / place</span></div>
          <span class="ticket-badge ${badge.cls}">${badge.label}</span>
          <div class="gauge-wrap">
            <div class="gauge-track">
              <div class="gauge-fill" style="width:${pct}%;background:${color};"></div>
            </div>
            <div class="gauge-meta">
              <span class="gauge-lbl">Places restantes</span>
              <span class="gauge-count" style="color:${color}">${left.toLocaleString('fr-FR')} / ${t.total.toLocaleString('fr-FR')}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="ticket-controls">
        <button class="qty-btn plus"  onclick="changeQty('${t.id}',  1)">+</button>
        <div class="qty-val">${qty}</div>
        <button class="qty-btn minus" onclick="changeQty('${t.id}', -1)">−</button>
      </div>
      <div class="ticket-subtotal">${sub > 0 ? fmt(sub) : ''}</div>`;

    grid.appendChild(card);
  });

  updateSummary();
}

function changeQty(id, delta) {
  const t = TICKETS.find(t => t.id === id);
  const left = t.total - t.sold;
  if (left <= 0) return; // bloqué si sold out
  state[id] = Math.max(0, Math.min(Math.min(t.max, left), state[id] + delta));
  renderTickets();
  const btn = document.getElementById('ctaBtn');
  btn.classList.remove('pulse');
  void btn.offsetWidth;
  btn.classList.add('pulse');
}

function updateSummary() {
  const total = TICKETS.reduce((s, t) => s + state[t.id] * t.price, 0);
  const count = TICKETS.reduce((s, t) => s + state[t.id], 0);

  document.getElementById('totalAmount').textContent = total > 0 ? fmt(total) : '0 FCFA';
  document.getElementById('totalCount').textContent  = count === 0
    ? 'Aucune place sélectionnée'
    : count === 1 ? '1 place sélectionnée' : count + ' places sélectionnées';

  const cta = document.getElementById('ctaBtn');
  if (count === 0) {
    cta.textContent = 'Choisir mes places';
  } else {
    const cats = TICKETS.filter(t => state[t.id] > 0);
    if (cats.length === 1) {
      const t = cats[0];
      cta.textContent = `Réserver ${state[t.id]} place${state[t.id] > 1 ? 's' : ''} ${t.name} — ${fmt(total)}`;
    } else {
      cta.textContent = `Réserver ${count} place${count > 1 ? 's' : ''} — ${fmt(total)}`;
    }
  }
}

/* ===== MODAL ===== */
function openModal() {
  const count = TICKETS.reduce((s, t) => s + state[t.id], 0);
  const total = TICKETS.reduce((s, t) => s + state[t.id] * t.price, 0);
  const modal   = document.getElementById('modal');
  const content = document.getElementById('modal-content');

  if (count === 0) {
    content.innerHTML = '<div class="modal-empty">Sélectionnez au moins une place avant de continuer.</div>';
  } else {
    let items = '';
    TICKETS.filter(t => state[t.id] > 0).forEach(t => {
      items += `
        <div class="modal-item">
          <span class="modal-item-label">${t.name} × ${state[t.id]}</span>
          <span class="modal-item-val">${fmt(state[t.id] * t.price)}</span>
        </div>`;
    });

    content.innerHTML = `
      <div class="modal-items">${items}</div>
      <div class="modal-total">
        <span class="modal-total-lbl">TOTAL</span>
        <span class="modal-total-val">${fmt(total)}</span>
      </div>
      <div class="modal-recap-info">
        <p>
          Événement : 10 Ans du Gang — Concert Live<br>
          Date : 04 Avril 2026 · À partir de 16h<br>
          Lieu : Majestic de Wologuèdè, Cotonou
        </p>
      </div>
      <button class="modal-confirm" onclick="confirmOrder()">Confirmer & Payer</button>`;
  }

  modal.classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

function confirmOrder() {
  // Mettre à jour le stock fictif
  TICKETS.forEach(t => {
    if (state[t.id] > 0) {
      t.sold = Math.min(t.sold + state[t.id], t.total);
    }
  });

  // Réinitialiser la sélection
  TICKETS.forEach(t => state[t.id] = 0);

  // Afficher la confirmation
  document.getElementById('modal-content').innerHTML = `
    <div style="text-align:center;padding:32px 16px;">
      <div style="font-size:48px;margin-bottom:16px;">🦉</div>
      <p style="font-family:var(--font-title);font-size:22px;color:var(--blanc);letter-spacing:0.05em;margin-bottom:12px;">BIENVENUE DANS LE GANG</p>
      <p style="font-size:13px;color:var(--blanc-40);line-height:1.8;">
        Ta commande a été enregistrée.<br>
        Tu recevras une confirmation par email.<br><br>
        À bientôt le 04 Avril 2026 !
      </p>
      <button class="modal-confirm" style="margin-top:24px;" onclick="closeModal()">Fermer</button>
    </div>`;

  // Re-render les tickets avec les nouveaux stocks
  renderTickets();
}

/* Fermer le modal en cliquant en dehors */
document.getElementById('modal').addEventListener('click', e => {
  if (e.target === document.getElementById('modal')) closeModal();
});

/* ===== FAQ ===== */
const FAQ_DATA = [
  {
    q: "Les billets sont-ils nominatifs ?",
    a: "Oui, les billets sont nominatifs. Vous devrez présenter une pièce d'identité correspondant au nom sur le billet à l'entrée. Assurez-vous de renseigner votre vrai nom lors de l'achat."
  },
  {
    q: "Peut-on acheter des billets sur place le jour J ?",
    a: "Des billets pourront être disponibles sur place selon les stocks restants. Toutefois, nous recommandons fortement d'acheter en ligne à l'avance pour garantir votre place, les catégories VIP et VVIP étant très limitées."
  },
  {
    q: "Y a-t-il un parking sur place ?",
    a: "Oui, un parking est disponible sur place et aux abords du Majestic de Wologuèdè. Nous conseillons d'arriver tôt pour trouver facilement une place, notamment pour les catégories VIP et VVIP."
  },
  {
    q: "Quelle est la politique de remboursement ?",
    a: "Les billets ne sont pas remboursables sauf en cas d'annulation de l'événement. En cas de report, les billets restent valables pour la nouvelle date. Pour tout problème, contactez l'organisation directement."
  },
  {
    q: "À quelle heure commence vraiment le concert ?",
    a: "Les portes ouvrent à 16h. Le concert de Vano Baby est programmé pour la soirée. Des artistes invités assureront les premières parties dès l'ouverture des portes. Arrivez tôt pour profiter de l'ambiance complète."
  },
  {
    q: "Y a-t-il de la restauration sur place ?",
    a: "Oui, de la restauration et des boissons seront disponibles tout au long de l'événement. Vous trouverez des stands de nourriture et de boissons à différents points du site."
  },
];

function buildFAQ() {
  const list = document.getElementById('faqList');

  FAQ_DATA.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'faq-item reveal';
    div.style.transitionDelay = (i * 0.07) + 's';
    div.innerHTML = `
      <button class="faq-q" onclick="toggleFaq(this)">
        ${item.q}
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-a">${item.a}</div>`;
    list.appendChild(div);
  });
}

function toggleFaq(btn) {
  const ans    = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');

  /* Ferme tous les autres */
  document.querySelectorAll('.faq-q.open').forEach(b => {
    b.classList.remove('open');
    b.nextElementSibling.classList.remove('open');
  });

  if (!isOpen) {
    btn.classList.add('open');
    ans.classList.add('open');
  }
}

/* ===== COPIER L'ADRESSE ===== */
function copyAdresse() {
  const texte = 'Majestic de Wologuèdè (ex Canal Olympia), Cotonou, Bénin';
  navigator.clipboard.writeText(texte).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.textContent = 'Copié !';
    setTimeout(() => btn.textContent = 'Copier', 2000);
  });
}

/* ===== INITIALISATION ===== */
function initAll() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
  buildTimeline();
  buildFAQ();
  renderTickets();
  initReveal();
  initCountUp();
  initVideo();
  initMap();
}

/* ===== DÉMARRAGE ===== */
window.addEventListener('DOMContentLoaded', runLoader);
