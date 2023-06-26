import {Body, Controller, Logger, Post, Res, UseGuards} from "@nestjs/common";
import {Response} from "express";
import {SpendService} from "./spend.service";
import {ApiTags} from "@nestjs/swagger";
import {SpendCreateDTO} from "./dto/create.dto";
import {CurrentUser, ICurrentUser} from "src/decorators/user.decorator";
import { JwtGuard } from "src/guards/jwt.guard";

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
		const state = await this.spendService.create({...body, userID: user.id, userIDType: user.type});
		if (state === `USER_NOT_FOUND`) {
			response.status(400).send(`USER_NOT_FOUND`);
		} else if (state === `TRACKER_NOT_FOUND`) {
			response.status(400).send(`TRACKER_NOT_FOUND`);
		} else if (state === `INVALID_DATA`) {
			response.status(400).send(`INVALID_DATA`);
		} else {
			response.status(200).json(state);
		}
	}
}
