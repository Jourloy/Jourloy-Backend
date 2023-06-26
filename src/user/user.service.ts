import {HttpException, Injectable, Logger} from "@nestjs/common";
import crypto from "crypto";
import {IGoogleUser, IUser} from "../../types";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./schemas/user.schema";
import {FilterQuery, Model} from "mongoose";
import {ObjectId} from "mongodb";

@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private userModel: Model<User>) {
		this._checkAdmin().then(data => this.logger.debug(data));
	}

	private readonly logger = new Logger(UserService.name);

	public async get(query?: FilterQuery<UserDocument>, isAdmin?: boolean) {
		const user = await this.userModel.findOne({...query});

		if (!user) return null;
		if (!isAdmin) delete user.password;

		return user;
	}

	public async loginGoogle(props: IGoogleUser) {
		const user = await this.get({googleID: props.googleId});
		if (!user) return await this.createGoogleUser(props, `user`);
		return user;
	}

	public async login(props: IUser) {
		const user = await this.get(
			{lowerCaseUsername: props.username.toLowerCase()},
			true
		);
		if (!user) throw new HttpException(`USER_NOT_FOUND`, 404);

		const password = crypto.createHash(`sha256`).update(props.password).digest(`hex`);
		if (password !== user.password) {
			throw new HttpException(`INCORRECT_PASSWORD`, 401);
		}

		return user;
	}

	public async createCustomUser(props: IUser, role: `user` | `admin`) {
		const user = await this.get({username: props.username}, true);
		if (user) throw new HttpException(`USER_EXIST`, 409);

		const created = await new this.userModel({
			username: props.username,
			lowerCaseUsername: props.username.toLowerCase(),
			password: crypto.createHash(`sha256`).update(props.password).digest(`hex`),
			avatar: `https://avatars.dicebear.com/api/identicon/${props.username}.svg`,
			role: role,
			refreshTokens: [],
			apiKey: process.env.API_KEY,
		}).save();

		if (!created) throw new HttpException(`DATABASE_ERROR`, 500);
		return created;
	}

	public async createGoogleUser(props: IGoogleUser, role: `user` | `admin`) {
		const user = await this.get({googleID: props.googleId});
		if (user) throw new HttpException(`USER_EXIST`, 409);

		const created = await new this.userModel({
			username: props.displayName,
			lowerCaseUsername: props.displayName.toLowerCase(),
			avatar: props.photo,
			googleID: props.googleId,
			role: role,
			refreshTokens: [],
		}).save();

		if (!created) throw new HttpException(`DATABASE_ERROR`, 500);
		return created;
	}

	public async updateTokens(id: ObjectId, token: string) {
		const user = await this.get({_id: id});
		if (!user) throw new HttpException(`USER_NOT_FOUND`, 404);

		if (user.refreshTokens.length >= 10) user.refreshTokens.shift();
		user.refreshTokens.push(token);

		return await this.updateUser(user);
	}

	private async _checkAdmin() {
		const username = process.env.ADMIN_USERNAME;
		const password = process.env.ADMIN_PASSWORD;

		const user = await this.get({lowerCaseUsername: username.toLowerCase()});
		if (user) return `✅ Admin exist`;

		const created = await this.createCustomUser(
			{username: username, password: password},
			`admin`
		);

		if (!created) return `❌ Admin are not created`;
		return `✅ Admin created`;
	}

	private async updateUser(user: User) {
		const updated = await this.userModel
			.findOneAndUpdate({_id: user._id}, {$set: {...user}})
			.exec();

		if (!updated) throw new HttpException(`DATABASE_ERROR`, 500);
		return updated;
	}
}
