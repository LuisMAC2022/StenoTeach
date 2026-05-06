import { randomIndex } from '../services/rng-service.js';

export const lessons = [
  'SAT','TAEP','HEL','KOT','RUP','STAR','PAOL','WEB','SAF','KAD','WAG','PAS','HEZ','TOF','POD','RAOG','WAES','KUZ','STAF','SPAD','KROG','PHAS','TWEZ','SKAFT','STAPS','KWAED','HROG','SPAOZ','TKOFT','WHARPS'
].map((target) => ({ target }));

export function pickRandomLesson(pool = lessons) {
  return pool[randomIndex(pool.length)];
}
