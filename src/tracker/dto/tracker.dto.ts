import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class TrackerCreateDTO {
	@ApiProperty({example: 31000})
	@IsNotEmpty()
	@IsNumber()
	limit: number;

	@ApiProperty({example: 700})
	@IsNotEmpty()
	@IsNumber()
	dayLimit: number;

	@ApiProperty({example: 0})
	@IsNotEmpty()
	@IsNumber()
	months: number;

	@ApiProperty({example: `dayCalc`})
	@IsNotEmpty()
	@IsString()
	calc: string;
}

export class TrackerUpdateDTO {
	@ApiProperty({example: 500})
	@IsNotEmpty()
	@IsNumber()
	dayLimit: number;

	@ApiProperty({example: new Date().toString()})
	@IsNotEmpty()
	@IsString()
	startDate: string;

	@ApiProperty({example: `dayCalc`})
	@IsNotEmpty()
	@IsString()
	calc: string;

	@ApiProperty({example: 10000})
	@IsNotEmpty()
	@IsNumber()
	limit: number;
}