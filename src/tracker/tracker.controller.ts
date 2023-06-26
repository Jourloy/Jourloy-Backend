import {Body, Controller, Get, Post, Res, UseGuards} from "@nestjs/common";
import {TrackerService} from "./tracker.service";
import {CurrentUser, ICurrentUser} from "src/decorators/user.decorator";
import {Response} from "express";
import {TrackerCreateDTO} from "./dto/create.dto";
import {JwtGuard} from "src/guards/jwt.guard";
import {RoleGuard} from "src/guards/role.guard";
import {Roles} from "src/decorators/roles.decorator";
import {Role} from "src/enums/role.enum";
import { ApiTags } from "@nestjs/swagger";

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
		const state = await this.trackerService.create({
			...body,
			userID: user.id,
			userIDType: user.type,
		});
		if (state === `USER_NOT_FOUND`) {
			response.status(400).send(`USER_NOT_FOUND`);
		} else if (state === `TRACKER_ALREADY_EXISTS`) {
			response.status(400).send(`TRACKER_ALREADY_EXISTS`);
		} else {
			response.status(200).json(state);
		}
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
		const state = await this.trackerService.getOwned(user.id, user.type);
		if (state === `USER_NOT_FOUND`) {
			response.status(400).send(`USER_NOT_FOUND`);
		} else {
			response.status(200).json(state);
		}
	}

	@Get(`/shared`)
	@UseGuards(JwtGuard)
	async getShared(@CurrentUser() user: ICurrentUser, @Res() response: Response) {
		const state = await this.trackerService.getShared(user.id, user.type);
		if (state === `USER_NOT_FOUND`) {
			response.status(400).send(`USER_NOT_FOUND`);
		} else {
			response.status(200).json(state);
		}
	}
}
