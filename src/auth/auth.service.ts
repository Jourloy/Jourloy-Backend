import {HttpException, Injectable, Logger} from "@nestjs/common";
import {UserService} from "../user/user.service";
import jwt from "jsonwebtoken";
import {IGoogleUser} from "../../types";
import * as process from "process";
import {ObjectId} from "mongodb";

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) {}

	private logger = new Logger(AuthService.name);

	private generateTokens(id: string | ObjectId, type: `google` | `local`) {
		const refresh = jwt.sign({id: id, type: type}, process.env.SECRET, {
			expiresIn: `1w`,
		});
		const access = jwt.sign({id: id, type: type}, process.env.SECRET, {
			expiresIn: `3d`,
		});
		return [refresh, access];
	}

	public async updateTokens(refresh: string) {
		let decoded: string | jwt.JwtPayload;
		try {
			decoded = jwt.verify(refresh, process.env.SECRET);
		} catch (e) {
			throw new HttpException(`REFRESH_TOKEN_NOT_VALID`, 401);
		}

		const props: {googleID?: string; _id?: string} = {};
		if (decoded[`type`] === `google`) props.googleID = decoded[`id`];
		if (decoded[`type`] === `local`) props._id = decoded[`id`];

		const user = await this.userService.get({...props});
		if (!user) throw new HttpException(`USER_NOT_FOUND`, 404);

		if (!user.refreshTokens.includes(refresh)) {
			throw new HttpException(`REFRESH_TOKEN_NOT_VALID`, 401);
		}

		const [newRefresh, newAccess] = this.generateTokens(
			decoded[`id`],
			decoded[`type`]
		);

		const updatedUser = await this.userService.updateTokens(user.id, newRefresh);

		delete user.password;
		delete user.refreshTokens;
		delete user.googleID;

		return {refresh: newRefresh, access: newAccess, user: updatedUser};
	}

	public async loginGoogle(props: IGoogleUser) {
		const user = await this.userService.loginGoogle(props);

		const [newRefresh, newAccess] = this.generateTokens(props.googleId, `google`);
		const updatedUser = await this.userService.updateTokens(user._id, newRefresh);

		delete user.password;
		delete user.refreshTokens;
		delete user.googleID;

		return {refresh: newRefresh, access: newAccess, user: updatedUser};
	}

	public async apiLogin(apiKey?: string) {
		if (!apiKey) throw new HttpException(`FORBIDDEN`, 403);

		const user = await this.userService.get({apiKey: apiKey});
		if (!user) throw new HttpException(`USER_NOT_FOUND`, 404);

		const [newRefresh, newAccess] = this.generateTokens(user._id, `local`);
		const updatedUser = await this.userService.updateTokens(user._id, newRefresh);

		delete user.password;
		delete user.refreshTokens;
		delete user.googleID;

		return {refresh: newRefresh, access: newAccess, user: updatedUser};
	}
}
