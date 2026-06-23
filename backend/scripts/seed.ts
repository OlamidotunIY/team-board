import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import {
  ProjectStatus,
  ProjectVisibility,
} from '../src/project/schema/project.schema';
import { TaskPriority, TaskStatus } from '../src/task/schema/task.schema';
import { UserRole, UserSchema } from '../src/user/schema/user.schema';
import { ProjectSchema } from '../src/project/schema/project.schema';
import { TaskSchema } from '../src/task/schema/task.schema';

const mongoUri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/teamboard';

async function seed() {
  await mongoose.connect(mongoUri);

  const User = mongoose.model('User', UserSchema);
  const Project = mongoose.model('Project', ProjectSchema);
  const Task = mongoose.model('Task', TaskSchema);

  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Task.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash('Password123!', 12);
  const [admin, member] = await User.create([
    {
      name: 'Ada Lovelace',
      email: 'ada@teamboard.local',
      passwordHash,
      role: UserRole.ADMIN,
      jobTitle: 'Engineering Manager',
      timezone: 'Africa/Lagos',
      isEmailVerified: true,
    },
    {
      name: 'Grace Hopper',
      email: 'grace@teamboard.local',
      passwordHash,
      role: UserRole.MEMBER,
      jobTitle: 'Product Engineer',
      timezone: 'UTC',
      isEmailVerified: true,
    },
  ]);

  const [platformProject, mobileProject] = await Project.create([
    {
      name: 'Platform Stabilization',
      description: 'Hardening the TeamBoard backend foundation.',
      status: ProjectStatus.ACTIVE,
      visibility: ProjectVisibility.TEAM,
      color: '#2563eb',
      tags: ['backend', 'ops'],
      ownerId: admin._id,
      memberIds: [member._id],
      startDate: new Date('2026-06-01'),
      dueDate: new Date('2026-07-15'),
      progress: 35,
    },
    {
      name: 'Mobile Board Experience',
      description: 'Preparing task board APIs for a mobile client.',
      status: ProjectStatus.PLANNING,
      visibility: ProjectVisibility.PRIVATE,
      color: '#16a34a',
      tags: ['frontend', 'mobile'],
      ownerId: member._id,
      memberIds: [admin._id],
      startDate: new Date('2026-07-01'),
      dueDate: new Date('2026-08-01'),
      progress: 10,
    },
  ]);

  const tasks = await Task.create([
    {
      title: 'Document service boundaries',
      description: 'Capture the modular-monolith to microservices path.',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      projectId: platformProject._id,
      assigneeId: admin._id,
      reporterId: admin._id,
      watcherIds: [member._id],
      createdById: admin._id,
      labels: ['architecture', 'docs'],
      estimateMinutes: 180,
      order: 1,
      dueDate: new Date('2026-06-30'),
    },
    {
      title: 'Add task lifecycle messaging',
      description: 'Publish and consume task events through RabbitMQ.',
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      projectId: platformProject._id,
      assigneeId: member._id,
      reporterId: admin._id,
      watcherIds: [admin._id],
      createdById: admin._id,
      labels: ['rabbitmq'],
      estimateMinutes: 240,
      order: 2,
      completedAt: new Date('2026-06-22'),
    },
    {
      title: 'Write auth resolver tests',
      description: 'Cover login, register, refresh, and current-user flows.',
      status: TaskStatus.IN_REVIEW,
      priority: TaskPriority.HIGH,
      projectId: platformProject._id,
      assigneeId: admin._id,
      reporterId: member._id,
      watcherIds: [member._id],
      createdById: member._id,
      labels: ['auth', 'testing'],
      estimateMinutes: 150,
      order: 3,
      dueDate: new Date('2026-07-02'),
    },
    {
      title: 'Seed realistic board data',
      description: 'Make sure both seeded users have assigned and reported tasks.',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      projectId: platformProject._id,
      assigneeId: member._id,
      reporterId: admin._id,
      watcherIds: [admin._id],
      createdById: admin._id,
      labels: ['seed', 'developer-experience'],
      estimateMinutes: 90,
      order: 4,
      dueDate: new Date('2026-07-05'),
    },
    {
      title: 'Design board filters',
      description: 'Define filters for assignee, status, priority, and labels.',
      status: TaskStatus.BACKLOG,
      priority: TaskPriority.LOW,
      projectId: mobileProject._id,
      assigneeId: member._id,
      reporterId: member._id,
      watcherIds: [admin._id],
      createdById: member._id,
      labels: ['ux'],
      estimateMinutes: 120,
      order: 1,
    },
    {
      title: 'Create mobile task detail payload',
      description: 'Confirm the fields the mobile app needs on the task detail screen.',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      projectId: mobileProject._id,
      assigneeId: admin._id,
      reporterId: member._id,
      watcherIds: [member._id],
      createdById: member._id,
      labels: ['api', 'mobile'],
      estimateMinutes: 210,
      order: 2,
      dueDate: new Date('2026-07-12'),
    },
    {
      title: 'Prototype drag ordering',
      description: 'Validate task ordering behavior before frontend implementation.',
      status: TaskStatus.BLOCKED,
      priority: TaskPriority.MEDIUM,
      projectId: mobileProject._id,
      assigneeId: member._id,
      reporterId: admin._id,
      watcherIds: [admin._id],
      createdById: admin._id,
      labels: ['board', 'ordering'],
      estimateMinutes: 180,
      order: 3,
      dueDate: new Date('2026-07-18'),
    },
  ]);

  console.log('Seed complete.');
  console.log(`Created ${2} users.`);
  console.log(`Created ${2} projects.`);
  console.log(`Created ${tasks.length} tasks.`);
  console.log(`Platform projectId: ${platformProject.id}`);
  console.log(`Mobile projectId: ${mobileProject.id}`);
  console.log('Login with ada@teamboard.local / Password123!');
  console.log('Login with grace@teamboard.local / Password123!');

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
