export async function assignReferentToBadge(badgeId: string, referentId: string) {
  const res = await fetch(`/api/badges/${badgeId}/referents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ referentId }),
  });
  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Erreur assignation référent: ${res.status} - ${errorData}`);
  }
  return await res.json();
}

export async function removeReferentFromBadge(badgeId: string, referentId: string) {
  const res = await fetch(`/api/badges/${badgeId}/referents`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ referentId }),
  });
  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Erreur suppression référent: ${res.status} - ${errorData}`);
  }
  return await res.json();
}