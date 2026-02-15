
import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'admin',
      password: '123', // In a real app, this should be hashed
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  // Placeholder for future registration logic
  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }
}
