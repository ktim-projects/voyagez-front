CREATE TABLE company (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY, -- Identifiant unique de la compagnie
    name text NOT NULL,                           -- Nom de la compagnie
    logo_url text,                                -- URL du logo (stocké dans le storage)
    contact text NOT NULL,                        -- Numéro de téléphone ou contact principal
    email text NOT NULL UNIQUE,                   -- Email de la compagnie
    services jsonb,                               -- Liste des services sous forme de tableau JSON
    created_at timestamp DEFAULT now(),           -- Date de création
    updated_at timestamp DEFAULT now()            -- Date de mise à jour
);


-- Ajouter la contrainte de clé étrangère
ALTER TABLE departure
ADD CONSTRAINT fk_operator FOREIGN KEY (operator) REFERENCES company (id)
ON DELETE CASCADE;


-- Ajouter une colonne pour la date de mise à jour
CREATE OR REPLACE FUNCTION update_company_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_company_updated_at
BEFORE UPDATE ON company
FOR EACH ROW
EXECUTE FUNCTION update_company_updated_at();
