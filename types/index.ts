export interface City {
  id?: number;
  name: string;
  region?: string;
  country?: string;
  countryFlag?: string; // Emoji drapeau du pays (ex: 🇬🇭 pour Ghana)
  latitude?: number;
  longitude?: number;
}
