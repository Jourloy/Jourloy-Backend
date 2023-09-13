/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
	Controller,
	Get,
	Req,
	Res,
	UseGuards,
	Headers,
	Logger,
	HttpException,
} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthGuard} from "@nestjs/passport";
import {ApiExcludeEndpoint, ApiOperation, ApiTags} from "@nestjs/swagger";
import {CookieOptions, Request, Response} from "express";
import {ApiGuard} from "src/guards/api.guard";
import {JwtGuard} from "../guards/jwt.guard";
import {CurrentUser, ICurrentUser} from "src/decorators/user.decorator";
import {ERR} from "src/enums/error.enum";

@ApiTags(`Auth`)
@Controller(`auth`)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	private logger = new Logger(AuthController.name);

	private defaultCookieSettings: CookieOptions = {
		httpOnly: process.env.DEPLOYMENT_MODE === `local` ? false : true,
		domain:
			process.env.DEPLOYMENT_MODE === `local`
				? null
				: `.jourloy.${process.env.DOMAIN_NAME}`,
		secure: process.env.DEPLOYMENT_MODE === `local` ? false : true,
		sameSite: process.env.DEPLOYMENT_MODE === `local` ? `none` : `lax`,
		maxAge: 1000 * 60 * 60 * 24,
	};

	@Get(`/google/callback`)
	@UseGuards(AuthGuard(`google`))
	@ApiExcludeEndpoint()
	async googleAuthCallback(
		@Req() request: Request,
		@Res() response: Response,
	) {
		const state = await this.authService.loginGoogle({
			// @ts-ignore
			googleId: request.user.googleId,
			// @ts-ignore
			photo: request.user.photos[0].value,
			// @ts-ignore
			displayName: request.user.displayName,
		});

		if (state === ERR.DATABASE) throw new HttpException(ERR.DATABASE, 500);
		if (state === ERR.USER_EXIST) throw new HttpException(ERR.USER_EXIST, 400);
		if (state === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);

		response.cookie(`authorization_refresh`, `${state.refresh}`, this.defaultCookieSettings);
		response.cookie(`authorization`, `${state.access}`, this.defaultCookieSettings);

		const uri =
			process.env.DEPLOYMENT_MODE === `local`
				? `http://localhost:10000`
				: `https://jourloy.${process.env.DOMAIN_NAME}`;

		response.redirect(
			`${uri}/login/check?success=true&username=${state.user.username}&avatar=${state.user.avatar}`
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

		if (state === ERR.FORBIDDEN) throw new HttpException(ERR.FORBIDDEN, 401);
		if (state === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);

		response.cookie(`authorization_refresh`, `${state.refresh}`, this.defaultCookieSettings);
		response.cookie(`authorization`, `${state.access}`, this.defaultCookieSettings);

		response.status(200).send(`OK`);
	}

	@Get(`/tokens`)
	@ApiOperation({summary: `Update tokens`})
	@UseGuards(JwtGuard)
	async updateTokens(@CurrentUser() user: ICurrentUser, @Res() response: Response) {
		const state = await this.authService.updateTokens(user.refresh);

		if (state === ERR.REFRESH_TOKEN_NOT_VALID)
			throw new HttpException(ERR.REFRESH_TOKEN_NOT_VALID, 401);
		if (state === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 401);

		response.cookie(`authorization_refresh`, `${state.refresh}`, this.defaultCookieSettings);
		response.cookie(`authorization`, `${state.access}`, this.defaultCookieSettings);

		response.status(200).json(state);
	}

	@Get(`/logout`)
	@ApiOperation({summary: `Logout user`})
	@UseGuards(JwtGuard)
	async logout(@Res() response: Response) {
		response.cookie(`authorization_refresh`, `none`, {
			...this.defaultCookieSettings,
			maxAge: 1000,
		});
		response.cookie(`authorization`, `none`, {
			...this.defaultCookieSettings,
			maxAge: 1000,
		});

		response.status(200).json(`OK`);
	}
}
