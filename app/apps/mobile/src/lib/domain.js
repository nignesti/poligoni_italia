// Logica di dominio condivisa — packages/core
// Limiti art. 97 TULPS, statistiche del gruppo, scadenze GPG, avvisi documenti

export const AMMO_DISCLAIMER =
  "Strumento di ausilio al calcolo. Non costituisce certificazione di conformità: la responsabilità della detenzione resta del detentore.";

export const LEGAL_AMMO_LIMITS = [
  {
    category: "arma_corta",
    label: "Arma corta (pistola/rivoltella)",
    max_quantity: 200,
    declaration_from: null,
    legal_reference: "art. 97 TULPS",
    unit: "cartucce",
  },
  {
    category: "arma_lunga_caccia",
    label: "Arma lunga da caccia (a palla)",
    max_quantity: 1500,
    declaration_from: null,
    legal_reference: "art. 97 TULPS",
    unit: "cartucce",
  },
  {
    category: "spezzone",
    label: "Spezzone (a pallini)",
    max_quantity: 1500,
    declaration_from: 1000,
    legal_reference: "art. 97 TULPS",
    unit: "cartucce",
  },
  {
    category: "polvere",
    label: "Polvere da sparo",
    max_quantity: 2000,
    declaration_from: null,
    legal_reference: "art. 97 TULPS",
    unit: "grammi",
  },
];

export const CATEGORY_LABELS = {
  arma_corta: "Arma corta",
  arma_lunga_caccia: "Arma lunga caccia",
  spezzone: "Spezzone",
  polvere: "Polvere",
};

function getLimitForCategory(category) {
  return LEGAL_AMMO_LIMITS.find((l) => l.category === category);
}

function getLevel(percentUsed) {
  if (percentUsed > 100) return "oltre";
  if (percentUsed >= 100) return "limite";
  if (percentUsed >= 80) return "attenzione";
  return "ok";
}

function getMessage(category, quantity, limit, percentUsed, declarationFrom) {
  const label = getLimitForCategory(category)?.label || category;
  if (percentUsed > 100) {
    return `Hai superato il limite di legge di ${limit} per ${label}. Regolarizza la posizione.`;
  }
  if (percentUsed >= 100) {
    return `Sei al limite massimo di ${limit} per ${label}.`;
  }
  if (percentUsed >= 80) {
    return `Stai raggiungendo il limite di ${limit} per ${label} (${percentUsed}%).`;
  }
  if (declarationFrom && quantity >= declarationFrom && declarationFrom < limit) {
    return `Superata la soglia di denuncia (${declarationFrom}). Obbligo di denuncia alle autorità.`;
  }
  return `Quantità entro i limiti di legge (${quantity}/${limit}).`;
}

export function evaluateAmmoLimits(inventoryByCategory) {
  // inventoryByCategory: { arma_corta: number, arma_lunga_caccia: number, spezzone: number, polvere: number }
  return LEGAL_AMMO_LIMITS.map((limit) => {
    const quantity = inventoryByCategory[limit.category] || 0;
    const percentUsed = limit.max_quantity > 0 ? Math.round((quantity / limit.max_quantity) * 100) : 0;
    return {
      category: limit.category,
      label: limit.label,
      quantity,
      limit: limit.max_quantity,
      unit: limit.unit,
      percentUsed,
      level: getLevel(percentUsed),
      declarationRequired: !!(limit.declaration_from && quantity >= limit.declaration_from),
      message: getMessage(limit.category, quantity, limit.max_quantity, percentUsed, limit.declaration_from),
      legalReference: limit.legal_reference,
    };
  });
}

export function computeInventoryByCategory(movements) {
  const inv = {};
  for (const m of movements) {
    if (!inv[m.category]) inv[m.category] = 0;
    inv[m.category] += m.delta;
  }
  return inv;
}

