import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUserRole = request?.user?.role;

    const allowedRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (allowedRoles.includes(currentUserRole)) return true;

    return false;
  }
}
