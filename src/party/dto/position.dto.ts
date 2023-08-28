import {ApiProperty} from "@nestjs/swagger";
import {IsInt, IsNotEmpty, IsString} from "class-validator";

export class CreatePositionDTO {
	@ApiProperty({example: 1})
	@IsNotEmpty()
	@IsInt()
	calculatorId: number;

	@ApiProperty({example: `Ананас`})
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({example: 100})
	@IsNotEmpty()
	@IsInt()
	cost: number;

	@ApiProperty({example: [1, 2, 3]})
	memberIds?: number[];
}

export class UpdatePositionDTO {
	@ApiProperty({example: 1})
	@IsNotEmpty()
	@IsInt()
	positionId: number;

	@ApiProperty({example: `Ананас`})
	@IsString()
	name?: string;

	@ApiProperty({example: 100})
	@IsInt()
	cost?: number;

	@ApiProperty({example: [1, 2, 3]})
	memberIds?: number[];
}