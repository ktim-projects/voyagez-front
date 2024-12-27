-- Création de la table 'departures'
CREATE TABLE departures (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY, -- Clé primaire auto-générée
    operator uuid NOT NULL,                       -- Identifiant de la compagnie (UUID fourni manuellement)
    origin text NOT NULL,                         -- Ville de départ
    destination text NOT NULL,                    -- Ville de destination
    departure_time time NOT NULL,                 -- Heure de départ
    arrival_time time NOT NULL,                   -- Heure d'arrivée
    duration text NOT NULL,                       -- Durée du trajet
    price integer NOT NULL,                       -- Prix du billet
    date date NOT NULL,                           -- Date du départ
    created_at timestamp DEFAULT now(),           -- Date de création (par défaut à l'heure actuelle)
    updated_at timestamp DEFAULT now()            -- Date de mise à jour (par défaut à l'heure actuelle)
);



-- Index sur la colonne 'origin' pour améliorer les filtres par ville de départ
CREATE INDEX departures_origin_idx ON departures (origin);

-- Index sur la colonne 'destination' pour améliorer les filtres par destination
CREATE INDEX departures_destination_idx ON departures (destination);

-- Index sur la colonne 'date' pour améliorer les recherches par date
CREATE INDEX departures_date_idx ON departures (date);


-- Autoriser l'accès en lecture pour tout le monde
CREATE POLICY "Allow read access to all"
ON departures
FOR SELECT
USING (true);

-- Créer une fonction pour gérer updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer un trigger pour mettre à jour updated_at
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON departures
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
