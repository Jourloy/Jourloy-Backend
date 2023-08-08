import {Body, Controller, Get, HttpException, Post, Res, UseGuards} from "@nestjs/common";
import {TrackerService} from "./tracker.service";
import {CurrentUser, ICurrentUser} from "src/decorators/user.decorator";
import {Response} from "express";
import {TrackerCreateDTO} from "./dto/create.dto";
import {JwtGuard} from "src/guards/jwt.guard";
import {RoleGuard} from "src/guards/role.guard";
import {Roles} from "src/decorators/roles.decorator";
import {Role} from "src/enums/role.enum";
import {ApiTags} from "@nestjs/swagger";
import { ERR } from "src/enums/error.enum";

@Controller(`tracker`)
@ApiTags(`Tracker`)
export class TrackerController {
	constructor(private readonly trackerService: TrackerService) {}

	@Post(`/`)
	@UseGuards(JwtGuard)
	async create(
		@Body() body: TrackerCreateDTO,
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const state = await this.trackerService.create({...body}, user);

		if (state === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);
		if (state === ERR.TRACKER_EXIST) throw new HttpException(ERR.TRACKER_EXIST, 400);
		
		response.status(200).json(state);
	}

	@Get(`/all`)
	@Roles(Role.ADMIN)
	@UseGuards(RoleGuard, JwtGuard)
	async getAll() {
		return await this.trackerService.getAll();
	}

	@Get(`/`)
	@UseGuards(JwtGuard)
	async getOwned(@CurrentUser() user: ICurrentUser, @Res() response: Response) {
		const state = await this.trackerService.getOwned(user);

		if (state === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);
		if (state === ERR.TRACKER_NOT_FOUND) throw new HttpException(ERR.TRACKER_NOT_FOUND, 404);

		response.status(200).json(state);
	}

	@Get(`/check`)
	@UseGuards(JwtGuard)
	async getOwnedCheck(@CurrentUser() user: ICurrentUser, @Res() response: Response) {
		const state = await this.trackerService.getOwnedCheck(user);
		
		if (state === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);
		if (state === ERR.TRACKER_NOT_FOUND) throw new HttpException(ERR.TRACKER_NOT_FOUND, 404);

		response.status(200).send(state);
	}
}
