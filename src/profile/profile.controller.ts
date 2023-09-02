import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { SessionGuard } from 'src/auth/session/guard/session.guard';
import { LogService } from 'src/log/log.service';
import { UserService } from 'src/auth/user/service/user.service';
import { UserMapper } from 'src/auth/user/mapper/user.mapper';
import { UserDto } from 'src/auth/user/dto/user.dto';
import { AuthRequest } from 'src/auth/auth-request.dto';

@UseGuards(SessionGuard)
@Controller('/profile')
export class ProfileController {
  constructor(
    private readonly LOGGER: LogService,
    private readonly USER_SVC: UserService,
    private readonly USER_MAP: UserMapper
  ) {
    this.LOGGER.setContext(ProfileController.name);
  }

  /**
   * Gets the user of the current session.
   *
   * @param req An authorized request.
   * @returns A user DTO.
   */
  @Get()
  async getUser(@Req() req: AuthRequest): Promise<UserDto> {
    const id = req.user.sub;
    this.LOGGER.log(`Get user for user id ${id}.`);
    const user = await this.USER_SVC.findOne({ where: { id } });
    return this.USER_MAP.userToDto(user);
  }
}
