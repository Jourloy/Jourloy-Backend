import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class RegisterDto {
	@ApiProperty({example: `JOURLOY`})
	@IsNotEmpty()
	@IsString()
	username: string;

	@ApiProperty({example: `12345`})
	@IsNotEmpty()
	@IsString()
	password: string;
}
