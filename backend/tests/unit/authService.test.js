// tests/unit/authService.test.js
import { AuthService } from '../../src/services/authService.js';
import { User } from '../../src/models/index.js';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('../../src/models/index.js', () => ({
  User: {
    findOne: jest.fn()
  }
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const mockToken = 'mock.jwt.token';
      jwt.sign.mockReturnValue(mockToken);

      process.env.JWT_SECRET = 'test-secret';
      process.env.JWT_EXPIRES_IN = '1h';

      const token = AuthService.generateToken('user123');

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'user123' },
        'test-secret',
        { expiresIn: '1h' }
      );
      expect(token).toBe(mockToken);
    });
  });

  describe('validateUserCredentials', () => {
    it('should return user when credentials are valid', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        validatePassword: jest.fn().mockResolvedValue(true)
      };
      User.findOne.mockResolvedValue(mockUser);

      const user = await AuthService.validateUserCredentials('test@example.com', 'password');

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(mockUser.validatePassword).toHaveBeenCalledWith('password');
      expect(user).toBe(mockUser);
    });

    it('should return null when user not found', async () => {
      User.findOne.mockResolvedValue(null);

      const user = await AuthService.validateUserCredentials('test@example.com', 'password');

      expect(user).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const mockUser = {
        validatePassword: jest.fn().mockResolvedValue(false)
      };
      User.findOne.mockResolvedValue(mockUser);

      const user = await AuthService.validateUserCredentials('test@example.com', 'wrongpassword');

      expect(user).toBeNull();
    });
  });
});