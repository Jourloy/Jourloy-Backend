/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
	Controller,
	Get,
	Req,
	Res,
	UseGuards,
	Headers,
	Logger,
	Session,
} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthGuard} from "@nestjs/passport";
import {ApiExcludeEndpoint, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Request, Response} from "express";

@ApiTags(`Auth`)
@Controller(`auth`)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	private logger = new Logger(AuthController.name);

	@Get(`/google/callback`)
	@UseGuards(AuthGuard(`google`))
	@ApiExcludeEndpoint()
	async googleAuthCallback(
		@Req() request: Request,
		@Res() response: Response,
		@Session() session: Record<string, any>
	) {
		const state = await this.authService.loginGoogle({
			// @ts-ignore
			googleId: request.user.googleId,
			// @ts-ignore
			photo: request.user.photos[0].value,
			// @ts-ignore
			displayName: request.user.displayName,
		});
		response.setHeader(`authorization`, `Bearer ${state.refresh}`);
		response.cookie(`access`, state.access, {
			httpOnly: true,
			domain: `jourloy.com`,
			maxAge: 1000 * 60 * 60 * 24,
		});
		session.user = state.user;
		response.redirect(`https://dev.jourloy.com/login/check?success=true`);
	}

	@Get(`/google`)
	@UseGuards(AuthGuard(`google`))
	@ApiOperation({summary: `Redirect to google auth`})
	async googleAuth() {
		this.logger.debug(`Google redirect`);
	}

	@Get(`/tokens`)
	@ApiOperation({summary: `Update tokens`})
	async updateTokens(@Headers() headers, @Res() response: Response) {
		const state = await this.authService.updateTokens(headers[`refresh`]);
		response.header(`refresh`, state.refresh);
		response.cookie(`access`, state.access, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24,
		});
		response.status(200).send(`OK`);
	}
}
