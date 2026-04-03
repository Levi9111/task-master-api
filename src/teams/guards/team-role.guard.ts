import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TeamsService } from '../teams.service';
import { TeamRole } from 'src/common/enums/team-role.enum';
import { TEAM_ROLES_KEY } from 'src/common/decorators/team-roles.decorator';

@Injectable()
export class TeamRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private teamsService: TeamsService, // We inject the service to query the DB
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<TeamRole[]>(
      TEAM_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true; // No specific team roles required

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const teamId = request.params.id;

    if (!teamId) {
      throw new ForbiddenException(
        'Team Id is required to evaluate permissions',
      );
    }

    // 1. Fetch the team
    const team = await this.teamsService.findById(teamId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // 2. Find the user in the members array
    const memberRecord = team.members.find(
      (m) => m.userId.toString() === user.userId.toString(),
    );

    if (!memberRecord) {
      throw new ForbiddenException('You are not a member of this team');
    }

    // Check if the role matches the requirement
    const hasRole = requiredRoles.includes(memberRecord.role);

    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have the required permissions in this team',
      );
    }

    // Optional but helpful:
    // Attach the fetched team to the request so the controller doesn't have to query the database a second time!
    request.team = team;
    return true;
  }
}
