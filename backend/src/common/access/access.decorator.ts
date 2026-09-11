import type { Role } from '@generated/prisma/enums';
import { SetMetadata } from '@nestjs/common';

type AccessRole = Role | 'public';

export const Access = (...roles: AccessRole[]) => SetMetadata('access', roles);
