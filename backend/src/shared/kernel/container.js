import UserModel from '../../infrastructure/models/user-model.js';
import FileModel from '../../infrastructure/models/file-model.js';
import { UserRepository } from '../../infrastructure/repositories/user-repository.js';
import { FileRepository } from '../../infrastructure/repositories/file-repository.js';
import { AuthController } from '../../infrastructure/controllers/auth-controller.js';
import { UserController } from '../../infrastructure/controllers/user-controller.js';
import { FileController } from '../../infrastructure/controllers/file-controller.js';
import { LoginUseCase } from '../../application/use-cases/auth/login-use-case.js';
import { RegisterUseCase } from '../../application/use-cases/auth/register-use-case.js';
import { VerifyEmailUseCase } from '../../application/use-cases/auth/verify-email-use-case.js';
import { GetUsersUseCase } from '../../application/use-cases/users/get-users-use-case.js';
import { CreateUserUseCase } from '../../application/use-cases/users/create-user-use-case.js';
import { UpdateUserUseCase } from '../../application/use-cases/users/update-user-use-case.js';
import { DeleteUserUseCase } from '../../application/use-cases/users/delete-user-use-case.js';
import { GetUserStatsUseCase } from '../../application/use-cases/users/get-user-stats-use-case.js';
import { UploadFileUseCase } from '../../application/use-cases/files/upload-file-use-case.js';
import { GetFilesUseCase } from '../../application/use-cases/files/get-files-use-case.js';
import { GetFileUseCase } from '../../application/use-cases/files/get-file-use-case.js';
import { UpdateFileUseCase } from '../../application/use-cases/files/update-file-use-case.js';
import { DeleteFileUseCase } from '../../application/use-cases/files/delete-file-use-case.js';
import { AuthService } from '../services/auth-service.js';
import { EmailService } from '../services/email-service.js';
import { TokenService } from '../services/token-service.js';
import { FileStorageService } from '../services/file-storage-service.js';

/**
 * Dependency Injection Container
 * Manages the creation and wiring of all dependencies
 */
class Container {
  constructor() {
    this.instances = new Map();
  }

  // Singleton pattern for services
  getUserRepository() {
    if (!this.instances.has('userRepository')) {
      this.instances.set('userRepository', new UserRepository(UserModel));
    }
    return this.instances.get('userRepository');
  }

  getFileRepository() {
    if (!this.instances.has('fileRepository')) {
      this.instances.set('fileRepository', new FileRepository(FileModel));
    }
    return this.instances.get('fileRepository');
  }

  getAuthService() {
    if (!this.instances.has('authService')) {
      this.instances.set('authService', new AuthService());
    }
    return this.instances.get('authService');
  }

  getEmailService() {
    if (!this.instances.has('emailService')) {
      this.instances.set('emailService', new EmailService());
    }
    return this.instances.get('emailService');
  }

  getTokenService() {
    if (!this.instances.has('tokenService')) {
      this.instances.set('tokenService', new TokenService());
    }
    return this.instances.get('tokenService');
  }

  getFileStorageService() {
    if (!this.instances.has('fileStorageService')) {
      this.instances.set('fileStorageService', new FileStorageService());
    }
    return this.instances.get('fileStorageService');
  }

  // Use cases
  getLoginUseCase() {
    return new LoginUseCase(
      this.getUserRepository(),
      this.getAuthService(),
      this.getTokenService()
    );
  }

  getRegisterUseCase() {
    return new RegisterUseCase(
      this.getUserRepository(),
      this.getAuthService(),
      this.getEmailService(),
      this.getTokenService()
    );
  }

  getVerifyEmailUseCase() {
    return new VerifyEmailUseCase(
      this.getUserRepository()
    );
  }

  // User use cases
  getGetUsersUseCase() {
    return new GetUsersUseCase(this.getUserRepository());
  }

  getCreateUserUseCase() {
    return new CreateUserUseCase(
      this.getUserRepository(),
      this.getAuthService(),
      this.getEmailService(),
      this.getTokenService()
    );
  }

  getUpdateUserUseCase() {
    return new UpdateUserUseCase(this.getUserRepository());
  }

  getDeleteUserUseCase() {
    return new DeleteUserUseCase(this.getUserRepository());
  }

  getGetUserStatsUseCase() {
    return new GetUserStatsUseCase(this.getUserRepository());
  }

  // File use cases
  getUploadFileUseCase() {
    return new UploadFileUseCase(
      this.getFileRepository(),
      this.getFileStorageService()
    );
  }

  getGetFilesUseCase() {
    return new GetFilesUseCase(this.getFileRepository());
  }

  getGetFileUseCase() {
    return new GetFileUseCase(this.getFileRepository());
  }

  getUpdateFileUseCase() {
    return new UpdateFileUseCase(this.getFileRepository());
  }

  getDeleteFileUseCase() {
    return new DeleteFileUseCase(
      this.getFileRepository(),
      this.getFileStorageService()
    );
  }

  // Controllers
  getAuthController() {
    return new AuthController(
      this.getLoginUseCase(),
      this.getRegisterUseCase(),
      this.getVerifyEmailUseCase()
    );
  }

  getUserController() {
    return new UserController(
      this.getGetUsersUseCase(),
      this.getCreateUserUseCase(),
      this.getUpdateUserUseCase(),
      this.getDeleteUserUseCase(),
      this.getGetUserStatsUseCase()
    );
  }

  getFileController() {
    return new FileController(
      this.getUploadFileUseCase(),
      this.getGetFilesUseCase(),
      this.getGetFileUseCase(),
      this.getUpdateFileUseCase(),
      this.getDeleteFileUseCase()
    );
  }
}

// Export singleton instance
export const container = new Container();
