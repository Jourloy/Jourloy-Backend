import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document, Types} from "mongoose";
import {User} from "../../user/schemas/user.schema";
import {Spend} from "../../spend/schemas/spend.schema";

export type TrackerDocument = Tracker & Document;

@Schema({timestamps: true})
export class Tracker {
	_id?: Types.ObjectId;

	@Prop()
	limit: number;

	@Prop()
	startLimit: number;

	@Prop()
	dayLimit: number;

	@Prop({type: Types.ObjectId, ref: `User`})
	owner: User;

	@Prop({type: [Types.ObjectId], ref: `User`})
	sharedWithUsers: User[];

	@Prop({type: [Types.ObjectId], ref: `Spend`})
	spends: Spend[];

	@Prop({type: [Types.ObjectId], ref: `Spend`})
	plannedSpends: Spend[];
}

export const TrackerSchema = SchemaFactory.createForClass(Tracker);
