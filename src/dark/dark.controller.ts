import {Body, Controller, Get, HttpException, Param, Post, Res, UseGuards} from "@nestjs/common";
import {DarkService} from "./dark.service";
import {CreateClassDTO} from "./dto/class.dto";
import {ERR} from "src/enums/error.enum";
import {Response} from "express";
import { JwtGuard } from "src/guards/jwt.guard";
import { RoleGuard } from "src/guards/role.guard";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";

@Controller(`/dark`)
export class DarkController {
	constructor(private readonly darkService: DarkService) {}

	@Post(`/class`)
	@UseGuards(JwtGuard, RoleGuard)
	@Roles(Role.ADMIN)
	async createClass(@Body() body: CreateClassDTO, @Res() response: Response) {
		const state = await this.darkService.createClass(body);

		if (state === ERR.DATABASE) throw new HttpException(ERR.DATABASE, 500);
		if (state === ERR.DARK_CLASS_EXIST) throw new HttpException(ERR.DARK_CLASS_EXIST, 400);

		response.status(200).json(state);
	}

	@Get(`/class/all`)
	@UseGuards(JwtGuard)
	async getAllClasses(@Res() response: Response) {
		const state = await this.darkService.getAllClasses();
		response.status(200).json(state);
	}

	@Get(`/class/:id`)
	@UseGuards(JwtGuard)
	async getClasse(@Param(`id`) id: string, @Res() response: Response) {
		const state = await this.darkService.getOneClass(+id);
		response.status(200).json(state);
	}
}
