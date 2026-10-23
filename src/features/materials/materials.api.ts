import type { Material } from './materials.types';

export async function getMaterial(id: string): Promise<Material> {
  const response = await fetch(`http://localhost:3000/materials/${id}`);
  if (!response.ok) {
    throw new Error(`Statut de réponse : ${response.status}`);
  } else {
    return (await response).json();
  }
}

export async function deleteMaterial(id: number) {
  const reponse = await fetch(`http://localhost:3000/materials/${id}`, {
    method: 'DELETE',
  });
  if (!reponse.ok) {
    throw new Error(`Statut de réponse : ${reponse.status}`);
  }
}
