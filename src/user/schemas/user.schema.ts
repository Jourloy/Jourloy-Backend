import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class SystemAccount {
	@Prop()
	password: string;

	@Prop()
	apiKey: string;
}

@Schema()
export class GoogleAccount {
	@Prop()
	googleID: string;
}

@Schema({timestamps: true})
export class User {
	_id?: Types.ObjectId;

	@Prop()
	username: string;

	@Prop()
	lowercaseUsername: string;

	@Prop()
	avatar: string;

	@Prop()
	refreshTokens: string[];

	@Prop()
	role: string;

	@Prop()
	systemAccount?: SystemAccount;

	@Prop()
	googleAccount?: GoogleAccount;
}

export const UserSchema = SchemaFactory.createForClass(User);
