import { Injectable } from '@nestjs/common';
import { JwtConfig } from './jwt.config';
import jwt from 'jsonwebtoken';
import type { JwtPayloadDto } from '@modules/auth/dtos/auth.dto';
import type { Socket } from 'socket.io';
import type { Request } from 'express';

@Injectable()
export class JwtService {
  constructor(private readonly jwtConfig: JwtConfig) {}

  sign(payload: JwtPayloadDto, options?: jwt.SignOptions): string {
    // Garante que não sejam passados dados desnecessários para o payload
    const exactPayload = {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };

    return jwt.sign(exactPayload, this.jwtConfig.secret, {
      expiresIn: '1h',
      ...options,
    });
  }

  getPayload(token: string): JwtPayloadDto | null {
    try {
      return jwt.verify(token, this.jwtConfig.secret) as JwtPayloadDto;
    } catch {
      return null;
    }
  }

  extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return null;

    return authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  }

  extractTokenFromHandshake(client: Socket): string | null {
    const auth = client.handshake.auth?.token as string | undefined;
    if (auth) return auth;

    return this.extractTokenFromHeader(client.handshake as unknown as Request);
  }
}