// Statistiche del gruppo — geometria elementare sui fori
export function computeGroupStats(holes, distanceMeters) {
  if (!holes || holes.length === 0) {
    return {
      shots: 0,
      centroid: { x: 0, y: 0 },
      meanRadius: 0,
      extremeSpread: 0,
      windage: 0,
      elevation: 0,
      standardDeviation: 0,
    };
  }

  const n = holes.length;
  const cx = holes.reduce((s, h) => s + h.x, 0) / n;
  const cy = holes.reduce((s, h) => s + h.y, 0) / n;

  const distances = holes.map((h) => Math.sqrt((h.x - cx) ** 2 + (h.y - cy) ** 2));
  const meanRadius = distances.reduce((s, d) => s + d, 0) / n;

  let extremeSpread = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = Math.sqrt((holes[i].x - holes[j].x) ** 2 + (holes[i].y - holes[j].y) ** 2);
      if (d > extremeSpread) extremeSpread = d;
    }
  }

  const variance = distances.reduce((s, d) => s + (d - meanRadius) ** 2, 0) / n;
  const standardDeviation = Math.sqrt(variance);

  const groupSizeMOA =
    distanceMeters && distanceMeters > 0 ? (extremeSpread / (distanceMeters * 10)) * 34.38 : undefined;

  return {
    shots: n,
    centroid: { x: cx, y: cy },
    meanRadius: Math.round(meanRadius * 10) / 10,
    extremeSpread: Math.round(extremeSpread * 10) / 10,
    windage: Math.round(cx * 10) / 10,
    elevation: Math.round(cy * 10) / 10,
    standardDeviation: Math.round(standardDeviation * 10) / 10,
    groupSizeMOA: groupSizeMOA ? Math.round(groupSizeMOA * 10) / 10 : undefined,
  };
}

// Scadenze GPG — tre esercitazioni quadrimestrali
export function computeGpgSchedule(portoArmiExpiresOn, year) {
  const expires = new Date(portoArmiExpiresOn);
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

  // L'anno di riferimento per le esercitazioni è quello di validità del porto d'armi
  if (expires < yearStart || expires > new Date(year + 1, 11, 31)) {
    return [];
  }

  const baseDate = expires.getFullYear() === year ? expires : expires;

  const schedule = [];
  for (let seq = 1; seq <= 3; seq++) {
    const dueBy = new Date(baseDate);
    dueBy.setMonth(dueBy.getMonth() - (3 - seq) * 4);
    // Se la scadenza è in questo anno, calcoliamo le tre date precedenti a cadenza quadrimestrale
    // arretrando dalla data di scadenza
    const d = new Date(expires);
    d.setMonth(d.getMonth() - (3 - seq) * 4);
    if (d >= yearStart && d <= yearEnd) {
      schedule.push({ sequence: seq, dueBy: d });
    }
  }
  return schedule;
}

// Avvisi scadenze documenti a 90/30/7 giorni
export function computeDocumentAlerts(docs, today = new Date()) {
  return docs
    .map((doc) => {
      const expires = new Date(doc.expires_on);
      const daysLeft = Math.ceil((expires - today) / (1000 * 60 * 60 * 24));
      let alertLevel = "ok";
      if (daysLeft < 0) alertLevel = "scaduto";
      else if (daysLeft <= 7) alertLevel = "urgente";
      else if (daysLeft <= 30) alertLevel = "prossimo";
      else if (daysLeft <= 90) alertLevel = "attenzione";
      return { ...doc, daysLeft, alertLevel };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

export const DOCUMENT_LABELS = {
  porto_armi_tav: "Porto d'armi (Tiro a Volo)",
  porto_armi_caccia: "Porto d'armi (Caccia)",
  porto_armi_difesa: "Porto d'armi (Difesa)",
  porto_gpg: "Porto d'armi (Guardia Giurata)",
  certificato_medico: "Certificato Medico",
  tessera_federale: "Tessera Federale",
  tessera_socio: "Tessera Socio (ASD)",
};

export const RANGE_TYPE_LABELS = {
  tsn: "Sezione TSN",
  privato: "Poligono Privato",
  tiro_a_volo: "Tiro a Volo",
  dinamico: "Tiro Dinamico",
  long_range: "Long Range",
};

export const BOOKING_STATUS_LABELS = {
  richiesta: "Richiesta",
  confermata: "Confermata",
  annullata: "Annullata",
  completata: "Completata",
  no_show: "Non presentato",
};

export function formatEuro(cents) {
  if (!cents) return "—";
  return `${(cents / 100).toFixed(2).replace(".", ",")} €`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" });
}