#!/usr/bin/env python3
"""
Arricchisce i dati dei poligoni usando Google Places API
"""

import json
import os
import sys
import time
from typing import Optional, Dict, List
from pathlib import Path
import googlemaps

# Configurazione — la key va passata come variabile d'ambiente, mai nel
# codice sorgente (questo repo è pubblico su GitHub).
API_KEY = os.environ.get("GOOGLE_MAPS_API_KEY")
if not API_KEY:
    sys.exit("GOOGLE_MAPS_API_KEY non impostata nell'ambiente.")
INPUT_JSON = "poligoni_italia.json"
OUTPUT_JSON = "poligoni_italia_arricchito.json"
CACHE_FILE = "google_places_cache.json"

class GooglePlacesEnricher:
    def __init__(self, api_key: str):
        self.gmaps = googlemaps.Client(key=api_key)
        self.cache_file = Path(CACHE_FILE)
        self.cache = self._load_cache()
    
    def _load_cache(self) -> Dict:
        if self.cache_file.exists():
            with open(self.cache_file, 'r') as f:
                return json.load(f)
        return {}
    
    def _save_cache(self):
        with open(self.cache_file, 'w') as f:
            json.dump(self.cache, f, indent=2, ensure_ascii=False)
    
    def search_place(self, name: str, comune: str, provincia: str) -> Optional[Dict]:
        """Cerca un poligono su Google Places"""
        query = f"{name} {comune} {provincia} poligono di tiro"
        
        # Controlla cache
        cache_key = query
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        try:
            # Cerca il luogo
            results = self.gmaps.places(query, language='it')
            
            if not results.get('results'):
                # Prova con query più semplice
                query_simple = f"{name} {comune}"
                results = self.gmaps.places(query_simple, language='it')
            
            if results.get('results'):
                place = results['results'][0]
                place_id = place['place_id']
                
                # Ottieni dettagli completi
                details = self.gmaps.place(place_id, fields=[
                    'name', 'formatted_address', 'formatted_phone_number',
                    'website', 'opening_hours', 'geometry', 'international_phone_number',
                    'url', 'user_ratings_total', 'rating'
                ])
                
                if details.get('result'):
                    result = details['result']
                    self.cache[cache_key] = result
                    self._save_cache()
                    return result
            
            self.cache[cache_key] = None
            self._save_cache()
            return None
            
        except Exception as e:
            print(f"❌ Errore per {query}: {e}")
            return None
    
    def enrich_poligono(self, poligono: Dict) -> Dict:
        """Arricchisce un singolo poligono"""
        name = poligono.get('name', '')
        comune = poligono.get('comune', '')
        provincia = poligono.get('provincia', '')
        
        if not name or not comune:
            return poligono
        
        result = self.search_place(name, comune, provincia)
        
        if result:
            # Estrai dati
            poligono['indirizzo_completo'] = result.get('formatted_address')
            poligono['phone'] = result.get('formatted_phone_number') or poligono.get('phone')
            poligono['website'] = result.get('website') or poligono.get('website')
            poligono['google_rating'] = result.get('rating')
            poligono['google_reviews'] = result.get('user_ratings_total')
            poligono['google_url'] = result.get('url')
            
            # Estrai orari
            opening_hours = result.get('opening_hours')
            if opening_hours and opening_hours.get('weekday_text'):
                poligono['orari'] = opening_hours['weekday_text']
            
            # Coordinate (se mancanti)
            geometry = result.get('geometry', {})
            location = geometry.get('location', {})
            if location and not poligono.get('lat'):
                poligono['lat'] = location.get('lat')
                poligono['lng'] = location.get('lng')
        
        return poligono

def main():
    print("🔍 ARRICCHIMENTO DATI POLIGONI con Google Places API\n")
    
    # Carica i dati esistenti
    with open(INPUT_JSON, 'r') as f:
        poligoni = json.load(f)
    
    print(f"📊 Caricati {len(poligoni)} poligoni")
    
    enricher = GooglePlacesEnricher(API_KEY)
    
    enriched = []
    for i, p in enumerate(poligoni, 1):
        print(f"⏳ [{i}/{len(poligoni)}] {p.get('name', '')} - {p.get('comune', '')}")
        enriched_p = enricher.enrich_poligono(p)
        enriched.append(enriched_p)
        time.sleep(0.5)  # Rate limit
    
    # Salva il risultato
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(enriched, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Arricchiti {len(enriched)} poligoni in {OUTPUT_JSON}")
    
    # Statistiche
    with_site = sum(1 for p in enriched if p.get('website'))
    with_phone = sum(1 for p in enriched if p.get('phone'))
    with_address = sum(1 for p in enriched if p.get('indirizzo_completo'))
    with_hours = sum(1 for p in enriched if p.get('orari'))
    
    print(f"\n📊 STATISTICHE FINALI:")
    print(f"  Con sito web: {with_site}/{len(enriched)} ({with_site/len(enriched)*100:.1f}%)")
    print(f"  Con telefono: {with_phone}/{len(enriched)} ({with_phone/len(enriched)*100:.1f}%)")
    print(f"  Con indirizzo: {with_address}/{len(enriched)} ({with_address/len(enriched)*100:.1f}%)")
    print(f"  Con orari: {with_hours}/{len(enriched)} ({with_hours/len(enriched)*100:.1f}%)")

if __name__ == "__main__":
    main()