import { RoleName, RoleRequired, User } from '../custom.js';

declare global {
  namespace Express {
    export interface Request {
      areRolesRequired: RoleRequired;
      user: User;
      requiredRolesList: RoleName[];
    }
  }
}
