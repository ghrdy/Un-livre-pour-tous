import { API_URL } from './config';
export interface ChildProfile {
  _id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  classeSuivie: string;
  noteObservation: string;
  photo: string | null;
  parentId: string;
  status: string;
}

export interface CreateChildProfileData extends FormData {}

export interface UpdateChildProfileData extends FormData {}



export async function getChildProfiles(token: string): Promise<ChildProfile[]> {
  const response = await fetch(`${API_URL}/childProfiles`, {
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch child profiles');
  }

  return response.json();
}

export async function getChildProfile(id: string, token: string): Promise<ChildProfile> {
  const response = await fetch(`${API_URL}/childProfiles/${id}`, {
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch child profile');
  }

  return response.json();
}

export async function createChildProfile(data: CreateChildProfileData, token: string): Promise<ChildProfile> {
  const response = await fetch(`${API_URL}/childProfiles`, {
    method: 'POST',
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
    body: data,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create child profile');
  }

  return response.json();
}

export async function updateChildProfile(id: string, data: UpdateChildProfileData, token: string): Promise<ChildProfile> {
  const response = await fetch(`${API_URL}/childProfiles/${id}`, {
    method: 'PUT',
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
    body: data,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update child profile');
  }

  return response.json();
}

export async function deleteChildProfile(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/childProfiles/${id}`, {
    method: 'DELETE',
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete child profile');
  }
}