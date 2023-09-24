import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateClassDTO {
	@ApiProperty({example: `Cliric`})
	@IsNotEmpty()
	@IsString()
	enName: string;

	@ApiProperty({example: ``})
	@IsString()
	enDescription: string;

	@ApiProperty({example: `Жрец`})
	@IsNotEmpty()
	@IsString()
	ruName: string;

	@ApiProperty({example: ``})
	@IsString()
	ruDescription: string;
}

export class UpdateClassDTO {
	@ApiProperty({example: `Cliric`})
	@IsNotEmpty()
	@IsString()
	enName: string;

	@ApiProperty({example: ``})
	@IsString()
	enDescription: string;

	@ApiProperty({example: `Жрец`})
	@IsNotEmpty()
	@IsString()
	ruName: string;

	@ApiProperty({example: ``})
	@IsString()
	ruDescription: string;
}