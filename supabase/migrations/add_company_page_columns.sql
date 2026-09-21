-- =============================================================================
-- Colonnes pour les pages compagnie (/compagnies/:slug)
-- =============================================================================
--
-- Toutes ces colonnes sont OPTIONNELLES : la page fonctionne sans elles.
-- Le code lit la table avec `select('*')` et retombe sur des valeurs dérivées
-- quand une colonne est absente ou vide, ce qui permet de déployer la page
-- avant d'avoir appliqué cette migration.
--
-- ⚠️ À APPLIQUER MANUELLEMENT.
--
--   psql "$SUPABASE_DB_URL" -f supabase/migrations/add_company_page_columns.sql
--
-- Après application, penser à ajouter la politique de lecture si le RLS est
-- activé (cf. enable_rls.sql : la policy "company_public_read" couvre déjà
-- toutes les colonnes de la table).
-- =============================================================================

-- Slug de l'URL. Laissé vide, l'application le dérive du nom :
-- « UTB » -> utb, « Grand Sud Transport » -> grand-sud-transport.
-- À ne renseigner que pour forcer une URL différente du nom.
ALTER TABLE company ADD COLUMN IF NOT EXISTS slug text;

-- Couleur de marque, au format hexadécimal (#RRGGBB). Teinte l'en-tête de la
-- page compagnie. Vide = couleur primaire de Geyavo.
ALTER TABLE company ADD COLUMN IF NOT EXISTS brand_color text;

-- Présentation courte, affichée sous le nom. 2 à 3 phrases suffisent.
ALTER TABLE company ADD COLUMN IF NOT EXISTS description text;

-- Numéro WhatsApp au format international sans séparateurs (ex : 2250700000000).
ALTER TABLE company ADD COLUMN IF NOT EXISTS whatsapp text;

-- Site officiel de la compagnie, avec le protocole (https://...).
ALTER TABLE company ADD COLUMN IF NOT EXISTS website text;

-- Unicité du slug quand il est renseigné : deux compagnies ne peuvent pas
-- revendiquer la même URL. Les NULL ne sont pas contraints.
CREATE UNIQUE INDEX IF NOT EXISTS company_slug_key
  ON company (slug)
  WHERE slug IS NOT NULL;

-- Garde-fou sur le format de la couleur : une valeur invalide casserait le
-- rendu de l'en-tête.
ALTER TABLE company DROP CONSTRAINT IF EXISTS company_brand_color_format;
ALTER TABLE company ADD CONSTRAINT company_brand_color_format
  CHECK (brand_color IS NULL OR brand_color ~ '^#[0-9A-Fa-f]{6}$');

-- Exemple de remplissage :
--
-- UPDATE company
-- SET description = 'Compagnie reliant Abidjan aux principales villes du nord.',
--     brand_color = '#1B7F4B',
--     whatsapp    = '2250700000000',
--     website     = 'https://example.ci'
-- WHERE name = 'UTB';
