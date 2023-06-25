import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from "@nestjs/core";
import {UserService} from "../user/user.service";

@Injectable()
export class RoleGuard implements CanActivate {
	
	constructor(
		private reflector: Reflector,
		private userService: UserService
	) {}
	
	async canActivate(
		context: ExecutionContext
	): Promise<boolean> {
		const roles = this.reflector.get<string[]>(`roles`, context.getHandler());
		if (!roles) return true;

		const locals = context.switchToHttp().getResponse().locals;
		const id = locals.id;
		const type = locals.type;
		const props: {googleID?: string; _id?: string} = {};
		if (type === `google`) props.googleID = id;
		if (type === `local`) props._id = id;

		const user = await this.userService.get(props);
		if (!user || !user.role) return false;

		return roles.includes(user.role);
	}
}