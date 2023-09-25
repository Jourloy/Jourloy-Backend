import {Body, Controller, Get, HttpException, Param, Post, Res, UseGuards} from "@nestjs/common";
import {DarkService} from "./dark.service";
import {CreateClassDTO} from "./dto/class.dto";
import {ERR} from "src/enums/error.enum";
import {Response} from "express";
import {JwtGuard} from "src/guards/jwt.guard";
import {RoleGuard} from "src/guards/role.guard";
import {Roles} from "src/decorators/roles.decorator";
import {Role} from "src/enums/role.enum";
import {CreateAttributeDTO} from "./dto/attribute.dto";

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
	async getClass(@Param(`id`) id: string, @Res() response: Response) {
		const state = await this.darkService.getOneClass(+id);
		response.status(200).json(state);
	}

	@Post(`/attribute`)
	@UseGuards(JwtGuard, RoleGuard)
	@Roles(Role.ADMIN)
	async createAttribute(@Body() body: CreateAttributeDTO, @Res() response: Response) {
		const state = await this.darkService.createAttribute(body);

		if (state === ERR.DATABASE) throw new HttpException(ERR.DATABASE, 500);
		if (state === ERR.DARK_ATTRIBUTE_EXIST) throw new HttpException(ERR.DARK_ATTRIBUTE_EXIST, 400);

		response.status(200).json(state);
	}

	@Get(`/attribute/all`)
	@UseGuards(JwtGuard)
	async getAllAttributes(@Res() response: Response) {
		const state = await this.darkService.getAllAttributes();
		response.status(200).json(state);
	}

	@Get(`/attribute/:id`)
	@UseGuards(JwtGuard)
	async getAttribute(@Param(`id`) id: string, @Res() response: Response) {
		const state = await this.darkService.getOneAttribute(+id);
		response.status(200).json(state);
	}
}
