import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from "@nestjs/core";

@Injectable()
export class RoleGuard implements CanActivate {
	
	constructor(
		private reflector: Reflector,
	) {}
	
	async canActivate(
		context: ExecutionContext
	): Promise<boolean> {
		const roles = this.reflector.get<string[]>(`roles`, context.getHandler());
		if (!roles) return true;

		const locals = context.switchToHttp().getResponse().locals;
		const role = locals.role;

		return roles.includes(role);
	}
}