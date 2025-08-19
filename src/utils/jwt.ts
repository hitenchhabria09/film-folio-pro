// Simple browser-compatible JWT utilities
// Note: This is for demo purposes only. In production, use proper server-side JWT validation.

export interface JWTPayload {
  userId: string;
  exp?: number;
  iat?: number;
}

export const simpleJWT = {
  // Create a simple token (base64 encoded for demo purposes)
  sign: (payload: { userId: string }, secret: string, options?: { expiresIn?: string }): string => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    
    let exp: number | undefined;
    if (options?.expiresIn) {
      // Simple parsing for "7d" format
      const match = options.expiresIn.match(/^(\d+)([dwh])$/);
      if (match) {
        const value = parseInt(match[1]);
        const unit = match[2];
        const multiplier = unit === 'd' ? 86400 : unit === 'w' ? 604800 : 3600; // d=day, w=week, h=hour
        exp = now + (value * multiplier);
      }
    }
    
    const tokenPayload: JWTPayload = {
      ...payload,
      iat: now,
      ...(exp && { exp })
    };
    
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(tokenPayload));
    const signature = btoa(`${encodedHeader}.${encodedPayload}.${secret}`);
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  },

  // Verify and decode token
  verify: (token: string, secret: string): JWTPayload => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      const [encodedHeader, encodedPayload, signature] = parts;
      
      // Verify signature
      const expectedSignature = btoa(`${encodedHeader}.${encodedPayload}.${secret}`);
      if (signature !== expectedSignature) {
        throw new Error('Invalid token signature');
      }
      
      // Decode payload
      const payload: JWTPayload = JSON.parse(atob(encodedPayload));
      
      // Check expiration
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('Token expired');
      }
      
      return payload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  // Decode without verification (for getting payload when token is expired)
  decode: (token: string): JWTPayload | null => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload: JWTPayload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (error) {
      return null;
    }
  }
};