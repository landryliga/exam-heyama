export interface AppObject {
    _id: string;
    title: string;
    description?: string;
    imageUrl: string;
  }
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://votre-projet.vercel.app';
  
  export async function fetchObjects(): Promise<AppObject[]> {
    const res = await fetch(`${API_URL}/objects`);
    
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textError = await res.text();
      console.error("Le serveur n'a pas répondu en JSON. Réponse reçue :", textError);
      throw new Error("Erreur de communication : Le backend a renvoyé une page HTML au lieu de données.");
    }
  
    return res.json();
  }
  
  export async function createObject(title: string, description: string, file: File): Promise<AppObject> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', file);
  
    const res = await fetch(`${API_URL}/objects`, {
      method: 'POST',
      body: formData,
    });
  
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textError = await res.text();
      console.error("Le serveur n'a pas répondu en JSON lors du POST. Réponse reçue :", textError);
      throw new Error("Impossible d'ajouter l'objet. Le serveur a renvoyé une erreur.");
    }
  
    return res.json();
  }

export async function deleteObject(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/objects/${id}`, {
      method: 'DELETE',
    });
  
    if (!res.ok) {
      throw new Error("Impossible de supprimer l'objet.");
    }
  }