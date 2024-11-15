import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { UsersRepository } from './users.repository';
import { CreateUserDTO } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { FilterQuery } from 'mongoose';
import { NOTIFICATIONS_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, tap } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject('NOTIFICATIONS')
    private readonly notificationClient: ClientProxy,
  ) {}

  async createUser(createuserDTO: CreateUserDTO) {
    try {
      await this.validateCreateUserRequest(createuserDTO);
      const user = await this.usersRepository.create({
        ...createuserDTO,
        password: await hash(createuserDTO.password, 10),
      });
      this.sendValidationEmail(user);
      return user;
    } catch (error) {
      throw new UnprocessableEntityException();
    }
  }

  private async validateCreateUserRequest(createuserDTO: CreateUserDTO) {
    let user: User;
    try {
      user = await this.usersRepository.findOne({
        email: createuserDTO.email,
      });
    } catch (err) {}
    if (user) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async getUser(getUserArgs: FilterQuery<UserDocument>) {
    return this.usersRepository.findOne(getUserArgs);
  }

  // users service publishers
  private async sendValidationEmail(user: UserDocument) {
    this.notificationClient.emit('user_created', user);
  }
}
