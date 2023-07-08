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
import {ApiGuard} from "src/guards/api.guard";
import {JwtGuard} from "../guards/jwt.guard";

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
		response.cookie(`authorization_refresh`, `${state.refresh}`, {
			httpOnly: true,
			domain: `.twyxify.${process.env.DOMAIN_NAME}`,
			secure: true,
			maxAge: 1000 * 60 * 60 * 24,
		});
		response.cookie(`authorization`, `${state.access}`, {
			httpOnly: true,
			domain: `.twyxify.${process.env.DOMAIN_NAME}`,
			secure: true,
			maxAge: 1000 * 60 * 60 * 24,
		});
		session.user = state.user;

		response.redirect(
			`https://tracker.twyxify.${process.env.DOMAIN_NAME}/login/check?success=true`
		);
	}

	@Get(`/google`)
	@UseGuards(AuthGuard(`google`))
	@ApiOperation({summary: `Redirect to google auth`})
	async googleAuth() {
		this.logger.debug(`Google redirect`);
	}

	@Get(`/api-login`)
	@UseGuards(ApiGuard)
	@ApiOperation({summary: `Login via api token`})
	async apiLogin(@Headers() headers, @Res() response: Response) {
		const state = await this.authService.apiLogin(headers[`api_key`]);
		response.cookie(`authorization_refresh`, `${state.refresh}`, {
			httpOnly: true,
			domain: `.twyxify.${process.env.DOMAIN_NAME}`,
			maxAge: 1000 * 60 * 60 * 24,
		});
		response.cookie(`authorization`, `${state.access}`, {
			httpOnly: true,
			domain: `.twyxify.${process.env.DOMAIN_NAME}`,
			maxAge: 1000 * 60 * 60 * 24,
		});
		response.status(200).send(`OK`);
	}

	@Get(`/tokens`)
	@ApiOperation({summary: `Update tokens`})
	@UseGuards(JwtGuard)
	async updateTokens(@Headers() headers, @Res() response: Response) {
		const state = await this.authService.updateTokens(headers[`refresh`]);
		response.cookie(`authorization_refresh`, `${state.refresh}`, {
			httpOnly: true,
			domain: `.twyxify.${process.env.DOMAIN_NAME}`,
			maxAge: 1000 * 60 * 60 * 24,
		});
		response.cookie(`authorization`, `${state.access}`, {
			httpOnly: true,
			domain: `.twyxify.${process.env.DOMAIN_NAME}`,
			maxAge: 1000 * 60 * 60 * 24,
		});
		response.status(200).send(`OK`);
	}
}
