import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamRoles } from 'src/common/decorators/team-roles.decorator';
import { TeamRole } from 'src/common/enums/team-role.enum';
import { TeamRoleGuard } from './guards/team-role.guard';

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

  @Patch(':id')
  @TeamRoles(TeamRole.TeamLead) // Only TeamLeads can do this
  @UseGuards(TeamRoleGuard) // Apply the team-specific guard
  async updateTeam(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateTeamDto>,
  ) {
    return this.teamService.update(id, updateData);
  }
}
