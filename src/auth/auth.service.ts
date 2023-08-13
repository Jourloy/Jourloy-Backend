import {Injectable, Logger} from "@nestjs/common";
import {UserService} from "../user/user.service";
import jwt from "jsonwebtoken";
import {IGoogleUser} from "../../types";
import * as process from "process";
import {ERR} from "src/enums/error.enum";

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) {}

	private logger = new Logger(AuthService.name);

	private generateTokens(id: string | number, type: `google` | `local`) {
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
			return ERR.REFRESH_TOKEN_NOT_VALID;
		}

		const props: {googleId?: string; id?: number} = {};
		if (decoded[`type`] === `google`) props.googleId = decoded[`id`];
		if (decoded[`type`] === `local`) props.id = +decoded[`id`];

		const user = await this.userService.get({...props});
		if (!user) return ERR.USER_NOT_FOUND;

		if (!user.refreshTokens.includes(refresh)) return ERR.REFRESH_TOKEN_NOT_VALID;

		const [newRefresh, newAccess] = this.generateTokens(
			decoded[`id`],
			decoded[`type`]
		);

		const updatedUser = await this.userService.updateTokens(user.id, newRefresh);

		delete user.password;
		delete user.refreshTokens;
		delete user.googleId;

		return {refresh: newRefresh, access: newAccess, user: updatedUser};
	}

	public async loginGoogle(props: IGoogleUser) {
		const user = await this.userService.loginGoogle(props);
		if (user === ERR.DATABASE || user === ERR.USER_EXIST) return user;

		const [newRefresh, newAccess] = this.generateTokens(props.googleId, `google`);
		const updatedUser = await this.userService.updateTokens(user.id, newRefresh);
		if (updatedUser === ERR.DATABASE || updatedUser === ERR.USER_NOT_FOUND) return updatedUser;

		delete user.password;
		delete user.refreshTokens;
		delete user.googleId;

		return {refresh: newRefresh, access: newAccess, user: updatedUser};
	}

	public async apiLogin(apiKey?: string) {
		if (!apiKey) return ERR.FORBIDDEN;

		const user = await this.userService.get({apiKey: apiKey});
		if (!user) return ERR.USER_NOT_FOUND;

		const [newRefresh, newAccess] = this.generateTokens(user.id, `local`);
		const updatedUser = await this.userService.updateTokens(user.id, newRefresh);

		delete user.password;
		delete user.refreshTokens;
		delete user.googleId;

		return {refresh: newRefresh, access: newAccess, user: updatedUser};
	}
}
