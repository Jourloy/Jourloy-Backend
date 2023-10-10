import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {Spend} from "./spend.schema";

export type TrackerDocument = Tracker & Document;

@Schema({timestamps: true})
export class Tracker {
	_id?: Types.ObjectId;

	@Prop()
	name: string;

	@Prop()
	limit: number;

	@Prop()
	startLimit: number;

	@Prop()
	periodLimit: number;

	@Prop()
	months: number;

	@Prop()
	calc: string;

	@Prop()
	startDate: Date;

	@Prop({type: [Types.ObjectId], ref: Spend.name})
	spends: Spend[];

	@Prop()
	owner: Types.ObjectId;
}

export const TrackerSchema = SchemaFactory.createForClass(Tracker);
