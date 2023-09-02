import {ApiProperty} from "@nestjs/swagger";
import {IsInt, IsNotEmpty, IsString} from "class-validator";

export class CreateMemberDTO {
	@ApiProperty({example: 1})
	@IsNotEmpty()
	@IsInt()
	calculatorId: number;

	@ApiProperty({example: `Игорь`})
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({example: true})
	payer?: boolean;
}

export class UpdateMemberDTO {
	@ApiProperty({example: `Антоха`})
	@IsString()
	name?: string;

	@ApiProperty({example: `https://jourloy.com/image.png`})
	@IsString()
	avatar?: string;
}