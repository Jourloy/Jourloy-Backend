import {Body, Controller, Logger, Post, Res, UseGuards} from "@nestjs/common";
import {Response} from "express";
import {SpendService} from "./spend.service";
import {ApiTags} from "@nestjs/swagger";
import {SpendCreateDTO} from "./dto/create.dto";
import {CurrentUser, ICurrentUser} from "src/decorators/user.decorator";
import {JwtGuard} from "src/guards/jwt.guard";
import {ERR} from "src/enums/error.enum";

@Controller(`spend`)
@ApiTags(`Spend`)
export class SpendController {
	constructor(private readonly spendService: SpendService) {}

	private readonly logger = new Logger(SpendController.name);

	@Post(`/`)
	@UseGuards(JwtGuard)
	async create(
		@Body() body: SpendCreateDTO,
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const state = await this.spendService.create({...body}, user);
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
