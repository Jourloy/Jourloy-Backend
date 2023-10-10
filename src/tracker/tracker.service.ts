import {Injectable} from "@nestjs/common";
import {UserService} from "src/user/user.service";
import {TrackerCreateDTO, TrackerUpdateDTO} from "./dto/tracker.dto";
import {ICurrentUser} from "src/decorators/user.decorator";
import {ERR} from "src/enums/error.enum";
import {SpendCreateDTO, SpendUpdateDTO} from "./dto/spend.dto";
import {Model} from "mongoose";
import {Tracker} from "./schemas/tracker.schema";
import {Spend} from "./schemas/spend.schema";
import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export class TrackerService {
	constructor(
		@InjectModel(Tracker.name) private trackerModel: Model<Tracker>,
		@InjectModel(Spend.name) private spendModel: Model<Spend>,
		private userService: UserService
	) {}

	/* TRACKER */

	/**
	 * Creates a tracker based on the given data and user information.
	 * @param data - The data for creating the tracker.
	 * @param userData - The user information.
	 * @returns The created tracker if successful, otherwise an error code.
	 */
	public async createTracker(data: TrackerCreateDTO, userData: ICurrentUser) {
		// Determine the props based on the user type
		const props: {googleId?: string; id?: string} = {};
		if (userData.type === `google`) props.googleId = userData.id;
		if (userData.type === `local`) props.id = userData.id;

		// Retrieve the user based on the props
		const user = await this.userService.get(props);
		if (!user) return ERR.USER_NOT_FOUND;

		// Check if a tracker already exists for the user
		const tracker = await this.trackerModel.findOne({owner: user._id});
		if (tracker) return ERR.TRACKER_EXIST;

		// Create the tracker
		const created = await this.trackerModel.create({
			name: `Личный трекер`,
			limit: data.limit,
			dayLimit: data.dayLimit,
			startLimit: data.limit,
			months: data.months,
			calc: data.calc,
			ownerId: user.id,
		});

		if (!created) return ERR.DATABASE;
		return created;
	}

	/**
	 * Retrieves the tracker owned by the current user.
	 * @param data - The current user's information.
	 * @returns The tracker object if found, or an error code if not found.
	 */
	public async getOwned(data: ICurrentUser) {
		// Prepare props object based on the user's type
		const props: {googleId?: string; id?: string} = {};
		if (data.type === `google`) props.googleId = data.id;
		if (data.type === `local`) props.id = data.id;

		// Retrieve the user
		const user = await this.userService.get(props);
		if (!user) return ERR.USER_NOT_FOUND;

		// Retrieve the tracker associated with the user
		const tracker = await this.trackerModel.findOne({owner: user._id});

		if (!tracker) return ERR.TRACKER_NOT_FOUND;
		return tracker;
	}

	/**
	 * Updates the tracker based on the given data and user information.
	 *
	 * @param data - The data for updating the tracker.
	 * @param userData - The user information.
	 * @returns The updated tracker if successful, otherwise an error code.
	 */
	public async updateTracker(data: TrackerUpdateDTO, userData: ICurrentUser) {
		// Prepare props object based on the user's type
		const props: {googleId?: string; id?: string} = {};
		if (userData.type === `google`) props.googleId = userData.id;
		if (userData.type === `local`) props.id = userData.id;

		// Retrieve the user
		const user = await this.userService.get(props);
		if (!user) return ERR.USER_NOT_FOUND;

		// Retrieve the tracker associated with the user
		const tracker = await this.trackerModel.findOne({owner: user._id});

		// If tracker is not found, return error
		if (!tracker) return ERR.TRACKER_NOT_FOUND;

		// Update the tracker
		const updated = await this.trackerModel.findOneAndUpdate(
			{
				where: {id: tracker.id},
			},
			{$set: data}
		);

		// If tracker is not updated, return error
		if (!updated) return ERR.DATABASE;

		// Return the updated tracker
		return updated;
	}

	/**
	 * Deletes the tracker based on the given user information.
	 *
	 * @param id - The tracker's id.
	 * @param userData - The user information.
	 * @returns OK if successfuly deleted, otherwise an error code.
	 */
	public async removeTracker(id: string, userData: ICurrentUser) {
		// Prepare props object based on the user's type
		const props: {googleId?: string; id?: string} = {};
		if (userData.type === `google`) props.googleId = userData.id;
		if (userData.type === `local`) props.id = userData.id;

		// Retrieve the user
		const user = await this.userService.get(props);
		if (!user) return ERR.USER_NOT_FOUND;

		// Retrieve the tracker associated with the user
		const tracker = await this.trackerModel.findOne({
			owner: user._id,
			_id: id,
		});

		// If tracker is not found, return error
		if (!tracker) return ERR.TRACKER_NOT_FOUND;

		// Delete the spends
		for (const spend of tracker.spends) {
			await this.spendModel.findOneAndDelete({_id: spend._id});
		}

		// Delete the tracker
		await this.trackerModel.findOneAndDelete({
			_id: tracker._id,
		});

		return `OK`;
	}

	/* SPENDS */

	/**
	 * Create a spend entry.
	 *
	 * @param data - The spend data.
	 * @param user - The current user.
	 * @returns The created spend entry, or an error.
	 */
	public async createSpend(data: SpendCreateDTO, user: ICurrentUser) {
		// Retrieve the tracker owned by the user
		const tracker = await this.getOwned(user);

		// If tracker is not found, return error
		if (!tracker || tracker === ERR.TRACKER_NOT_FOUND) return ERR.TRACKER_NOT_FOUND;

		// If the user is not found, return the error
		if (tracker === ERR.USER_NOT_FOUND) return tracker;

		// Create the spend entry
		const created = this.spendModel.create({
			cost: data.cost,
			category: data.category,
			description: data.description,
			date: data.date,
			tracker: tracker._id,
		});

		// If the spend entry is not created, return error
		if (!created) return ERR.DATABASE;

		// Return the created spend entry
		return created;
	}

	/**
	 * Updates the spend entry.
	 *
	 * @param id - The spend's id.
	 * @param data - The updated spend data.
	 * @param user - The current user.
	 * @returns The updated spend entry, or an error.
	 */
	public async updateSpend(id: string, data: SpendUpdateDTO, user: ICurrentUser) {
		// Retrieve the tracker owned by the user
		const tracker = await this.getOwned(user);

		// If tracker is not found, return error
		if (!tracker || tracker === ERR.TRACKER_NOT_FOUND) return ERR.TRACKER_NOT_FOUND;

		// If the user is not found, return the error
		if (tracker === ERR.USER_NOT_FOUND) return tracker;

		// Update the spend entry
		const updated = this.spendModel.findOneAndUpdate(
			{
				_id: id,
			},
			{
				$set: {
					cost: data.cost,
					category: data.category,
					description: data.description,
					date: data.date,
					createdAt: new Date(data.createdAt),
				},
			}
		);

		// If the spend entry is not updated, return error
		if (!updated) return ERR.DATABASE;

		// Return the updated spend entry
		return updated;
	}

	/**
	 * Deletes the spend based on the given user information.
	 *
	 * @param id - The spend's id.
	 * @param user - The current user.
	 * @returns OK if successfuly deleted, otherwise an error code.
	 */
	public async removeSpend(id: string, user: ICurrentUser) {
		// Retrieve the tracker owned by the user
		const tracker = await this.getOwned(user);

		// If tracker is not found, return error
		if (!tracker || tracker === ERR.TRACKER_NOT_FOUND) return ERR.TRACKER_NOT_FOUND;

		// If the user is not found, return the error
		if (tracker === ERR.USER_NOT_FOUND) return tracker;

		// Delete the spend entry
		await this.spendModel.findOneAndDelete({
			_id: id,
		});

		return `OK`;
	}
}
