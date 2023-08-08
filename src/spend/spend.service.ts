import {HttpException, Injectable} from "@nestjs/common";
import {TrackerService} from "src/tracker/tracker.service";
import {ICurrentUser} from "src/decorators/user.decorator";
import {PrismaService} from "src/database/prisma.service";
import { ERR } from "src/enums/error.enum";

interface ISpendCreate {
	cost: number;
	category: string;
	description?: string;
	date?: Date;
}

@Injectable()
export class SpendService {
	constructor(private prisma: PrismaService, private trackerService: TrackerService) {}

	public async create(data: ISpendCreate, user: ICurrentUser) {
		const tracker = await this.trackerService.getOwned(user);
		if (!tracker || tracker === ERR.TRACKER_NOT_FOUND) return ERR.TRACKER_NOT_FOUND;
		if (tracker === ERR.USER_NOT_FOUND) return tracker;

		if (!data || !data.cost) return ERR.INCORRECT_DATA;

		const created = this.prisma.spend.create({
			data: {
				cost: data.cost,
				category: data.category,
				description: data.description,
				date: data.date,
				trackerId: tracker.id,
			}
		})

		if (!created) return ERR.DATABASE;
		return created;
	}
}
