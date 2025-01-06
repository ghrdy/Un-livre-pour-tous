import { API_URL } from './config';
export interface Book {
  _id: string;
  titre: string;
  photo: string | null;
}



export async function getBooks(token: string): Promise<Book[]> {
  const response = await fetch(`${API_URL}/books`, {
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }

  return response.json();
}

export async function createBook(data: FormData, token: string): Promise<Book> {
  const response = await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
    body: data,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create book');
  }

  return response.json();
}

export async function updateBook(id: string, data: FormData, token: string): Promise<Book> {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: 'PUT',
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
    body: data,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update book');
  }

  return response.json();
}

export async function deleteBook(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: 'DELETE',
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete book');
  }
}