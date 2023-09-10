import {Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Res, UseGuards} from "@nestjs/common";
import {TrackerService} from "./tracker.service";
import {JwtGuard} from "src/guards/jwt.guard";
import {TrackerCreateDTO, TrackerUpdateDTO} from "./dto/tracker.dto";
import {CurrentUser, ICurrentUser} from "src/decorators/user.decorator";
import {Response} from "express";
import {ERR} from "src/enums/error.enum";
import {SpendCreateDTO} from "./dto/spend.dto";

@Controller(`tracker`)
export class TrackerController {
	constructor(private readonly trackerService: TrackerService) {}

	@Post(`/`)
	@UseGuards(JwtGuard)
	async createTracker(
		@Body() body: TrackerCreateDTO,
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const state = await this.trackerService.createTracker({...body}, user);

		if (state === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);
		if (state === ERR.TRACKER_EXIST) throw new HttpException(ERR.TRACKER_EXIST, 400);

		response.status(200).json(state);
	}

	@Patch(`/`)
	@UseGuards(JwtGuard)
	async updateTracker(
		@Body() body: TrackerUpdateDTO,
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const state = await this.trackerService.updateTracker({...body}, user);

		if (state === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);
		if (state === ERR.TRACKER_NOT_FOUND) throw new HttpException(ERR.TRACKER_NOT_FOUND, 404);

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

	@Delete(`/:id`)
	@UseGuards(JwtGuard)
	async removeTracker(@Param(`id`) id: string, @CurrentUser() user: ICurrentUser, @Res() response: Response) {
		const state = await this.trackerService.removeTracker(+id, user);

		if (state === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);
		if (state === ERR.TRACKER_NOT_FOUND) throw new HttpException(ERR.TRACKER_NOT_FOUND, 404);

		response.status(200).json(state);
	}

	@Post(`/spend`)
	@UseGuards(JwtGuard)
	async createSpend(
		@Body() body: SpendCreateDTO,
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const state = await this.trackerService.createSpend({...body}, user);
		if (state === ERR.USER_NOT_FOUND) {
			response.status(404).send(ERR.USER_NOT_FOUND);
		} else if (state === ERR.TRACKER_NOT_FOUND) {
			response.status(404).send(ERR.TRACKER_NOT_FOUND);
		} else if (state === ERR.INCORRECT_DATA) {
			response.status(400).send(ERR.INCORRECT_DATA);
		} else {
			response.status(200).json(state);
		}
	}
}
