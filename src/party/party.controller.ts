import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	Param,
	Patch,
	Post,
	Res,
	UseGuards,
} from "@nestjs/common";
import {PartyService} from "./party.service";
import {CreateMemberDTO} from "./dto/member.dto";
import {CurrentUser, ICurrentUser} from "src/decorators/user.decorator";
import {Response} from "express";
import {ERR} from "src/enums/error.enum";
import {JwtGuard} from "src/guards/jwt.guard";
import {CreatePositionDTO, UpdatePositionDTO} from "./dto/position.dto";

@Controller(`/party`)
export class PartyController {
	constructor(private readonly partyService: PartyService) {}

	@Post(`/`)
	@UseGuards(JwtGuard)
	async createCalculator(@CurrentUser() user: ICurrentUser, @Res() response: Response) {
		const calculator = await this.partyService.createCalculator(user);

		if (calculator === ERR.DATABASE) throw new HttpException(ERR.DATABASE, 500);
		if (calculator === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);
		if (calculator === ERR.CALC_EXIST) throw new HttpException(ERR.CALC_EXIST, 400);

		response.status(200).json(calculator);
	}

	@Get(`/`)
	@UseGuards(JwtGuard)
	async getCalculator(@CurrentUser() user: ICurrentUser, @Res() response: Response) {
		const calculator = await this.partyService.getCalculator(user);

		if (calculator === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);
		if (calculator === ERR.CALC_NOT_FOUND) throw new HttpException(ERR.CALC_NOT_FOUND, 404);

		response.status(200).json(calculator);
	}

	// async updateCalculator() {}

	// async removeCalculator() {}

	// async getOwnedCalculators() {}

	@Post(`/member`)
	@UseGuards(JwtGuard)
	async createMember(
		@Body() body: CreateMemberDTO,
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const member = await this.partyService.createMember(body, user);

		if (member === ERR.DATABASE) throw new HttpException(ERR.DATABASE, 500);
		if (member === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);
		if (member === ERR.CALC_NOT_FOUND) throw new HttpException(ERR.CALC_NOT_FOUND, 404);

		response.status(200).json(member);
	}

	@Get(`/member/all`)
	@UseGuards(JwtGuard)
	async getMembers(
		@Body() body: CreateMemberDTO,
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const members = await this.partyService.getMembers(body.calculatorId, user);

		if (members === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);
		if (members === ERR.CALC_NOT_FOUND) throw new HttpException(ERR.CALC_NOT_FOUND, 404);

		response.status(200).json(members);
	}

	// async getMember() {}

	// async updateMember() {}

	@Delete(`/member/:id`)
	@UseGuards(JwtGuard)
	async removeMember(
		@Param(`id`) id: string,
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const state = await this.partyService.removeMember(+id, user);

		if (state === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);
		if (state === ERR.CALC_NOT_FOUND) throw new HttpException(ERR.CALC_NOT_FOUND, 404);

		response.status(200).send(`OK`);
	}

	@Delete(`/member/all/:id`)
	@UseGuards(JwtGuard)
	async removeMembers(
		@Param(`id`) id: string,
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const state = await this.partyService.removeMembers(+id, user);

		if (state === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);
		if (state === ERR.CALC_NOT_FOUND) throw new HttpException(ERR.CALC_NOT_FOUND, 404);

		response.status(200).send(`OK`);
	}

	@Post(`/position`)
	@UseGuards(JwtGuard)
	async createPosition(
		@Body() body: CreatePositionDTO,
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const position = await this.partyService.createPosition(body, user);

		if (position === ERR.DATABASE) throw new HttpException(ERR.DATABASE, 500);
		if (position === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);
		if (position === ERR.CALC_NOT_FOUND) throw new HttpException(ERR.CALC_NOT_FOUND, 404);

		response.status(200).json(position);
	}

	@Patch(`/position`)
	@UseGuards(JwtGuard)
	async updatePosition(
		@Body() body: UpdatePositionDTO,
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const position = await this.partyService.updatePosition(body, user);

		if (position === ERR.DATABASE) throw new HttpException(ERR.DATABASE, 500);
		if (position === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);

		response.status(200).json(position);
	}

	@Delete(`/position/:id`)
	@UseGuards(JwtGuard)
	async removePosition(
		@Param(`id`) id: string,
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const state = await this.partyService.removePosition(+id, user);

		if (state === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);
		if (state === ERR.CALC_NOT_FOUND) throw new HttpException(ERR.CALC_NOT_FOUND, 404);

		response.status(200).send(`OK`);
	}

	@Delete(`/position/all/:id`)
	@UseGuards(JwtGuard)
	async removePositions(
		@Param(`id`) id: string,
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const state = await this.partyService.removePositions(+id, user);

		if (state === ERR.USER_NOT_FOUND) throw new HttpException(ERR.USER_NOT_FOUND, 404);
		if (state === ERR.CALC_NOT_FOUND) throw new HttpException(ERR.CALC_NOT_FOUND, 404);

		response.status(200).send(`OK`);
	}
}
