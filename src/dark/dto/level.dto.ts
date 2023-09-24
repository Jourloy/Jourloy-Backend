import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class CreateLevelDTO {
	@ApiProperty({example: `Cliric`})
	@IsNotEmpty()
	@IsNumber()
	depth: number;

	@ApiProperty({example: ``})
	@IsNotEmpty()
	@IsArray()
	classes: string[];

	@ApiProperty({example: 1})
	@IsNotEmpty()
	@IsNumber()
	attributeId: number;
}

export class UpdateLevelDTO {
	@ApiProperty({example: `Cliric`})
	@IsNotEmpty()
	@IsNumber()
	depth: number;

	@ApiProperty({example: ``})
	@IsNotEmpty()
	@IsArray()
	classes: string[];

	@ApiProperty({example: 1})
	@IsNotEmpty()
	@IsNumber()
	attributeId: number;
}