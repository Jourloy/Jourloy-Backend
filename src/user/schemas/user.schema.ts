import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {
	_id?: Types.ObjectId;

	@Prop()
	username: string;

	@Prop()
	lowerCaseUsername: string;

	@Prop()
	avatar: string;

	@Prop()
	refreshTokens: string[];

	@Prop()
	role: string;

	@Prop()
	password?: string;

	@Prop()
	googleID?: string;

	@Prop()
	apiKey?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
