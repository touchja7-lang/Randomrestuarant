import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = '7d';

const signToken = (userId: string) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

export const register = async (input: RegisterInput) => {
  const existing = await User.findOne({ email: input.email });
  if (existing) throw { statusCode: 409, message: 'Email already in use' };

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await User.create({ name: input.name, email: input.email, passwordHash });

  const token = signToken(user._id.toString());
  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
};

export const login = async (input: LoginInput) => {
  const user = await User.findOne({ email: input.email });
  if (!user) throw { statusCode: 401, message: 'Invalid credentials' };

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw { statusCode: 401, message: 'Invalid credentials' };

  const token = signToken(user._id.toString());
  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
};
