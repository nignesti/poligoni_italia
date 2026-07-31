// Identità anonima per dispositivo, in attesa dell'autenticazione Supabase
// reale (Piano_Sviluppo_App.md §7.3 task 13, non ancora integrata).
// Nessuna colonna user_id nello schema (sessions, firearms, ammo_movements,
// bookings) ha un vincolo di foreign key verso una tabella di autenticazione:
// un UUID stabile per dispositivo è sufficiente per scopare i dati oggi e
// non richiede migrazione quando l'auth reale arriverà.
const STORAGE_KEY = 'poligoni_italia_device_id';

export function getDeviceId() {
  if (typeof window === 'undefined') return null;
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
