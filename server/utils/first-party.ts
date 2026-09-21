/**
 * Une requête est « first-party » si elle ne provient pas d'un autre site.
 *
 * C'est ce contrôle qui remplace la clé d'API que le navigateur devait
 * présenter, et qui était donc lisible dans le bundle client.
 *
 * `Sec-Fetch-Site` est posé par le navigateur et n'est pas modifiable par le
 * script appelant : il fait foi quand il est présent. `Origin` sert de repli
 * pour les navigateurs qui ne l'envoient pas. Une requête sans aucun des deux
 * (rendu serveur, appel serveur à serveur) est considérée first-party.
 *
 * ⚠️ Ce contrôle ferme l'usage cross-site depuis un navigateur, pas l'accès
 * d'un client HTTP quelconque, qui peut omettre ces en-têtes.
 */
export function isFirstParty(
  fetchSite: string | undefined,
  origin: string | undefined,
  host: string
): boolean {
  if (fetchSite) {
    return fetchSite !== 'cross-site'
  }

  if (!origin) {
    return true
  }

  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}
