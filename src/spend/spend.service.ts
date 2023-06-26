import {Injectable} from "@nestjs/common";
import {Spend, SpendDocument} from "./schemas/spend.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {TrackerService} from "src/tracker/tracker.service";

interface ISpendCreate {
	cost: number;
	category: string;
	description?: string;
	date?: Date;

	userID: string;
	userIDType: string;
}

@Injectable()
export class SpendService {
	constructor(
		@InjectModel(Spend.name) private spendModel: Model<SpendDocument>,
		private trackerService: TrackerService,
	) {}

	public async create(data: ISpendCreate) {
		const tracker = await this.trackerService.getOwned(data.userID, data.userIDType);
		if (!tracker) return `TRACKER_NOT_FOUND`;
		if (tracker === `USER_NOT_FOUND`) return `USER_NOT_FOUND`;

		if (!data || !data.cost) return `INVALID_DATA`;

		const created = await new this.spendModel({
			cost: data.cost,
			description: data.description,
			category: data.category,
			date: data.date,
		}).save();

		if (!data.date) await this.trackerService.addSpend(created, data.userID, data.userIDType);
		if (data.date) await this.trackerService.addPlannedSpend(created, data.userID, data.userIDType);

		return created;
	}
}
