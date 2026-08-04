import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRepository } from './auth.repository.js';
import { SignupDto, LoginDto } from './auth.validator.js';
import { config } from '../../config/index.js';
import { UnauthorizedError, ValidationError } from '../../utils/errors.js';

export class AuthService {
  private authRepo: AuthRepository;

  constructor() {
    this.authRepo = new AuthRepository();
  }

  async signup(dto: SignupDto) {
    const existing = await this.authRepo.findByEmail(dto.email);
    if (existing) {
      throw new ValidationError('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.authRepo.createUser({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone
    });

    const roleName = dto.role || 'BUYER';
    await this.authRepo.assignRole(user.id, roleName as any);

    const updatedUser = await this.authRepo.findById(user.id);
    const roles = updatedUser?.userRoles.map((ur: any) => ur.role.name) || [roleName];

    const accessToken = this.generateAccessToken(user.id, user.email, roles);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles
      },
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }

  async login(dto: LoginDto) {
    const user = await this.authRepo.findByEmail(dto.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid credentials or account disabled');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const roles = user.userRoles.map((ur: any) => ur.role.name);
    const accessToken = this.generateAccessToken(user.id, user.email, roles);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles
      },
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }

  private generateAccessToken(id: string, email: string, roles: string[]): string {
    return jwt.sign({ id, email, roles }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any
    });
  }

  private generateRefreshToken(id: string): string {
    return jwt.sign({ id }, config.jwtRefreshSecret, {
      expiresIn: config.jwtRefreshExpiresIn as any
    });
  }
}
