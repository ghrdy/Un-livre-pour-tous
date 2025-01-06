import { API_URL } from './config';
export interface Project {
  _id: string;
  image: string | null;
  nom: string;
  annee: number;
  animateurs: string[];
}

export interface CreateProjectData extends FormData {}

export interface UpdateProjectData extends FormData {}



export async function getProjects(token: string): Promise<Project[]> {
  const response = await fetch(`${API_URL}/projects`, {
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }

  return response.json();
}

export async function createProject(data: CreateProjectData, token: string): Promise<Project> {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
    body: data,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create project');
  }

  return response.json();
}

export async function updateProject(id: string, data: UpdateProjectData, token: string): Promise<Project> {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
    body: data,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update project');
  }

  return response.json();
}

export async function deleteProject(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete project');
  }
}