import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamService: TeamsService) {}

  //   Here we don't need the @UseGuards(JwtAuthGuard), because we make it global
  //   This route is automatically protected
  @Post()
  async createTeam(@Request() req, @Body() createTeamDto: CreateTeamDto) {
    const userId = req.user.userId;
    return this.teamService.create(createTeamDto, userId);
  }

  @Get()
  async getMyTeams(@Request() req) {
    return this.teamService.getUserTeams(req.user.userId);
  }
}
