import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";

export type SpendDocument = Spend & Document;

@Schema({timestamps: true})
export class Spend {
	_id?: Types.ObjectId;

	@Prop()
	cost: number;

	@Prop()
	category: string;

	@Prop()
	description?: string;

	@Prop()
	date?: Date;
}

export const SpendSchema = SchemaFactory.createForClass(Spend);
