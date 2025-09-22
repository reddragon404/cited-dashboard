// Client-side authentication utilities

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

// interface AuthResponse {
//   user: User;
//   token: string;
// }

export async function login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return { success: true, user: data.user };
    } catch (_error) {
    return { success: false, error: 'Network error' };
  }
}

export async function getCurrentUser(): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return { success: true, user: data.user };
    } catch (_error) {
    return { success: false, error: 'Network error' };
  }
}

export async function logout(): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return { success: true };
    } catch (_error) {
    return { success: false, error: 'Network error' };
  }
}

export async function searchDomain(domain: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ domain }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    return { success: true, data };
    } catch (_error) {
    return { success: false, error: 'Network error' };
  }
}