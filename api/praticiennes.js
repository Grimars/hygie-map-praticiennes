<!-- HYGIE MAP -->
<link href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" rel="stylesheet"/>
<script src="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"></script>

<style>
  #hygie-map-wrap { font-family: system-ui, sans-serif; max-width: 1100px; margin: 0 auto; }
  #hygie-filters { background: #f5f3ee; border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; }
  .filter-section { margin-bottom: 1rem; }
  .filter-section:last-child { margin-bottom: 0; }
  .filter-label { font-size: 11px; font-weight: 600; letter-spacing: .08em; color: #888; margin-bottom: 8px; text-transform: uppercase; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip { padding: 5px 14px; border-radius: 99px; border: 1px solid #ddd; background: #fff; font-size: 13px; cursor: pointer; color: #555; transition: all .15s; }
  .chip.active { border-color: #2D6A4F; background: #2D6A4F18; color: #2D6A4F; font-weight: 500; }
  .chip .dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; margin-right: 5px; }
  #hygie-region { width: 100%; padding: 7px 12px; border-radius: 8px; border: 1px solid #ddd; background: #fff; font-size: 13px; color: #333; }
  .active-filters { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e5e5; }
  .active-tag { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 99px; border: 1px solid #ddd; background: #fff; font-size: 12px; cursor: pointer; }
  .clear-all { background: none; border: none; font-size: 12px; color: #999; cursor: pointer; text-decoration: underline; }
  #hygie-layout { display: grid; grid-template-columns: 1fr 300px; gap: 1rem; }
  #hygie-map { height: 500px; border-radius: 12px; overflow: hidden; border: 1px solid #e5e5e5; }
  #hygie-list { height: 500px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
  .praticienne-card { background: #fff; border: 1px solid #eee; border-radius: 10px; padding: 12px; cursor: pointer; transition: all .15s; }
  .praticienne-card:hover, .praticienne-card.selected { border-color: #378ADD; background: #E6F1FB; }
  .card-header { display: flex; gap: 10px; align-items: center; margin-bottom: 8px; }
  .avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 500; font-size: 13px; color: #fff; flex-shrink: 0; }
  .card-name { font-weight: 500; font-size: 13px; margin: 0; }
  .card-location { font-size: 11px; color: #888; margin: 0; }
  .mode-tag { display: inline-block; font-size: 11px; padding: 2px 8px; border-radius: 99px; font-weight: 500; margin-bottom: 4px; }
  .mode-enligne { background: #E6F1FB; color: #185FA5; }
  .mode-presentiel { background: #EAF3DE; color: #3B6D11; }
  .mode-lesdeux { background: #FAEEDA; color: #854F0B; }
  .spec-badge { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; padding: 2px 7px; border-radius: 99px; margin: 2px; }
  .btn-profile { width: 100%; margin-top: 8px; padding: 5px; border-radius: 6px; border: none; background: #378ADD; color: #fff; cursor: pointer; font-size: 12px; font-weight: 500; }
  .no-results { font-size: 13px; color: #999; padding: 1rem 0; }
  /* Popup Mapbox */
  .mapboxgl-popup-content { border-radius: 10px !important; padding: 14px !important; max-width: 240px; box-shadow: 0 4px 20px rgba(0,0,0,0.12) !important; }
  .popup-name { font-weight: 600; font-size: 14px; margin: 0 0 2px; }
  .popup-loc { font-size: 12px; color: #888; margin: 0 0 8px; }
  .popup-btn { width: 100%; padding: 5px; border-radius: 6px; border: none; background: #378ADD; color: #fff; cursor: pointer; font-size: 12px; font-weight: 500; }
  /* Modal */
  #hygie-modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 9999; align-items: center; justify-content: center; padding: 16px; }
  #hygie-modal-overlay.open { display: flex; }
  #hygie-modal { background: #fff; border-radius: 16px; max-width: 520px; width: 100%; max-height: 88vh; overflow-y: auto; }
  .modal-header { padding: 1.25rem; border-bottom: 1px solid #eee; display: flex; gap: 14px; align-items: flex-start; }
  .modal-body { padding: 1.25rem; }
  .modal-close { background: none; border: none; font-size: 22px; cursor: pointer; color: #aaa; padding: 0; line-height: 1; margin-left: auto; }
  .field-label { font-size: 11px; font-weight: 600; letter-spacing: .06em; color: #aaa; text-transform: uppercase; margin: 0 0 2px; }
  .field-value { font-size: 13px; color: #333; margin: 0 0 12px; line-height: 1.5; }
  .field-link { color: #378ADD; text-decoration: none; font-size: 13px; }
  @media (max-width: 640px) {
    #hygie-layout { grid-template-columns: 1fr; }
    #hygie-list { height: 300px; }
  }
</style>

<div id="hygie-map-wrap">
  <!-- FILTRES -->
  <div id="hygie-filters">
    <div class="filter-section">
      <div class="filter-label">Spécialité</div>
      <div class="chips" id="spec-chips"></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
      <div class="filter-section">
        <div class="filter-label">Région</div>
        <select id="hygie-region"><option value="">Toutes les régions</option></select>
      </div>
      <div class="filter-section">
        <div class="filter-label">Consultation</div>
        <div class="chips">
          <span class="chip" data-mode="En ligne">En ligne</span>
          <span class="chip" data-mode="En présentiel">En présentiel</span>
          <span class="chip" data-mode="Les deux">Les deux</span>
        </div>
      </div>
    </div>
    <div class="active-filters" id="active-filters" style="display:none"></div>
  </div>

  <!-- CARTE + LISTE -->
  <div id="hygie-layout">
    <div id="hygie-map"></div>
    <div id="hygie-list"></div>
  </div>
</div>

<!-- MODAL -->
<div id="hygie-modal-overlay">
  <div id="hygie-modal">
    <div class="modal-header" id="modal-header"></div>
    <div class="modal-body" id="modal-body"></div>
  </div>
</div>

<script>
// ============================================================
// CONFIG — remplace ces 3 valeurs
// ============================================================
const MAPBOX_TOKEN = "pk.eyJ1IjoiZ3JpbW15MzMiLCJhIjoiY21uaGw0eng4MDN2ejJxczk3ZmdlbW8yYyJ9.574lO6LerusTa9gw--zMqw";
const API_URL      = "https://hygie-map-praticiennes.vercel.app/api/praticiennes";
const GEOCODE_URL  = "https://api.mapbox.com/geocoding/v5/mapbox.places/";

// ============================================================
// COULEURS PAR SPÉCIALITÉ
// ============================================================
const SPEC_COLORS = {
  "Nutrition":           "#1D9E75",
  "Gestion du stress":   "#378ADD",
  "Phytothérapie":       "#639922",
  "Sport & mouvement":   "#BA7517",
  "Ménopause":           "#D4537E",
  "Troubles digestifs":  "#7F77DD",
  "Immunité":            "#D85A30",
  "Sommeil":             "#185FA5",
  "Enfants & familles":  "#3B6D11",
};

const REGIONS = [
  "Île-de-France","Auvergne-Rhône-Alpes","Bretagne","Grand Est",
  "Hauts-de-France","Normandie","Nouvelle-Aquitaine","Occitanie",
  "Pays de la Loire","Provence-Alpes-Côte d'Azur",
  "Bourgogne-Franche-Comté","Centre-Val de Loire","Corse",
  "La Réunion","Belgique","Suisse"
];

// ============================================================
// STATE
// ============================================================
let allPraticiennes = [];
let specFilter = "";
let regionFilter = "";
let modeFilter = "";
let selectedId = null;
let map, markers = [];

// ============================================================
// INIT
// ============================================================
mapboxgl.accessToken = MAPBOX_TOKEN;

map = new mapboxgl.Map({
  container: "hygie-map",
  style: "mapbox://styles/mapbox/light-v11",
  center: [2.5, 46.5],
  zoom: 5.2
});
map.addControl(new mapboxgl.NavigationControl(), "top-right");

// Rempli les régions dans le select
const sel = document.getElementById("hygie-region");
REGIONS.forEach(r => {
  const o = document.createElement("option");
  o.value = r; o.textContent = r;
  sel.appendChild(o);
});
sel.addEventListener("change", e => { regionFilter = e.target.value; applyFilters(); });

// Chips mode
document.querySelectorAll(".chip[data-mode]").forEach(c => {
  c.addEventListener("click", () => {
    modeFilter = modeFilter === c.dataset.mode ? "" : c.dataset.mode;
    document.querySelectorAll(".chip[data-mode]").forEach(x => x.classList.toggle("active", x.dataset.mode === modeFilter));
    applyFilters();
  });
});

// Fermer modal
document.getElementById("hygie-modal-overlay").addEventListener("click", e => {
  if(e.target === e.currentTarget) closeModal();
});

// ============================================================
// FETCH NOTION VIA PROXY
// ============================================================
async function loadPraticiennes() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const pages = data.results || [];

    // Geocode en parallèle (ville + CP → lat/lng)
    allPraticiennes = await Promise.all(pages.map(async p => {
      const props = p.properties;
      const get = (key, type) => {
        const prop = props[key];
        if(!prop) return "";
        if(type === "title") return prop.title?.[0]?.plain_text || "";
        if(type === "rich_text") return prop.rich_text?.[0]?.plain_text || "";
        if(type === "email") return prop.email || "";
        if(type === "phone") return prop.phone_number || "";
        if(type === "url") return prop.url || "";
        if(type === "select") return prop.select?.name || "";
        if(type === "multi_select") return prop.multi_select?.map(x => x.name) || [];
        if(type === "files") return prop.files?.[0]?.file?.url || prop.files?.[0]?.external?.url || "";
        return "";
      };

      // ⚠️ Adapte ces noms aux noms exacts de tes colonnes Notion
      // Colonne "Place" de Notion (type place) → contient lat/lng + nom de ville
      const place = props["Place"];
      const lat = place?.place?.lat ?? null;
      const lng = place?.place?.lon ?? null;
      const ville = place?.place?.name ?? "";

      return {
        id:          p.id,
        nom:         get("Prénom NOM", "title"),
        email:       get("Email", "email"),
        tel:         get("Numéro de téléphone", "phone"),
        ville,
        region:      get("Région", "select"),
        mode:        get("Mode de consultation", "select"),
        specialites: get("Spécialité(s)", "multi_select"),
        description: get("Description", "rich_text"),
        profession:  get("Profession en lien (1)", "rich_text"),
        formation:   get("Formations complémentaires", "rich_text"),
        site:        get("Site web", "url"),
        social:      get("Réseau social (Instagram ou Youtube, LinkedIn, podcast…)", "url"),
        photo:       get("Photo", "files"),
        lat,
        lng,
      };
    }));

    buildSpecChips();
    applyFilters();
  } catch(err) {
    console.error("Erreur chargement praticiennes:", err);
    document.getElementById("hygie-list").innerHTML = '<p class="no-results">Erreur de chargement. Vérifiez la console.</p>';
  }
}

async function geocode(address) {
  try {
    const url = `${GEOCODE_URL}${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&country=fr,be,ch&limit=1`;
    const r = await fetch(url);
    const d = await r.json();
    return d.features?.[0]?.center || [2.5, 46.5];
  } catch { return [2.5, 46.5]; }
}

// ============================================================
// CHIPS SPÉCIALITÉS (dynamiques)
// ============================================================
function buildSpecChips() {
  const all = new Set(allPraticiennes.flatMap(p => p.specialites));
  const wrap = document.getElementById("spec-chips");
  wrap.innerHTML = `<span class="chip active" data-spec="">Toutes</span>`;
  all.forEach(s => {
    const c = SPEC_COLORS[s] || "#888";
    wrap.innerHTML += `<span class="chip" data-spec="${s}" style="--sc:${c}">
      <span class="dot" style="background:${c}"></span>${s}
    </span>`;
  });
  wrap.querySelectorAll(".chip").forEach(c => {
    c.addEventListener("click", () => {
      specFilter = c.dataset.spec;
      wrap.querySelectorAll(".chip").forEach(x => {
        x.classList.toggle("active", x.dataset.spec === specFilter);
        if(x.dataset.spec && x.dataset.spec === specFilter) {
          x.style.borderColor = SPEC_COLORS[specFilter] || "#333";
          x.style.color = SPEC_COLORS[specFilter] || "#333";
          x.style.background = (SPEC_COLORS[specFilter] || "#333") + "18";
        } else if(x.dataset.spec) {
          x.style.borderColor = ""; x.style.color = ""; x.style.background = "";
        }
      });
      applyFilters();
    });
  });
}

// ============================================================
// FILTRES
// ============================================================
function applyFilters() {
  const filtered = allPraticiennes.filter(p => {
    if(specFilter && !p.specialites.includes(specFilter)) return false;
    if(regionFilter && p.region !== regionFilter) return false;
    if(modeFilter) {
      if(modeFilter === "En ligne" && p.mode !== "En ligne" && p.mode !== "Les deux") return false;
      if(modeFilter === "En présentiel" && p.mode !== "En présentiel" && p.mode !== "Les deux") return false;
      if(modeFilter === "Les deux" && p.mode !== "Les deux") return false;
    }
    return true;
  });

  updateActiveFilters();
  renderMarkers(filtered);
  renderList(filtered);
}

function updateActiveFilters() {
  const tags = [];
  if(specFilter) tags.push({label: specFilter, clear: () => { specFilter = ""; document.querySelector(".chip[data-spec='']").click(); }});
  if(regionFilter) tags.push({label: regionFilter, clear: () => { regionFilter = ""; document.getElementById("hygie-region").value = ""; applyFilters(); }});
  if(modeFilter) tags.push({label: modeFilter, clear: () => { modeFilter = ""; document.querySelectorAll(".chip[data-mode]").forEach(x => x.classList.remove("active")); applyFilters(); }});

  const wrap = document.getElementById("active-filters");
  if(tags.length === 0) { wrap.style.display = "none"; return; }
  wrap.style.display = "flex";
  wrap.innerHTML = '<span style="font-size:12px;color:#888">Filtres actifs :</span>';
  tags.forEach(t => {
    const el = document.createElement("span");
    el.className = "active-tag";
    el.innerHTML = `${t.label} <span style="font-size:14px">×</span>`;
    el.addEventListener("click", t.clear);
    wrap.appendChild(el);
  });
  const btn = document.createElement("button");
  btn.className = "clear-all";
  btn.textContent = "Tout effacer";
  btn.addEventListener("click", () => {
    specFilter = ""; regionFilter = ""; modeFilter = "";
    document.querySelector(".chip[data-spec='']")?.click();
    document.getElementById("hygie-region").value = "";
    document.querySelectorAll(".chip[data-mode]").forEach(x => x.classList.remove("active"));
    applyFilters();
  });
  wrap.appendChild(btn);
}

// ============================================================
// MARQUEURS MAPBOX
// ============================================================
function renderMarkers(list) {
  markers.forEach(m => m.remove());
  markers = [];

  list.forEach(p => {
    if(!p.lat || !p.lng) return;

    const el = document.createElement("div");
    const c = p.specialites[0] ? (SPEC_COLORS[p.specialites[0]] || "#378ADD") : "#378ADD";
    el.style.cssText = `width:14px;height:14px;border-radius:50%;background:${c};border:2.5px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.25);cursor:pointer;transition:transform .15s`;
    el.addEventListener("mouseenter", () => el.style.transform = "scale(1.4)");
    el.addEventListener("mouseleave", () => el.style.transform = "scale(1)");

    const popup = new mapboxgl.Popup({ offset: 14, closeButton: false })
      .setHTML(`
        <p class="popup-name">${p.nom}</p>
        <p class="popup-loc">📍 ${p.ville} (${p.cp})</p>
        <p class="popup-loc">${modeTagHTML(p.mode)}</p>
        <button class="popup-btn" onclick="openModal('${p.id}')">Voir le profil</button>
      `);

    const marker = new mapboxgl.Marker(el)
      .setLngLat([p.lng, p.lat])
      .setPopup(popup)
      .addTo(map);

    markers.push(marker);
  });
}

// ============================================================
// LISTE LATÉRALE
// ============================================================
function renderList(list) {
  const wrap = document.getElementById("hygie-list");
  if(list.length === 0) {
    wrap.innerHTML = '<p class="no-results">Aucune praticienne pour ces filtres.</p>';
    return;
  }
  wrap.innerHTML = list.map(p => {
    const initials = p.nom.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
    const avatarColor = ["#378ADD","#1D9E75","#D4537E","#7F77DD","#D85A30"][p.nom.charCodeAt(0) % 5];
    return `
      <div class="praticienne-card${selectedId===p.id?' selected':''}" id="card-${p.id}" onclick="selectCard('${p.id}')">
        <div class="card-header">
          ${p.photo
            ? `<img src="${p.photo}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;flex-shrink:0"/>`
            : `<div class="avatar" style="background:${avatarColor}">${initials}</div>`
          }
          <div>
            <p class="card-name">${p.nom}</p>
            <p class="card-location">${p.ville} · ${p.region}</p>
          </div>
        </div>
        <div>${modeTagHTML(p.mode)}</div>
        <div style="margin-top:4px">${p.specialites.slice(0,2).map(s => badgeHTML(s)).join("")}</div>
        <div id="card-btn-${p.id}" style="display:none">
          <button class="btn-profile" onclick="openModal('${p.id}');event.stopPropagation()">Voir le profil complet</button>
        </div>
      </div>`;
  }).join("");
}

function selectCard(id) {
  if(selectedId) document.getElementById(`card-btn-${selectedId}`)?.style.setProperty("display","none");
  document.querySelectorAll(".praticienne-card").forEach(c => c.classList.remove("selected"));
  selectedId = selectedId === id ? null : id;
  if(selectedId) {
    document.getElementById(`card-${selectedId}`)?.classList.add("selected");
    document.getElementById(`card-btn-${selectedId}`)?.style.setProperty("display","block");
    const p = allPraticiennes.find(x => x.id === selectedId);
    if(p) map.flyTo({ center: [p.lng, p.lat], zoom: 10, duration: 800 });
  }
}

// ============================================================
// MODAL PROFIL
// ============================================================
function openModal(id) {
  const p = allPraticiennes.find(x => x.id === id);
  if(!p) return;
  const initials = p.nom.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
  const avatarColor = ["#378ADD","#1D9E75","#D4537E","#7F77DD","#D85A30"][p.nom.charCodeAt(0) % 5];

  document.getElementById("modal-header").innerHTML = `
    ${p.photo
      ? `<img src="${p.photo}" style="width:56px;height:56px;border-radius:50%;object-fit:cover;flex-shrink:0"/>`
      : `<div class="avatar" style="width:56px;height:56px;font-size:18px;background:${avatarColor}">${initials}</div>`
    }
    <div style="flex:1">
      <h2 style="margin:0 0 2px;font-size:20px;font-weight:600">${p.nom}</h2>
      <p style="margin:0 0 6px;font-size:13px;color:#888">📍 ${p.ville} (${p.cp}) · ${p.region}</p>
      <div>${modeTagHTML(p.mode)}</div>
      <div style="margin-top:5px">${p.specialites.map(s => badgeHTML(s)).join("")}</div>
    </div>
    <button class="modal-close" onclick="closeModal()">×</button>`;

  document.getElementById("modal-body").innerHTML = `
    ${p.description ? `<p class="field-label">Description</p><p class="field-value">${p.description}</p>` : ""}
    ${p.profession ? `<p class="field-label">Profession en lien</p><p class="field-value">${p.profession}</p>` : ""}
    ${p.formation ? `<p class="field-label">Formations complémentaires</p><p class="field-value">${p.formation}</p>` : ""}
    <div style="border-top:1px solid #eee;padding-top:12px;margin-top:4px">
      ${p.email ? `<p class="field-label">Email</p><p class="field-value"><a href="mailto:${p.email}" class="field-link">${p.email}</a></p>` : ""}
      ${p.tel ? `<p class="field-label">Téléphone</p><p class="field-value">${p.tel}</p>` : ""}
      ${p.site ? `<p class="field-label">Site web</p><p class="field-value"><a href="${p.site.startsWith('http')?p.site:'https://'+p.site}" target="_blank" class="field-link">${p.site}</a></p>` : ""}
      ${p.social ? `<p class="field-label">Réseau social</p><p class="field-value"><a href="${p.social.startsWith('http')?p.social:'https://'+p.social}" target="_blank" class="field-link">${p.social}</a></p>` : ""}
    </div>`;

  document.getElementById("hygie-modal-overlay").classList.add("open");
}

function closeModal() {
  document.getElementById("hygie-modal-overlay").classList.remove("open");
}

// ============================================================
// HELPERS
// ============================================================
function modeTagHTML(mode) {
  const cls = mode === "En ligne" ? "mode-enligne" : mode === "En présentiel" ? "mode-presentiel" : "mode-lesdeux";
  return `<span class="mode-tag ${cls}">${mode}</span>`;
}

function badgeHTML(s) {
  const c = SPEC_COLORS[s] || "#888";
  return `<span class="spec-badge" style="background:${c}18;color:${c};border:1px solid ${c}22">
    <span style="width:6px;height:6px;border-radius:50%;background:${c};display:inline-block"></span>${s}
  </span>`;
}

// ============================================================
// LANCEMENT
// ============================================================
loadPraticiennes();
</script>
