import type { Provider } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { config } from '@configs';
import {
  refreshTokenRepository,
  taskRepository,
  userRepository,
} from '@repositories';
import {
  AuthService,
  EmailService,
  NotepadService,
  OAuthService,
  TaskService,
} from '@services';
import type {
  RefreshTokenRepository,
  TaskRepository,
  UserRepository,
} from '@repositories/interfaces';
import {
  NEST_GOOGLE_OAUTH_CLIENT,
  NEST_REFRESH_TOKEN_REPOSITORY,
  NEST_TASK_REPOSITORY,
  NEST_USER_REPOSITORY,
} from './provider-tokens';

/**
 * Репозитории подключаются к Nest как готовые экземпляры из существующей
 * фабрики `@repositories`. Это сохраняет текущее переключение `DB_TYPE` и не
 * заставляет сами репозитории знать о Nest.
 */
export const nestRepositoryProviders: Provider[] = [
  {
    provide: NEST_TASK_REPOSITORY,
    useValue: taskRepository,
  },
  {
    provide: NEST_USER_REPOSITORY,
    useValue: userRepository,
  },
  {
    provide: NEST_REFRESH_TOKEN_REPOSITORY,
    useValue: refreshTokenRepository,
  },
];

/**
 * Сервисные providers собирают уже существующие framework-independent сервисы.
 * Конструкторы сервисов остаются обычными TypeScript-конструкторами без
 * `@Injectable()`, поэтому Express/HTTP adapters продолжают работать как раньше.
 */
export const nestServiceProviders: Provider[] = [
  {
    provide: TaskService,
    inject: [NEST_TASK_REPOSITORY],
    useFactory: (repository: TaskRepository) => new TaskService(repository),
  },
  {
    provide: NotepadService,
    inject: [NEST_TASK_REPOSITORY],
    useFactory: (repository: TaskRepository) => new NotepadService(repository),
  },
  {
    provide: NEST_GOOGLE_OAUTH_CLIENT,
    useFactory: () => new OAuth2Client(config.googleClientId),
  },
  {
    provide: OAuthService,
    inject: [NEST_GOOGLE_OAUTH_CLIENT],
    useFactory: (client: OAuth2Client) => new OAuthService(client),
  },
  {
    provide: EmailService,
    useFactory: () => new EmailService(),
  },
  {
    provide: AuthService,
    inject: [
      NEST_USER_REPOSITORY,
      NEST_REFRESH_TOKEN_REPOSITORY,
      EmailService,
      OAuthService,
    ],
    useFactory: (
      userRepo: UserRepository,
      tokenRepo: RefreshTokenRepository,
      emailService: EmailService,
      oauthService: OAuthService,
    ) => new AuthService(userRepo, tokenRepo, emailService, oauthService),
  },
];

/**
 * Единый список providers для корневого Nest-модуля.
 */
export const nestProviders: Provider[] = [
  ...nestRepositoryProviders,
  ...nestServiceProviders,
];
