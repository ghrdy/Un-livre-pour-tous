import { Book } from "./books";
import { API_URL } from './config';

export interface BookLoan {
  _id: string;
  book: Book;
  bookTitle: string;
  childId: string;
  loanDate: string;
  returnDate: string;
}

export interface CreateBookLoanData {
  book: Book; 
  childId: string; 
  returnDate: string;
}

export interface UpdateBookLoanData {
  book?: Book;
  childId?: string;
  returnDate?: string;
}


export async function getBookLoansByUserId(userId: string, token: string): Promise<BookLoan[]> {
  const response = await fetch(`${API_URL}/bookLoans/${userId}`, {
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch book loans');
  }

  const data = await response.json();
  return data;
}

export async function createBookLoan(data: CreateBookLoanData, token: string): Promise<BookLoan> {
  const response = await fetch(`${API_URL}/bookLoans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create book loan');
  }

  // Update hasLoan property
  await fetch(`${API_URL}/childProfiles/${data.childId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({ hasLoan: true }),
  });

  return response.json();
}

export async function updateBookLoan(id: string, data: UpdateBookLoanData, token: string): Promise<BookLoan> {
  const response = await fetch(`${API_URL}/bookLoans/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update book loan');
  }

  return response.json();
}

export async function deleteBookLoan(id: string, token: string): Promise<void> {
  // Fetch the book loan before deleting it
  const bookLoanResponse = await fetch(`${API_URL}/bookLoans/${id}`, {
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!bookLoanResponse.ok) {
    const error = await bookLoanResponse.json();
    throw new Error(error.message || 'Failed to fetch book loan');
  }

  const bookLoan = await bookLoanResponse.json();

  // Delete the book loan
  const response = await fetch(`${API_URL}/bookLoans/${id}`, {
    method: 'DELETE',
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete book loan');
  }

  // Update hasLoan property
  await fetch(`${API_URL}/childProfiles/${bookLoan.childId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({ hasLoan: false }),
  });
}