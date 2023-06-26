import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Tracker, TrackerDocument} from "./schemas/tracker.schema";
import {Model} from "mongoose";
import {UserService} from "src/user/user.service";
import { Spend } from "src/spend/schemas/spend.schema";

interface ITrackerCreate {
	limit: number;
	dayLimit: number;
	userID: string;
	userIDType: string;
}

@Injectable()
export class TrackerService {
	constructor(
		@InjectModel(Tracker.name) private trackerModel: Model<TrackerDocument>,
		private userService: UserService
	) {}

	public async create(data: ITrackerCreate) {
		const props: {googleID?: string; _id?: string} = {};
		if (data.userIDType === `google`) props.googleID = data.userID;
		if (data.userIDType === `local`) props._id = data.userID;

		const user = await this.userService.get(props);
		if (!user) return `USER_NOT_FOUND`;

		const _tracker = await this.trackerModel.findOne({owner: user._id});
		if (_tracker) return `TRACKER_ALREADY_EXISTS`;

		return await new this.trackerModel({
			name: `Лучший трекер`,
			limit: data.limit,
			dayLimit: data.dayLimit,
			startLimit: data.limit,
			spends: [],
			plannedSpends: [],
			owner: user,
			sharedWithUsers: [],
		}).save();
	}

	public async getAll() {
		return await this.trackerModel.find().populate([`owner`, `spends`]).exec();
	}

	public async getOwned(id: string, type: string) {
		const props: {googleID?: string; _id?: string} = {};
		if (type === `google`) props.googleID = id;
		if (type === `local`) props._id = id;

		const user = await this.userService.get(props);
		if (!user) return `USER_NOT_FOUND`;

		return await this.trackerModel.findOne({owner: user._id}).populate([`owner`, `spends`]).exec();
	}

	public async getShared(id: string, type: string) {
		const props: {googleID?: string; _id?: string} = {};
		if (type === `google`) props.googleID = id;
		if (type === `local`) props._id = id;

		const user = await this.userService.get(props);
		if (!user) return `USER_NOT_FOUND`;

		return await this.trackerModel.find({sharedWithUsers: {$in: [id]}}).populate([`owner`, `spends`]).exec();
	}

	public async addSpend(data: Spend, id: string, type: string) {
		const props: {googleID?: string; _id?: string} = {};
		if (type === `google`) props.googleID = id;
		if (type === `local`) props._id = id;

		const tracker = await this.getOwned(id, type);
		if (!tracker) return `TRACKER_NOT_FOUND`;
		if (tracker === `USER_NOT_FOUND`) return `USER_NOT_FOUND`;

		tracker.spends.push(data);
		return await tracker.save();
	}

	public async addPlannedSpend(data: Spend, id: string, type: string) {
		const props: {googleID?: string; _id?: string} = {};
		if (type === `google`) props.googleID = id;
		if (type === `local`) props._id = id;

		const tracker = await this.getOwned(id, type);
		if (!tracker) return `TRACKER_NOT_FOUND`;
		if (tracker === `USER_NOT_FOUND`) return `USER_NOT_FOUND`;

		tracker.plannedSpends.push(data);
		return await tracker.save();
	}
}
