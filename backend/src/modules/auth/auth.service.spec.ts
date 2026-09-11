import { mock, mockDeep, MockProxy, DeepMockProxy } from 'jest-mock-extended';
import { createUserMock } from '@test/factories/user.factory';
import { PrismaService } from '@common/prisma/prisma.service';
import { JwtService } from '@common/jwt/jwt.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_pass'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let jwtService: MockProxy<JwtService>;
  let service: AuthService;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    jwtService = mock<JwtService>();
    const mockUser = createUserMock();

    prisma.user.create.mockResolvedValue(mockUser);
    prisma.user.findUnique.mockResolvedValue(mockUser);
    jwtService.sign.mockReturnValue('fake_token');

    service = new AuthService(prisma, jwtService);
  });

  it('should register a user and return a token', async () => {
    const result = await service.registerUser({
      email: 'a@a.com',
      password: '123',
      name: 'User',
    });

    expect(result).toBe('fake_token');
    expect(prisma.user.create).toHaveBeenCalled();
    expect(jwtService.sign).toHaveBeenCalled();
  });

  it('should login and return a token', async () => {
    const result = await service.loginUser({
      email: 'a@a.com',
      password: '123',
    });

    expect(result).toBe('fake_token');
    expect(prisma.user.findUnique).toHaveBeenCalled();
    expect(jwtService.sign).toHaveBeenCalled();
  });
});
