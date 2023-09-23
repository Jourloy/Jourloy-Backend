import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAttributeDTO {
	@ApiProperty({example: `Will`})
	@IsNotEmpty()
	@IsString()
	enName: string;

	@ApiProperty({example: `Cast spell`})
	@IsNotEmpty()
	@IsString()
	enDescription: string;

	@ApiProperty({example: `Уилл`})
	@IsNotEmpty()
	@IsString()
	ruName: string;

	@ApiProperty({example: `Зачарование заклинаний`})
	@IsNotEmpty()
	@IsString()
	ruDescription: string;
}

export class UpdateAttributeDTO {
	@ApiProperty({example: `Will`})
	@IsNotEmpty()
	@IsString()
	enName: string;

	@ApiProperty({example: `Cast spell`})
	@IsNotEmpty()
	@IsString()
	enDescription: string;

	@ApiProperty({example: `Уилл`})
	@IsNotEmpty()
	@IsString()
	ruName: string;

	@ApiProperty({example: `Зачарование заклинаний`})
	@IsNotEmpty()
	@IsString()
	ruDescription: string;
}