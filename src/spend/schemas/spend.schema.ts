import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document, Types} from "mongoose";
import {Tracker} from "../../tracker/schemas/tracker.schema";

export type SpendDocument = Spend & Document;

@Schema({timestamps: true})
export class Spend {
	_id?: Types.ObjectId;

	@Prop()
	cost: number;

	@Prop()
	description: string;

	@Prop()
	category: string;

	@Prop()
	date?: Date;

	@Prop({type: Types.ObjectId, ref: `Tracker`})
	tracker: Tracker;
}

export const SpendSchema = SchemaFactory.createForClass(Spend);
