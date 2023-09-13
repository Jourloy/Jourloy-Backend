import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";

export class SpendCreateDTO {
	@ApiProperty({example: 123})
	@IsNotEmpty()
	@IsNumber()
	cost: number;

	@ApiProperty({example: `Food`})
	category: string;

	@ApiProperty({example: `Apple`})
	description?: string;

	@ApiProperty({example: new Date()})
	date?: Date;

	@ApiProperty({example: `never`})
	repeat?: string;
}


export class SpendUpdateDTO {
	@ApiProperty({example: 123})
	@IsNotEmpty()
	@IsNumber()
	cost: number;

	@ApiProperty({example: `Food`})
	category: string;

	@ApiProperty({example: `Apple`})
	description?: string;

	@ApiProperty({example: new Date()})
	date?: string;

	@ApiProperty({example: `never`})
	repeat?: string;

	@ApiProperty({example: new Date().toString()})
	createdAt?: string;
}