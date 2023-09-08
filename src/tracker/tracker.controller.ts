import {Body, Controller, Get, HttpException, Post, Res, UseGuards} from "@nestjs/common";
import {TrackerService} from "./tracker.service";
import {JwtGuard} from "src/guards/jwt.guard";
import {TrackerCreateDTO} from "./dto/create.dto";
import {CurrentUser, ICurrentUser} from "src/decorators/user.decorator";
import {Response} from "express";
import {ERR} from "src/enums/error.enum";

@Controller(`tracker`)
export class TrackerController {
	constructor(private readonly trackerService: TrackerService) {}

	@Post(`/`)
	@UseGuards(JwtGuard)
	async create(
		@Body() body: TrackerCreateDTO,
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const state = await this.trackerService.createTracker({...body}, user);

		if (state === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);
		if (state === ERR.TRACKER_EXIST) throw new HttpException(ERR.TRACKER_EXIST, 400);

		response.status(200).json(state);
	}

	@Get(`/`)
	@UseGuards(JwtGuard)
	async getOwned(@CurrentUser() user: ICurrentUser, @Res() response: Response) {
		const state = await this.trackerService.getOwned(user);

		if (state === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);
		if (state === ERR.TRACKER_NOT_FOUND) throw new HttpException(ERR.TRACKER_NOT_FOUND, 404);

		response.status(200).json(state);
	}
}
