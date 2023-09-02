import { INestApplication } from '@nestjs/common';
import { SignupDto } from 'src/auth/session/dto/signup.dto';
import { UserDto } from 'src/auth/user/dto/user.dto';
import request from 'supertest';

export const defaultSignupDto: SignupDto = {
  username: 'username',
  email: 'username@email.com',
  password: 'password'
};

/**
 * The return type of the {@link signup} function.
 */
export interface SignupResult {
  userDto: UserDto;
  sessionCookie: string;
}

/**
 * Registers a new user in the app. If no DTO is provided, uses {@link defaultSignupDto}.
 *
 * @param app {@link INestApplication}
 * @param dto {@link SignupDto} (optional)
 * @returns A {@link SignupResult}.
 */
export async function signup(
  app: INestApplication,
  dto: SignupDto = defaultSignupDto
): Promise<SignupResult> {
  const { body, headers } = await request(app.getHttpServer())
    .post('/auth/signup')
    .send(dto);

  const sessionCookie = headers['set-cookie'].find((cookie: string) =>
    cookie.startsWith('session_id')
  );

  return {
    userDto: body,
    sessionCookie
  };
}
