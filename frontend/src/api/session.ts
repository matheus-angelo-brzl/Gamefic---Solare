export type UserPayload = { id: string; name: string; email: string; role: string };
type TokenPayload = Partial<UserPayload> & { iat?: number; exp?: number };

export class Session {
  static isAuthenticated(): boolean {
    const authToken = this.AuthToken;
    const payload = this.DecodedPayload;

    if (!authToken || !payload || typeof payload.exp !== 'number') return false;

    return payload.exp * 1000 > Date.now();
  }

  static logoutAndRedirect(): void {
    localStorage.removeItem('AuthToken');
    localStorage.removeItem('TokenPayload');
    window.location.href = '/';
  }

  static get User(): UserPayload | null {
    const payload = this.DecodedPayload;
    if (!payload || !payload.id || !payload.name || !payload.email || !payload.role) return null;

    return { id: payload.id, name: payload.name, email: payload.email, role: payload.role };
  }

  static get AuthToken(): string | null {
    return localStorage.getItem('AuthToken');
  }

  // Retorno da API (usado na tela de login)
  static set AuthToken(data: unknown) {
    if (typeof data === 'string') {
      localStorage.setItem('AuthToken', data);
      localStorage.setItem('TokenPayload', JSON.stringify(this.decodeToken(data)));
    }
  }

  private static get DecodedPayload(): TokenPayload | null {
    const stored = localStorage.getItem('TokenPayload');
    if (!stored) return null;

    return JSON.parse(stored);
  }

  private static decodeToken(token: string): TokenPayload | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;

      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      const json = atob(padded);

      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}
