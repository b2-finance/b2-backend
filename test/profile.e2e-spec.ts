import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app/app.module';
import { ProfileController } from 'src/profile/profile.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user/entity/user.entity';
import { UserDto } from 'src/auth/user/dto/user.dto';
import { signup } from './utils';
import cookieParser from 'cookie-parser';

describe(`${ProfileController.name} (e2e)`, () => {
  let app: INestApplication;
  let userRepo: Repository<User>;
  let userDto: UserDto;
  let sessionCookie: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: []
    }).compile();

    app = module.createNestApplication();
    app.use(cookieParser());
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    await app.init();

    const { userDto: u, sessionCookie: s } = await signup(app);
    userDto = u;
    sessionCookie = s;
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await userRepo.query('DELETE FROM db_user');
    await app.close();
  });

  describe(ProfileController.prototype.getUser.name, () => {
    it('should return UNAUTHORIZED status if no session cookie', async () => {
      await request(app.getHttpServer())
        .get('/profile')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return OK status if request succeeds', async () => {
      await request(app.getHttpServer())
        .get('/profile')
        .set('cookie', sessionCookie)
        .expect(HttpStatus.OK);
    });

    it('should return the expected user DTO', async () => {
      await request(app.getHttpServer())
        .get('/profile')
        .set('cookie', sessionCookie)
        .expect(({ body }) => {
          expect(body).toEqual(userDto);
        });
    });
  });
});
