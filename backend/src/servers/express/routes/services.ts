import { OAuth2Client } from 'google-auth-library';
import {
  NotepadService,
  TaskService,
  AuthService,
  EmailService,
} from '@services';
import { OAuthService } from '@services/OAuthService';
import {
  refreshTokenRepository,
  taskRepository,
  userRepository,
} from '@repositories';
import { config } from '@configs';

const oauthClient = new OAuth2Client(config.googleClientId);
const oauthService = new OAuthService(oauthClient);
const emailService = new EmailService();

export const authService = new AuthService(
  userRepository,
  refreshTokenRepository,
  emailService,
  oauthService,
);

export const taskService = new TaskService(taskRepository);
export const notepadService = new NotepadService(taskRepository);
