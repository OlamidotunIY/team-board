import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ enum: TaskStatus, default: TaskStatus.TODO, index: true })
  status!: TaskStatus;

  @Prop({ enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority!: TaskPriority;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true, index: true })
  projectId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  assigneeId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  createdById!: Types.ObjectId;

  @Prop()
  dueDate?: Date;
}

export type TaskDocument = HydratedDocument<Task>;
export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.set('toJSON', { virtuals: true });
TaskSchema.set('toObject', { virtuals: true });
