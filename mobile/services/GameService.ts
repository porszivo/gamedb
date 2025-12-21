const API_URL = 'http://localhost:3000/api/games';

export async function searchGameApi(query: string, platform?: string) {
  let url = API_URL + '/search?q=' + query;
  if (platform) url += '&platform=' + platform;
  const res = await fetch(url);
  if(!res.ok) throw new Error("Fehler beim Aufruf der Suchschnittstelle: " + res.status);
  return res.json();
}