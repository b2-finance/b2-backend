import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from 'src/log/log.service';
import { ProfileController } from './profile.controller';
import { UserService } from 'src/auth/user/service/user.service';
import { UserMapper } from 'src/auth/user/mapper/user.mapper';
import { User } from 'src/auth/user/entity/user.entity';
import { UserDto } from 'src/auth/user/dto/user.dto';
import { SessionGuard } from 'src/auth/session/guard/session.guard';
import { AuthRequest } from 'src/auth/auth-request.dto';
import { randomUUID } from 'crypto';

describe(ProfileController.name, () => {
  let con: ProfileController;
  let userSvc: UserService;
  let userMap: UserMapper;
  let user: User;
  let userDto: UserDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        LogService,
        {
          provide: UserService,
          useValue: { findOne: jest.fn() }
        },
        {
          provide: UserMapper,
          useValue: { userToDto: jest.fn() }
        }
      ]
    })
      .overrideGuard(SessionGuard)
      .useValue({})
      .compile();

    con = module.get<ProfileController>(ProfileController);
    userSvc = module.get<UserService>(UserService);
    userMap = module.get<UserMapper>(UserMapper);

    user = {
      id: randomUUID(),
      username: 'username',
      email: 'username@email.com',
      createDate: new Date(),
      updateDate: new Date()
    };

    userDto = {
      id: user.id,
      username: user.username,
      email: user.email
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe(ProfileController.prototype.getUser.name, () => {
    it('should return the expected user DTO', async () => {
      jest
        .spyOn(userSvc, 'findOne')
        .mockImplementation(async (x) =>
          x.where?.['id'] === user.id ? user : null
        );
      jest
        .spyOn(userMap, 'userToDto')
        .mockImplementation((x) => (x === user ? userDto : null));

      const req = {
        user: {
          sub: user.id,
          username: user.username
        }
      } as AuthRequest;

      const actual = await con.getUser(req);
      expect(actual).toEqual(userDto);
    });
  });
});
