
CREATE TABLE IF NOT EXISTS ranges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT,
    comune TEXT,
    provincia TEXT,
    regione TEXT,
    status TEXT DEFAULT 'pending',
    phone TEXT,
    email TEXT,
    website TEXT,
    location GEOMETRY(POINT, 4326),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ranges_location ON ranges USING GIST (location);

INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-agrigento',
    'TSN Agrigento',
    'tsn',
    'Agrigento',
    'AG',
    'Sicilia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(13.57465, 37.3122991), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-altavilla-milicia',
    'TSN Altavilla Milicia',
    'tsn',
    'Altavilla Milicia',
    'PA',
    'Sicilia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(13.5508934, 38.0427339), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-bagheria',
    'TSN Bagheria',
    'tsn',
    'Bagheria',
    'PA',
    'Sicilia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(13.509349, 38.079351), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-barletta',
    'TSN Barletta',
    'tsn',
    'Barletta',
    'BT',
    'Puglia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(16.2868696, 41.3214976), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-breno',
    'TSN Breno',
    'tsn',
    'Breno',
    'BS',
    'Lombardia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(10.4475635, 45.9414695), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-busto-arsizio',
    'TSN Busto Arsizio',
    'tsn',
    'Busto Arsizio',
    'VA',
    'Lombardia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(8.8518269, 45.611932), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-caltagirone',
    'TSN Caltagirone',
    'tsn',
    'Caltagirone',
    'CT',
    'Sicilia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(14.5132023, 37.2372009), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-caltanissetta',
    'TSN Caltanissetta',
    'tsn',
    'Caltanissetta',
    'CL',
    'Sicilia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(14.063284, 37.4902628), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-campobasso',
    'TSN Campobasso',
    'tsn',
    'Campobasso',
    'CB',
    'Molise',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(14.6602725, 41.5597935), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-candela',
    'TSN Candela',
    'tsn',
    'Candela',
    'FG',
    'Puglia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(15.514654, 41.137925), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-carpi',
    'TSN Carpi',
    'tsn',
    'Carpi',
    'MO',
    'Emilia-Romagna',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(10.8854523, 44.7835699), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-castellammare-di-stabia',
    'TSN Castellammare di Stabia',
    'tsn',
    'Castellammare di Stabia',
    'NA',
    'Campania',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(14.4804813, 40.6943046), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-castelfranco-emilia',
    'TSN Castelfranco Emilia',
    'tsn',
    'Castelfranco Emilia',
    'BO',
    'Emilia-Romagna',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(11.0528786, 44.5949142), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-catania',
    'TSN Catania',
    'tsn',
    'Catania',
    'CT',
    'Sicilia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(15.0873718, 37.5023612), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-centuripe',
    'TSN Centuripe',
    'tsn',
    'Centuripe',
    'EN',
    'Sicilia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(14.7418808, 37.6206871), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-cerea',
    'TSN Cerea',
    'tsn',
    'Cerea',
    'VR',
    'Veneto',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(11.247415, 45.1601865), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-chieti',
    'TSN Chieti',
    'tsn',
    'Chieti',
    'CH',
    'Abruzzo',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(14.1659738, 42.3446529), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-cividale',
    'TSN Cividale',
    'tsn',
    'Cividale del Friuli',
    'UD',
    'Friuli-Venezia Giulia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(13.4387878, 46.0731464), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-civitavecchia',
    'TSN Civitavecchia',
    'tsn',
    'Civitavecchia',
    'RM',
    'Lazio',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(11.7922462, 42.0937524), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-como',
    'TSN Como',
    'tsn',
    'Como',
    'CO',
    'Lombardia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(9.0830353, 45.8115623), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-crotone',
    'TSN Crotone',
    'tsn',
    'Crotone',
    'KR',
    'Calabria',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(17.127196, 39.0806223), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-enna',
    'TSN Enna',
    'tsn',
    'Enna',
    'EN',
    'Sicilia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(14.2807473, 37.5667573), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-este',
    'TSN Este',
    'tsn',
    'Este',
    'PD',
    'Veneto',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(11.6589117, 45.2201668), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-firenze',
    'TSN Firenze',
    'tsn',
    'Firenze',
    'FI',
    'Toscana',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(11.2556404, 43.7697955), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-gallarate',
    'TSN Gallarate',
    'tsn',
    'Gallarate',
    'VA',
    'Lombardia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(8.7932013, 45.6598951), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-imola',
    'TSN Imola',
    'tsn',
    'Imola',
    'BO',
    'Emilia-Romagna',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(11.7141233, 44.3535145), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-l-aquila',
    'TSN L''Aquila',
    'tsn',
    'L''Aquila',
    'AQ',
    'Abruzzo',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(13.3979672, 42.3489203), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-lanciano',
    'TSN Lanciano',
    'tsn',
    'Lanciano',
    'CH',
    'Abruzzo',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(14.3907794, 42.2305316), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-livorno',
    'TSN Livorno',
    'tsn',
    'Livorno',
    'LI',
    'Toscana',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(10.3091256, 43.5507317), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-lucca',
    'TSN Lucca',
    'tsn',
    'Lucca',
    'LU',
    'Toscana',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(10.502876, 43.8428381), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-mazara',
    'TSN Mazara',
    'tsn',
    'Mazara del Vallo',
    'TP',
    'Sicilia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(12.5886912, 37.6537292), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-messina',
    'TSN Messina',
    'tsn',
    'Messina',
    'ME',
    'Sicilia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(15.5542082, 38.1937571), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-milazzo',
    'TSN Milazzo',
    'tsn',
    'Milazzo',
    'ME',
    'Sicilia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(15.2415129, 38.2208049), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-milano',
    'TSN Milano',
    'tsn',
    'Milano',
    'MI',
    'Lombardia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(9.1896346, 45.4641943), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-modena',
    'TSN Modena',
    'tsn',
    'Modena',
    'MO',
    'Emilia-Romagna',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(10.9255707, 44.6458885), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-napoli',
    'TSN Napoli',
    'tsn',
    'Napoli',
    'NA',
    'Campania',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(14.2487679, 40.8358846), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-padova',
    'TSN Padova',
    'tsn',
    'Padova',
    'PD',
    'Veneto',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(11.8956829, 45.3984428), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-palermo',
    'TSN Palermo',
    'tsn',
    'Palermo',
    'PA',
    'Sicilia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(13.3524434, 38.1112268), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-pavia',
    'TSN Pavia',
    'tsn',
    'Pavia',
    'PV',
    'Lombardia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(9.1546375, 45.1860043), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-perugia',
    'TSN Perugia',
    'tsn',
    'Perugia',
    'PG',
    'Umbria',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(12.3890104, 43.1119613), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-pescara',
    'TSN Pescara',
    'tsn',
    'Pescara',
    'PE',
    'Abruzzo',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(14.2059269, 42.469613), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-pordenone',
    'TSN Pordenone',
    'tsn',
    'Pordenone',
    'PN',
    'Friuli-Venezia Giulia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(12.6597197, 45.9562503), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-ragusa',
    'TSN Ragusa',
    'tsn',
    'Ragusa',
    'RG',
    'Sicilia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(14.7307524, 36.9257118), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-reggio-calabria',
    'TSN Reggio Calabria',
    'tsn',
    'Reggio Calabria',
    'RC',
    'Calabria',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(15.6397556, 38.1035389), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-reggio-emilia',
    'TSN Reggio Emilia',
    'tsn',
    'Reggio Emilia',
    'RE',
    'Emilia-Romagna',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(10.6304971, 44.6978389), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-rho',
    'TSN Rho',
    'tsn',
    'Rho',
    'MI',
    'Lombardia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(9.0463469, 45.5310355), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-roma',
    'TSN Roma',
    'tsn',
    'Roma',
    'RM',
    'Lazio',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(12.4829321, 41.8933203), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-siracusa',
    'TSN Siracusa',
    'tsn',
    'Siracusa',
    'SR',
    'Sicilia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(15.2124277, 37.0315752), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-spoleto',
    'TSN Spoleto',
    'tsn',
    'Spoleto',
    'PG',
    'Umbria',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(12.7382035, 42.7342971), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-sulmona',
    'TSN Sulmona',
    'tsn',
    'Sulmona',
    'AQ',
    'Abruzzo',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(13.927011, 42.0474231), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-teramo',
    'TSN Teramo',
    'tsn',
    'Teramo',
    'TE',
    'Abruzzo',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(13.6983524, 42.6612893), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-tolmezzo',
    'TSN Tolmezzo',
    'tsn',
    'Tolmezzo',
    'UD',
    'Friuli-Venezia Giulia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(13.0158357, 46.4053676), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-torino',
    'TSN Torino',
    'tsn',
    'Torino',
    'TO',
    'Piemonte',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(7.6824892, 45.0677551), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-trapani',
    'TSN Trapani',
    'tsn',
    'Trapani',
    'TP',
    'Sicilia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(12.7116255, 37.9003731), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-trieste',
    'TSN Trieste',
    'tsn',
    'Trieste',
    'TS',
    'Friuli-Venezia Giulia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(13.7772781, 45.6496485), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-udine',
    'TSN Udine',
    'tsn',
    'Udine',
    'UD',
    'Friuli-Venezia Giulia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(13.2358377, 46.0634632), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-vasto',
    'TSN Vasto',
    'tsn',
    'Vasto',
    'CH',
    'Abruzzo',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(14.705923, 42.12434), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tsn-vercelli',
    'TSN Vercelli',
    'tsn',
    'Vercelli',
    'VC',
    'Piemonte',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(8.4227666, 45.3251557), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'a-b-poligoni-s-r-l',
    'A.B. Poligoni s.r.l.',
    'privato',
    'Firenze',
    'FI',
    'Toscana',
    'verified',
    '055 68.02.096',
    NULL,
    ST_SetSRID(ST_MakePoint(11.2896804, 43.761228), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'a-s-d-xiridia-shooting',
    'A.S.D. Xiridia Shooting',
    'privato',
    'Floridia',
    'SR',
    'Sicilia',
    'verified',
    '331 3728879',
    NULL,
    ST_SetSRID(ST_MakePoint(15.1576578, 37.0779098), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'il-piancardato',
    'Il Piancardato',
    'privato',
    'Collazzone',
    'PG',
    'Umbria',
    'verified',
    '320 2307745',
    NULL,
    ST_SetSRID(ST_MakePoint(12.4650923, 42.92432), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'la-folce-poligoni-di-tiro',
    'La Folce Poligoni di Tiro',
    'privato',
    'Magione',
    'PG',
    'Umbria',
    'verified',
    '347 6951232',
    NULL,
    ST_SetSRID(ST_MakePoint(12.211302, 43.1452852), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'sottotiro-il-poligono',
    'Sottotiro Il Poligono',
    'privato',
    'Perosa Argentina',
    'TO',
    'Piemonte',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(7.9674206, 44.5670736), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'sport-gun-il-poligono',
    'Sport Gun Il Poligono',
    'privato',
    'San Zenone degli Ezzelini',
    'TV',
    'Veneto',
    'verified',
    '0423 567639',
    NULL,
    ST_SetSRID(ST_MakePoint(11.8279873, 45.7710129), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tac-madonna-del-bosco',
    'Tac Madonna del Bosco',
    'privato',
    'Conselice',
    'RA',
    'Emilia-Romagna',
    'verified',
    '333 5963039',
    NULL,
    ST_SetSRID(ST_MakePoint(11.7979139, 44.5044521), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tiro-a-segno-carpi',
    'Tiro a Segno Carpi',
    'privato',
    'Carpi',
    'MO',
    'Emilia-Romagna',
    'verified',
    '059 686848',
    NULL,
    ST_SetSRID(ST_MakePoint(10.8950966, 44.8014942), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'poligono-rocca-massima',
    'Poligono Rocca Massima',
    'privato',
    'Rocca Massima',
    'LT',
    'Lazio',
    'verified',
    NULL,
    'associazionetirostatico.it',
    ST_SetSRID(ST_MakePoint(12.9194152, 41.6794147), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'a-s-d-accadorza-sedilo',
    'A.S.D. Accadorza Sedilo',
    'privato',
    'Sedilo',
    'OR',
    'Sardegna',
    'verified',
    '3939448914',
    NULL,
    ST_SetSRID(ST_MakePoint(8.9191225, 40.1731514), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'poligono-vado-la-mola',
    'Poligono Vado La Mola',
    'privato',
    'Bassiano',
    'LT',
    'Lazio',
    'verified',
    '3341827470',
    'vadolamola.it',
    ST_SetSRID(ST_MakePoint(13.0350954, 41.5506592), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'poligono-orobico-bg-asd',
    'Poligono Orobico BG ASD',
    'privato',
    'Ubiale Clanezzo',
    'BG',
    'Lombardia',
    'verified',
    '3311449657',
    'poligonoorobico.com',
    ST_SetSRID(ST_MakePoint(8.019353, 43.8846217), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'poligono-di-arzene',
    'Poligono di Arzene',
    'privato',
    'Arzene',
    'PN',
    'Friuli-Venezia Giulia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(12.8405918, 46.0045659), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'poligono-di-tiro-asd-freeshots',
    'Poligono di tiro ASD Freeshots',
    'privato',
    'Scoglitti',
    'RG',
    'Sicilia',
    'verified',
    '3332068161',
    NULL,
    ST_SetSRID(ST_MakePoint(14.4401636, 36.8819895), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'lince-poligono-di-tiro-asd',
    'Lince Poligono di Tiro ASD',
    'privato',
    'Guastalla',
    'RE',
    'Emilia-Romagna',
    'verified',
    NULL,
    'asdlince.it',
    ST_SetSRID(ST_MakePoint(10.6550769, 44.9252211), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'tiro-a-segno-vidracco',
    'Tiro a Segno Vidracco',
    'privato',
    'Vidracco',
    'TO',
    'Piemonte',
    'verified',
    '3386271804',
    'tirovidracco.it',
    ST_SetSRID(ST_MakePoint(13.7918873, 45.6252945), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'poligono-torre-baccelli',
    'Poligono Torre Baccelli',
    'privato',
    'Fara in Sabina',
    'RI',
    'Lazio',
    'verified',
    '3348905531',
    NULL,
    ST_SetSRID(ST_MakePoint(12.6092315, 41.6772189), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'poligono-cao-malnisio',
    'Poligono Cao Malnisio',
    'militare',
    'Montereale Valcellina',
    'PN',
    'Friuli-Venezia Giulia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(12.6203791, 46.1236771), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'conrad-shooting-club',
    'Conrad Shooting Club',
    'privato',
    'Casei Gerola',
    'PV',
    'Lombardia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(8.9269892, 45.0061458), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    's-i-d-shooting-combat-school',
    'S.I.D. Shooting Combat School',
    'privato',
    'Milano',
    'MI',
    'Lombardia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(9.1896346, 45.4641943), 4326),
    NOW()
);


INSERT INTO ranges (id, slug, name, type, comune, provincia, regione, status, phone, website, location, created_at)
VALUES (
    gen_random_uuid(),
    'poligono-della-galleria',
    'Poligono della Galleria',
    'privato',
    'Lograto',
    'BS',
    'Lombardia',
    'verified',
    NULL,
    NULL,
    ST_SetSRID(ST_MakePoint(10.0629113, 45.4883061), 4326),
    NOW()
);

