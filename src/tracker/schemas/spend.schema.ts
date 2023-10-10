import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import { Tracker } from "./tracker.schema";

export type SpendDocument = Spend & Document;

@Schema({timestamps: true})
export class Spend {
	_id: Types.ObjectId;

	@Prop()
	cost: number;

	@Prop()
	category: string;

	@Prop()
	description?: string;

	@Prop()
	date?: Date;

	@Prop()
	repeat?: string;

	@Prop({type: Types.ObjectId, ref: Tracker.name})
	tracker: Tracker;
}

export const SpendSchema = SchemaFactory.createForClass(Spend);
