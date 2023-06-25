import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {Tracker} from "../../tracker/schemas/tracker.schema";

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

	@Prop({type: Types.ObjectId, ref: `Tracker`})
	trackerID?: Tracker;

	@Prop({type: [Types.ObjectId], ref: `Tracker`})
	sharedTrackersID?: Tracker[];
}

export const UserSchema = SchemaFactory.createForClass(User);
