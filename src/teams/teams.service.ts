import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team } from './schemas/team.schema';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamRole } from 'src/common/enums/team-role.enum';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
  ) {}

  async create(createteamDto: CreateTeamDto, userId: string): Promise<Team> {
    const newTeam = new this.teamModel({
      ...createteamDto,
      members: [
        {
          userId,
          role: TeamRole.TeamLead,
        },
      ],
    });

    return newTeam.save();
  }

  async getUserTeams(userId: string): Promise<Team[]> {
    return this.teamModel
      .find({
        'members.userId': userId,
      })
      .exec();
  }
}
