-- Table articles pour le blog
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  author JSONB NOT NULL DEFAULT '{"name": "Équipe Geyavo"}'::jsonb,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reading_time INTEGER DEFAULT 5,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN(tags);

-- Fonction pour générer un slug à partir du titre
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  -- Convertir en minuscules et remplacer les espaces par des tirets
  slug := lower(trim(title));
  
  -- Remplacer les caractères accentués
  slug := translate(slug, 
    'àáâãäåāăąèéêëēĕėęěìíîïìĩīĭòóôõöōŏőùúûüũūŭůçćĉċčñńņňýÿ',
    'aaaaaaaaaeeeeeeeeeiiiiiiiiooooooooouuuuuuuuccccccnnnnyy'
  );
  
  -- Remplacer les caractères spéciaux et espaces par des tirets
  slug := regexp_replace(slug, '[^a-z0-9]+', '-', 'g');
  
  -- Supprimer les tirets en début et fin
  slug := regexp_replace(slug, '^-+|-+$', '', 'g');
  
  RETURN slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fonction pour générer un slug unique
CREATE OR REPLACE FUNCTION generate_unique_slug(title TEXT, article_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  base_slug := generate_slug(title);
  final_slug := base_slug;
  
  -- Vérifier si le slug existe déjà (en excluant l'article actuel si c'est une mise à jour)
  WHILE EXISTS (
    SELECT 1 FROM articles 
    WHERE slug = final_slug 
    AND (article_id IS NULL OR id != article_id)
  ) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour auto-générer le slug avant insertion/mise à jour
CREATE OR REPLACE FUNCTION auto_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Générer le slug seulement si il est vide ou NULL
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_unique_slug(NEW.title, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour auto-générer le slug
DROP TRIGGER IF EXISTS auto_generate_article_slug ON articles;
CREATE TRIGGER auto_generate_article_slug
    BEFORE INSERT OR UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_slug();

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Données de test (optionnel)
-- Le slug sera généré automatiquement à partir du titre
INSERT INTO articles (title, excerpt, content, cover_image, category, tags, published, reading_time) VALUES
(
  'Bienvenue sur le blog Geyavo',
  'Découvrez notre nouveau blog dédié au transport en Côte d''Ivoire. Conseils, actualités et informations utiles pour vos voyages.',
  '<h2>Un nouveau blog pour vous accompagner</h2><p>Nous sommes ravis de lancer notre blog pour partager avec vous des informations utiles sur le transport en Côte d''Ivoire.</p><h3>Ce que vous trouverez ici</h3><ul><li>Des conseils pour voyager en toute sécurité</li><li>Les actualités du secteur du transport</li><li>Des guides pratiques pour vos déplacements</li><li>Des interviews de professionnels du transport</li></ul><p>Restez connectés pour ne rien manquer !</p>',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=600&fit=crop',
  'Actualité',
  ARRAY['transport', 'blog', 'geyavo'],
  true,
  3
),
(
  'Conseils pour voyager en toute sécurité',
  'Découvrez nos meilleurs conseils pour voyager en toute sécurité en car à travers la Côte d''Ivoire.',
  '<h2>La sécurité avant tout</h2><p>Voyager en car est l''un des moyens de transport les plus populaires en Côte d''Ivoire. Voici nos conseils pour un voyage en toute sécurité.</p><h3>Avant le départ</h3><ul><li>Vérifiez la réputation de la compagnie</li><li>Arrivez en avance à la gare</li><li>Gardez vos objets de valeur avec vous</li></ul><h3>Pendant le trajet</h3><ul><li>Attachez votre ceinture de sécurité</li><li>Restez vigilant</li><li>Hydratez-vous régulièrement</li></ul>',
  'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&h=600&fit=crop',
  'Conseils',
  ARRAY['sécurité', 'voyage', 'conseils'],
  true,
  5
);

-- Activer Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy pour permettre la lecture publique des articles publiés
CREATE POLICY "Articles publiés sont visibles par tous"
  ON articles FOR SELECT
  USING (published = true);

-- Policy pour permettre toutes les opérations aux utilisateurs authentifiés (admin)
-- CREATE POLICY "Admins peuvent tout faire"
--   ON articles FOR ALL
--   USING (auth.role() = 'authenticated');
