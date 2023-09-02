import { Module } from '@nestjs/common';
import { LogModule } from 'src/log/log.module';
import { AuthSessionModule } from 'src/auth/session/auth-session.module';
import { ProfileController } from './profile.controller';

@Module({
  imports: [LogModule, AuthSessionModule],
  controllers: [ProfileController]
})
export class ProfileModule {}
