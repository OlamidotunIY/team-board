export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: unknown; output: unknown; }
};

export type CreateProjectDto = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  memberIds?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ProjectStatus>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  visibility?: InputMaybe<ProjectVisibility>;
};

export type CreateTaskDto = {
  assigneeId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  estimateMinutes?: InputMaybe<Scalars['Float']['input']>;
  labels?: InputMaybe<Array<Scalars['String']['input']>>;
  order?: InputMaybe<Scalars['Float']['input']>;
  parentTaskId?: InputMaybe<Scalars['ID']['input']>;
  priority?: InputMaybe<TaskPriority>;
  projectId: Scalars['ID']['input'];
  reporterId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<TaskStatus>;
  title: Scalars['String']['input'];
  watcherIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type LoginDto = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String']['output'];
  user?: Maybe<UserEntity>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createProject: ProjectEntity;
  createTask: TaskEntity;
  deleteProject: Scalars['Boolean']['output'];
  deleteTask: Scalars['Boolean']['output'];
  login: LoginResponse;
  logout: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  register: RegisterResponse;
  updateCurrentUser?: Maybe<UserEntity>;
  updateProject: ProjectEntity;
  updateTask: TaskEntity;
};


export type MutationCreateProjectArgs = {
  projectInput: CreateProjectDto;
};


export type MutationCreateTaskArgs = {
  taskInput: CreateTaskDto;
};


export type MutationDeleteProjectArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  loginInput: LoginDto;
};


export type MutationRegisterArgs = {
  registerInput: RegisterDto;
};


export type MutationUpdateCurrentUserArgs = {
  userInput: UpdateUserDto;
};


export type MutationUpdateProjectArgs = {
  projectInput: UpdateProjectDto;
};


export type MutationUpdateTaskArgs = {
  taskInput: UpdateTaskDto;
};

export type ProjectEntity = {
  __typename?: 'ProjectEntity';
  color: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  memberIds: Array<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  ownerId: Scalars['ID']['output'];
  progress: Scalars['Float']['output'];
  startDate?: Maybe<Scalars['DateTime']['output']>;
  status: ProjectStatus;
  tags: Array<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  visibility: ProjectVisibility;
};

export enum ProjectStatus {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED',
  Completed = 'COMPLETED',
  OnHold = 'ON_HOLD',
  Planning = 'PLANNING'
}

export enum ProjectVisibility {
  Private = 'PRIVATE',
  Team = 'TEAM'
}

export type Query = {
  __typename?: 'Query';
  currentUser: UserEntity;
  me: UserEntity;
  project: ProjectEntity;
  projects: Array<ProjectEntity>;
  task: TaskEntity;
  tasks: Array<TaskEntity>;
};


export type QueryProjectArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTaskArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTasksArgs = {
  projectId: Scalars['ID']['input'];
};

export type RegisterDto = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type RegisterResponse = {
  __typename?: 'RegisterResponse';
  accessToken: Scalars['String']['output'];
  user?: Maybe<UserEntity>;
};

export type TaskEntity = {
  __typename?: 'TaskEntity';
  assigneeId?: Maybe<Scalars['ID']['output']>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdById: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  estimateMinutes?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  labels: Array<Scalars['String']['output']>;
  order: Scalars['Float']['output'];
  parentTaskId?: Maybe<Scalars['ID']['output']>;
  priority: TaskPriority;
  projectId: Scalars['ID']['output'];
  reporterId: Scalars['ID']['output'];
  status: TaskStatus;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  watcherIds: Array<Scalars['ID']['output']>;
};

export enum TaskPriority {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export enum TaskStatus {
  Backlog = 'BACKLOG',
  Blocked = 'BLOCKED',
  Done = 'DONE',
  InProgress = 'IN_PROGRESS',
  InReview = 'IN_REVIEW',
  Todo = 'TODO'
}

export type UpdateProjectDto = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  memberIds?: InputMaybe<Array<Scalars['String']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  progress?: InputMaybe<Scalars['Float']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ProjectStatus>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  visibility?: InputMaybe<ProjectVisibility>;
};

export type UpdateTaskDto = {
  assigneeId?: InputMaybe<Scalars['ID']['input']>;
  completedAt?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  estimateMinutes?: InputMaybe<Scalars['Float']['input']>;
  id: Scalars['ID']['input'];
  labels?: InputMaybe<Array<Scalars['String']['input']>>;
  order?: InputMaybe<Scalars['Float']['input']>;
  parentTaskId?: InputMaybe<Scalars['ID']['input']>;
  priority?: InputMaybe<TaskPriority>;
  reporterId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<TaskStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
  watcherIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateUserDto = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  jobTitle?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type UserEntity = {
  __typename?: 'UserEntity';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  isEmailVerified: Scalars['Boolean']['output'];
  jobTitle?: Maybe<Scalars['String']['output']>;
  lastLoginAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  role: UserRole;
  timezone: Scalars['String']['output'];
};

export enum UserRole {
  Admin = 'ADMIN',
  Member = 'MEMBER'
}
