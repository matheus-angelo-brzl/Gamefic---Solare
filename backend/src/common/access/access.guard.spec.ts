import { mock, MockProxy, mockDeep } from 'jest-mock-extended';
import { createUserMock } from '@test/factories/user.factory';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@common/jwt/jwt.service';
import { Reflector } from '@nestjs/core';
import { AccessGuard } from './access.guard';

describe('AccessGuard', () => {
  let jwtService: MockProxy<JwtService>;
  let reflector: MockProxy<Reflector>;
  let guard: AccessGuard;

  beforeEach(() => {
    jwtService = mock<JwtService>();
    reflector = mock<Reflector>();
    guard = new AccessGuard(jwtService, reflector);
  });

  const mockContext = (headers: Record<string, string> = {}, roles: string[] = []) => {
    reflector.getAllAndOverride.mockReturnValue(roles);

    const context = mockDeep<ExecutionContext>();
    context.switchToHttp.mockReturnValue({
      getRequest: () => ({ headers }),
    } as any);

    return context;
  };

  it('should allow access if route is "public"', () => {
    const ctx = mockContext({}, ['public']);

    const canEnter = guard.canActivate(ctx);
    expect(canEnter).toBe(true);
  });

  it('should deny access if token is missing', () => {
    const ctx = mockContext({}, ['rh']);
    jwtService.extractTokenFromHeader.mockReturnValue(null);

    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('should deny access if token is invalid or expired', () => {
    const ctx = mockContext({ authorization: 'Bearer invalid-token' }, ['rh']);
    jwtService.extractTokenFromHeader.mockReturnValue('invalid-token');
    jwtService.getPayload.mockReturnValue(null);

    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('should allow access if user role matches', () => {
    const ctx = mockContext({ authorization: 'Bearer valid-token' }, ['rh']);
    jwtService.extractTokenFromHeader.mockReturnValue('valid-token');
    jwtService.getPayload.mockReturnValue(createUserMock({ role: 'rh' }));

    const canEnter = guard.canActivate(ctx);
    expect(canEnter).toBe(true);
  });

  it('should deny access if user role does not match', () => {
    const ctx = mockContext({ authorization: 'Bearer valid-token' }, ['rh']);
    jwtService.extractTokenFromHeader.mockReturnValue('valid-token');
    jwtService.getPayload.mockReturnValue(createUserMock({ role: 'member' }));

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});
