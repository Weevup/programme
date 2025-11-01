import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@event-platform/types';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
