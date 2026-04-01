import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { TeamRole } from 'src/common/enums/team-role.enum';

// Define a sub-document for the members array
@Schema({ _id: false }) //Prevents Mongoose from generting a separate _id
export class TeamMember {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    enum: TeamRole,
    default: TeamRole.Member,
  })
  role: TeamMember;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);

// Main team schema

@Schema({ timestamps: true })
export class Team extends Document {
  @Prop({
    required: true,
  })
  name: string;

  @Prop()
  description?: string;

  @Prop({
    type: [TeamMemberSchema],
    default: [],
  })
  member: TeamMember[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
