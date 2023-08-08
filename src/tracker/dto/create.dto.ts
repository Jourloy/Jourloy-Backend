import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber} from "class-validator";

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
	@IsNumber()
	calc: string;
}
