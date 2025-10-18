import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // si no se requiere rol, dejamos pasar
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('Usuario en guard:', user);

    if (!user || !requiredRoles.includes(user.rol)) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    return true;
  }
}
