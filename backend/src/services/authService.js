import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export class AuthService {
  static generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  static generateRefreshToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
  }

  static verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  static async validateUserCredentials(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;
    
    const isValid = await user.validatePassword(password);
    return isValid ? user : null;
  }

  static async updateUserLastLogin(userId) {
    await User.update(
      { lastLogin: new Date() },
      { where: { id: userId } }
    );
  }
}