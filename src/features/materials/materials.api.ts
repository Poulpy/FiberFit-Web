export async function deleteMaterial(id: number) {
  const reponse = await fetch(`http://localhost:3000/materials/${id}`, {
    method: 'DELETE',
  });
  if (!reponse.ok) {
    throw new Error(`Statut de réponse : ${reponse.status}`);
  }
}
