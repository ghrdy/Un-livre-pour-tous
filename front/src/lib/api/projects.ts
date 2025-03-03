import { API_URL } from './config';
export interface Project {
  _id: string;
  image: string | null;
  nom: string;
  annee: number;
  animateurs: string[];
  books?: string[];
  children?: string[];
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

export async function getProject(id: string, token: string): Promise<Project> {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch project');
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

export async function getProjectBooks(id: string, token: string): Promise<any[]> {
  const response = await fetch(`${API_URL}/projects/${id}/books`, {
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch project books');
  }

  return response.json();
}

export async function getProjectChildren(id: string, token: string): Promise<any[]> {
  const response = await fetch(`${API_URL}/projects/${id}/children`, {
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch project children');
  }

  return response.json();
}

export async function getProjectUsers(id: string, token: string): Promise<any[]> {
  const response = await fetch(`${API_URL}/projects/${id}/users`, {
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch project users');
  }

  return response.json();
}

export async function addBooksToProject(id: string, bookIds: string[], token: string): Promise<Project> {
  const response = await fetch(`${API_URL}/projects/${id}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({ bookIds }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add books to project');
  }

  return response.json();
}

export async function removeBooksFromProject(id: string, bookIds: string[], token: string): Promise<Project> {
  const response = await fetch(`${API_URL}/projects/${id}/books`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({ bookIds }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to remove books from project');
  }

  return response.json();
}

export async function addChildrenToProject(id: string, childIds: string[], token: string): Promise<Project> {
  const response = await fetch(`${API_URL}/projects/${id}/children`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({ childIds }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add children to project');
  }

  return response.json();
}

export async function removeChildrenFromProject(id: string, childIds: string[], token: string): Promise<Project> {
  const response = await fetch(`${API_URL}/projects/${id}/children`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({ childIds }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to remove children from project');
  }

  return response.json();
}