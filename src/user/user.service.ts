import {HttpException, Injectable, Logger} from "@nestjs/common";
import crypto from "crypto";
import {IGoogleUser, IUser} from "../../types";
import {PrismaService} from "src/database/prisma.service";
import {Prisma} from "@prisma/client";
import {ERR} from "src/enums/error.enum";

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {
		this._checkAdmin().then(data => this.logger.debug(data));
	}

	private readonly logger = new Logger(UserService.name);

	public async get(query?: Prisma.UserWhereInput, isAdmin?: boolean) {
		const user = await this.prisma.user.findFirst({where: query});

		if (!user) return null;
		if (!isAdmin) {
			delete user.password;
			delete user.refreshTokens;
			delete user.role;
			delete user.apiKey;
		}

		return user;
	}

	public async loginGoogle(props: IGoogleUser) {
		const user = await this.get({googleId: props.googleId});
		if (!user) return await this.createGoogleUser(props, `user`);
		return user;
	}

	public async login(props: IUser) {
		const user = await this.get(
			{lowercaseUsername: props.username.toLowerCase()},
			true
		);
		if (!user) return ERR.USER_NOT_FOUND;

		const password = crypto.createHash(`sha256`).update(props.password).digest(`hex`);
		if (password !== user.password) return ERR.INCORRECT_PASSWORD;

		return user;
	}

	public async createCustomUser(props: IUser, role: `user` | `admin`) {
		const user = await this.get({username: props.username}, true);
		if (user) return ERR.USER_EXIST;

		const created = await this.prisma.user.create({
			data: {
				username: props.username,
				lowercaseUsername: props.username.toLocaleLowerCase(),
				password: crypto
					.createHash(`sha256`)
					.update(props.password)
					.digest(`hex`),
				avatar: `https://avatars.dicebear.com/api/identicon/${props.username}.svg`,
				role: role,
				refreshTokens: [],
			},
		});

		if (!created) return ERR.DATABASE;
		return created;
	}

	public async createGoogleUser(props: IGoogleUser, role: `user` | `admin`) {
		const user = await this.get({googleId: props.googleId});
		if (user) return ERR.USER_EXIST;

		const created = await this.prisma.user.create({
			data: {
				username: props.displayName,
				lowercaseUsername: props.displayName.toLocaleLowerCase(),
				googleId: props.googleId,
				avatar: props.photo,
				role: role,
				refreshTokens: [],
			},
		});

		if (!created) return ERR.DATABASE;
		return created;
	}

	public async updateTokens(id: number, token: string) {
		const user = await this.get({id: id});
		if (!user) return ERR.USER_NOT_FOUND;

		if (user.refreshTokens) {
			if (user.refreshTokens.length >= 10) user.refreshTokens.shift();
			user.refreshTokens.push(token);
		} else user.refreshTokens = [token];

		return await this.updateUser({id: user.id}, user);
	}

	private async _checkAdmin() {
		const username = process.env.ADMIN_USERNAME;
		const password = process.env.ADMIN_PASSWORD;

		const user = await this.get({lowercaseUsername: username.toLowerCase()});
		if (user) return `✅ Admin exist`;

		const created = await this.createCustomUser(
			{username: username, password: password},
			`admin`
		);

		if (!created) return `❌ Admin are not created`;
		return `✅ Admin created`;
	}

	private async updateUser(
		where: Prisma.UserWhereUniqueInput,
		data: Prisma.UserUpdateInput
	) {
		const updated = await this.prisma.user.update({where, data});

		if (!updated) return ERR.DATABASE;
		return updated;
	}
}
