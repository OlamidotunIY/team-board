import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export enum ProjectVisibility {
  PRIVATE = 'PRIVATE',
  TEAM = 'TEAM',
}

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ enum: ProjectStatus, default: ProjectStatus.ACTIVE, index: true })
  status!: ProjectStatus;

  @Prop({ enum: ProjectVisibility, default: ProjectVisibility.PRIVATE })
  visibility!: ProjectVisibility;

  @Prop({ trim: true, default: '#2563eb' })
  color!: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  ownerId!: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  memberIds!: Types.ObjectId[];

  @Prop()
  startDate?: Date;

  @Prop()
  dueDate?: Date;

  @Prop({ default: 0, min: 0, max: 100 })
  progress!: number;
}

export type ProjectDocument = HydratedDocument<Project>;
export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.set('toJSON', { virtuals: true });
ProjectSchema.set('toObject', { virtuals: true });
