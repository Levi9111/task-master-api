import { SetMetadata } from '@nestjs/common';
import { TeamRole } from '../enums/team-role.enum';

export const TEAM_ROLES_KEY = 'teamRoles';

// Attaches required team-level roles to a route
export const TeamRoles = (...roles: TeamRole[]) =>
  SetMetadata(TEAM_ROLES_KEY, roles);
