/**
 * Storage solo-locale, mai trasmesso ai nostri server. Usato per armeria,
 * munizioni e documenti (scelta di prodotto: dati sensibili che restano sul
 * dispositivo dell'utente). Wrapper minimale su localStorage con
 * export/import in JSON come rete di sicurezza contro la perdita dei dati
 * dovuta a cancellazione del browser o cambio dispositivo.
 */

const PREFIX = 'poligoni_italia:';

export const LOCAL_COLLECTIONS = ['firearms', 'ammo_movements', 'documents', 'cronografo_history'];

function readCollection(key, fallback = []) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeCollection(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function listLocal(key) {
  return readCollection(key, []);
}

export function insertLocal(key, item) {
  const items = readCollection(key, []);
  const record = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...item };
  items.unshift(record);
  writeCollection(key, items);
  return record;
}

export function deleteLocal(key, id) {
  const items = readCollection(key, []);
  writeCollection(
    key,
    items.filter((i) => i.id !== id)
  );
}

export function exportLocalData() {
  const payload = { version: 1, exported_at: new Date().toISOString() };
  for (const key of LOCAL_COLLECTIONS) payload[key] = readCollection(key, []);
  return payload;
}

export function importLocalData(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('File di backup non valido');
  for (const key of LOCAL_COLLECTIONS) {
    if (Array.isArray(payload[key])) writeCollection(key, payload[key]);
  }
}
