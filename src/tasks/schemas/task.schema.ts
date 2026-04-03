import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TaskPriority } from 'src/common/enums/task-priority.enum';
import { TaskStatus } from 'src/common/enums/task-status.enum';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.Todo })
  status: TaskStatus;

  @Prop({
    type: String,
    enum: TaskPriority,
    default: TaskPriority.Medium,
  })
  priority: TaskPriority;

  @Prop()
  dueDate?: Date;

  //    Relationship to the User who is assigned the task
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  assigneeId?: Types.ObjectId;

  //   Relationship to the Team the task belongs to
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  teamId: Types.ObjectId;

  //   File Uploads
  @Prop({ type: Array, default: [] })
  attachments: any[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
