import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const CurrentUser = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const locals = context.switchToHttp().getResponse().locals;
		const id = locals.id;
		const type = locals.type;
		const role = locals.role;
		
		return {id: id, type: type, access: locals.access, refresh: locals.refresh, role: role};
	}
);

export type ICurrentUser = {
	access: string;
	refresh: string;
	role: string;
} & ({
	type: `google`;
	id: string;
} | {
	type: `local`;
	id: string;
})