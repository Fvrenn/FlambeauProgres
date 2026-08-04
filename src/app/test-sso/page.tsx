import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function TestSSO() {
  const store = await cookies();
  const all = store.getAll();
  const wp = all.filter(c => c.name.startsWith('wordpress'));

  // On ré-encode les valeurs et on ne garde que les cookies utiles
  const cookieHeader = all
    .filter(c => c.name.startsWith('wordpress') || c.name.startsWith('wfwaf'))
    .map(c => `${c.name}=${encodeURIComponent(c.value)}`)
    .join('; ');

  let result: unknown;
  try {
    const res = await fetch(
      'https://plateforme.flambeaux.org/wp-json/wp/v2/users/me?context=edit&_wpnonce=1',
      { headers: { cookie: cookieHeader }, cache: 'no-store' }
    );
    result = { status: res.status, body: await res.json() };
  } catch (e) {
    result = { error: String(e) };
  }

  return (
    <div style={{ fontFamily: 'monospace', padding: 24 }}>
      <h1>Test SSO</h1>
      <p>Cookies reçus : {all.length} — dont WordPress : {wp.length}</p>
      <pre>{JSON.stringify(all.map(c => c.name), null, 2)}</pre>

      <h2>Header envoyé</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{cookieHeader.slice(0, 200)}…</pre>

      <h2>Appel API WordPress</h2>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}