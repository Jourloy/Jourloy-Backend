import {Injectable, Logger} from "@nestjs/common";
import crypto from "crypto";
import {IGoogleUser, IUser} from "../../types";
import {ERR} from "src/enums/error.enum";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./schemas/user.schema";
import {FilterQuery, Model} from "mongoose";

@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private userModel: Model<User>) {
		this._checkAdmin().then(data => this.logger.debug(data));
	}

	private readonly logger = new Logger(UserService.name);

	public async get(query?: FilterQuery<UserDocument>, isAdmin?: boolean) {
		const user = await this.userModel.findOne({...query});

		if (!user) return null;
		if (!isAdmin) {
			delete user.systemAccount;
			delete user.googleAccount;
		}

		return user;
	}

	public async loginGoogle(props: IGoogleUser) {
		const user = await this.get({googleAccount: {googleID: props.googleId}});
		if (!user) return await this.createGoogleUser(props, `user`);
		return user;
	}

	public async login(props: IUser) {
		const user = await this.get({lowercaseUsername: props.username.toLowerCase()}, true);

		if (!user) return ERR.USER_NOT_FOUND;
		if (!user.systemAccount) return ERR.USER_NOT_FOUND;

		const password = crypto.createHash(`sha256`).update(props.password).digest(`hex`);
		if (password !== user.systemAccount.password) return ERR.INCORRECT_PASSWORD;

		return user;
	}

	public async createCustomUser(props: IUser, role: `user` | `admin`) {
		const user = await this.get({lowercaseUsername: props.username.toLocaleLowerCase()}, true);
		if (user) return ERR.USER_EXIST;

		const created = await this.userModel.create({
			username: props.username,
			lowercaseUsername: props.username.toLocaleLowerCase(),
			systemAccount: {
				password: crypto.createHash(`sha256`).update(props.password).digest(`hex`),
				apiKey: crypto.randomBytes(32).toString(`hex`),
			},
			avatar: `https://avatars.dicebear.com/api/identicon/${props.username}.svg`,
			role: role,
			refreshTokens: [],
		});

		if (!created) return ERR.DATABASE;
		return created;
	}

	public async createGoogleUser(props: IGoogleUser, role: `user` | `admin`) {
		const user = await this.get({googleId: props.googleId});
		if (user) return ERR.USER_EXIST;

		const created = await this.userModel.create({
			username: props.displayName,
			lowercaseUsername: props.displayName.toLocaleLowerCase(),
			googleAccount: {
				googleId: props.googleId,
			},
			avatar: props.photo,
			role: role,
			refreshTokens: [],
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

		const created = await this.createCustomUser({username: username, password: password}, `admin`);

		if (!created) return `❌ Admin are not created`;
		return `✅ Admin created`;
	}

	private async updateUser(where: FilterQuery<UserDocument>, data: Partial<User>) {
		const updated = await this.userModel.findOneAndUpdate(where, {$set: data});

		if (!updated) return ERR.DATABASE;
		return updated;
	}
}
