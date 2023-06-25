import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const CurrentUser = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const locals = context.switchToHttp().getResponse().locals;
		const id = locals.id;
		const type = locals.type;
		
		return {id: id, type: type, access: locals.access};
	}
);

export interface ICurrentUser {
	id: string;
	type: string;
	access: string;
}