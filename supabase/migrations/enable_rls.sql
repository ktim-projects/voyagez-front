-- =============================================================================
-- Row Level Security
-- =============================================================================
--
-- L'application interroge Supabase avec la clé anonyme, qui est publique par
-- conception (elle est dans le bundle client, comme chez tout projet Supabase).
-- Sans RLS, cette clé donne un accès complet en lecture ET en écriture à
-- quiconque la récupère : le middleware applicatif ne protège rien, puisqu'on
-- peut parler à Supabase directement sans passer par le site.
--
-- Le RLS est donc la seule vraie frontière sur les données.
--
-- ⚠️ À APPLIQUER MANUELLEMENT APRÈS RELECTURE.
-- Activer le RLS sans policy rend une table totalement inaccessible : vérifier
-- d'abord sur un environnement de test que le site fonctionne toujours, puis
-- appliquer en production.
--
--   psql "$SUPABASE_DB_URL" -f supabase/migrations/enable_rls.sql
--
-- Note : la clé `service_role` contourne le RLS. Toute tâche d'administration
-- (import de départs, publication d'articles) doit passer par elle, jamais par
-- la clé anonyme.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- departure : catalogue public, lecture seule
-- -----------------------------------------------------------------------------
ALTER TABLE departure ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "departure_public_read" ON departure;
CREATE POLICY "departure_public_read"
  ON departure
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- -----------------------------------------------------------------------------
-- company : catalogue public, lecture seule
-- -----------------------------------------------------------------------------
ALTER TABLE company ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "company_public_read" ON company;
CREATE POLICY "company_public_read"
  ON company
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- -----------------------------------------------------------------------------
-- articles : seuls les articles publiés sont lisibles
--
-- L'API filtre déjà sur published = true, mais ce filtre est applicatif :
-- un appel direct à Supabase pouvait lire les brouillons.
-- -----------------------------------------------------------------------------
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "articles_public_read_published" ON articles;
CREATE POLICY "articles_public_read_published"
  ON articles
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- -----------------------------------------------------------------------------
-- news : catalogue public, lecture seule
-- -----------------------------------------------------------------------------
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "news_public_read" ON news;
CREATE POLICY "news_public_read"
  ON news
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- -----------------------------------------------------------------------------
-- Compteur de vues
--
-- La page article incrémentait `views` avec un UPDATE depuis la clé anonyme,
-- ce qui supposait un droit d'écriture sur toute la table — et procédait par
-- lecture puis écriture, donc perdait des vues en cas d'accès simultanés.
--
-- Une fonction SECURITY DEFINER permet l'incrément atomique sans ouvrir
-- l'écriture sur la table.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_article_views(article_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE articles
  SET views = COALESCE(views, 0) + 1
  WHERE id = article_id AND published = true;
$$;

REVOKE ALL ON FUNCTION increment_article_views(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_article_views(UUID) TO anon, authenticated;
