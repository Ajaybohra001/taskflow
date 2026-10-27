import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './user.entity';

export interface PublicUser {
  id: number;
  email: string;
  name: string;
}

const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password';
const DUMMY_HASH =
  '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<PublicUser> {
    const email = this.normalizeEmail(dto.email);
    const existing = await this.users.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    try {
      const user = await this.users.save(
        this.users.create({ email, passwordHash, name: dto.name }),
      );
      return this.toPublicUser(user);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('Email is already registered');
      }
      throw error;
    }
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.users.findOne({
      where: { email: this.normalizeEmail(dto.email) },
    });
    if (!user) {
      await bcrypt.compare(dto.password, DUMMY_HASH);
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    return { accessToken: await this.jwt.signAsync({ sub: user.id }) };
  }

  async getCurrentUser(id: number): Promise<PublicUser> {
    const user = await this.users.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('Invalid authentication token');
    }
    return this.toPublicUser(user);
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private toPublicUser(user: User): PublicUser {
    return { id: user.id, email: user.email, name: user.name };
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return error instanceof Error && /unique|constraint/i.test(error.message);
  }
}
