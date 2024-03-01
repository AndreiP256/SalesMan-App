import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { UserRole } from '@prisma/client';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/role.decorator';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header

    if (!token) {
      return false; // If there's no token, deny the request
    }

    let userRole: UserRole;
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as { role: UserRole }; // Verify and decode the token with the proper type
      userRole = decodedToken.role; // Get the user's role from the decoded token
    } catch (error) {
      return false; // If the token can't be verified, deny the request
    }

    return requiredRoles.includes(userRole); // Check if the user's role is in the list of required roles
  }
}