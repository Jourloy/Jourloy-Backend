import {Injectable} from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { ICurrentUser } from "src/decorators/user.decorator";
import { ERR } from "src/enums/error.enum";
import {UserService} from "src/user/user.service";

type TTrackerCreate = {
	limit: number;
	dayLimit: number;
	months: number;
	calc: string;
}

@Injectable()
export class TrackerService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService
	) {}

	public async create(data: TTrackerCreate, userData: ICurrentUser) {
		const props: {googleId?: string; id?: number} = {};
		if (userData.type === `google`) props.googleId = userData.id;
		if (userData.type === `local`) props.id = userData.id;

		const user = await this.userService.get(props);
		if (!user) return ERR.USER_NOT_FOUND;

		const tracker = await this.prisma.tracker.findFirst({where: {ownerId: user.id}})
		if (tracker) return ERR.TRACKER_EXIST;

		const created = await this.prisma.tracker.create({
			data: {
				name: `Личный трекер`,
				limit: data.limit,
				dayLimit: data.dayLimit,
				startLimit: data.limit,
				months: data.months,
				calc: data.calc,
				ownerId: user.id
			}
		})

		if (!created) return ERR.DATABASE;
		return created;
	}

	public async getAll() {
		return await this.prisma.tracker.findMany({include: {spends: true}});
	}

	public async getOwned(data: ICurrentUser) {
		const props: {googleId?: string; id?: number} = {};
		if (data.type === `google`) props.googleId = data.id;
		if (data.type === `local`) props.id = data.id;

		const user = await this.userService.get(props);
		if (!user) return ERR.USER_NOT_FOUND;

		const tracker = await this.prisma.tracker.findFirst({include: {owner: true, spends: true}, where: {ownerId: user.id}})
		if (!tracker) return ERR.TRACKER_NOT_FOUND;

		delete tracker.owner.password;
		delete tracker.owner.refreshTokens;
		delete tracker.owner.role;
		delete tracker.owner.apiKey;

		return tracker;
	}

	public async getOwnedCheck(data: ICurrentUser) {
		const props: {googleId?: string; id?: number} = {};
		if (data.type === `google`) props.googleId = data.id;
		if (data.type === `local`) props.id = data.id;

		const user = await this.userService.get(props);
		if (!user) return ERR.USER_NOT_FOUND;

		const tracker = await this.prisma.tracker.findFirst({include: {owner: true, spends: true}, where: {ownerId: user.id}})
		if (!tracker) return ERR.TRACKER_NOT_FOUND;

		return tracker;
	}
}
