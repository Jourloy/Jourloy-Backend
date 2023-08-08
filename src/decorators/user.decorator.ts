import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const CurrentUser = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const locals = context.switchToHttp().getResponse().locals;
		const id = locals.id;
		const type = locals.type;
		
		return {id: id, type: type, access: locals.access, refresh: locals.refresh};
	}
);

export type ICurrentUser = {
	access: string;
	refresh: string;
} & ({
	type: `google`;
	id: string;
} | {
	type: `local`;
	id: number;
})