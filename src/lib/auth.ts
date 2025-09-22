import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Simple in-memory user storage (replace with real database in production)
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

const users: User[] = [
  {
    id: '1',
    email: 'admin@cited.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
    name: 'Admin User',
    createdAt: new Date()
  }
];

export async function authenticateUser(email: string, password: string): Promise<{ user: Omit<User, 'password'> | null; token: string | null }> {
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return { user: null, token: null };
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  
  if (!isValidPassword) {
    return { user: null, token: null };
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded;
  } catch {
    return null;
  }
}

export function getUserById(userId: string): Omit<User, 'password'> | null {
  const user = users.find(u => u.id === userId);
  if (!user) return null;
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}