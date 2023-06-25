import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Tracker, TrackerDocument} from "./schemas/tracker.schema";
import {Model} from "mongoose";
import {UserService} from "src/user/user.service";

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

		const created = await new this.trackerModel({
			name: `Лучший трекер`,
			limit: data.limit,
			dayLimit: data.dayLimit,
			startLimit: data.limit,
			spends: [],
			plannedSpends: [],
			owner: user,
			sharedWithUsers: [],
		}).save();

		return created;
	}

	public async getAll() {
		return await this.trackerModel.find().populate(`owner`).exec();
	}

	public async getOwned(id: string) {
		return await this.trackerModel.find({owner: id}).populate(`owner`).exec();
	}

	public async getAllowed(id: string) {
		return await this.trackerModel.find({sharedWithUsers: {$in: [id]}}).populate(`owner`).exec();
	}
}
