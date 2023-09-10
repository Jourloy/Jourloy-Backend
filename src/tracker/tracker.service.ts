import {Injectable} from "@nestjs/common";
import {PrismaService} from "src/database/prisma.service";
import {UserService} from "src/user/user.service";
import {TrackerCreateDTO, TrackerUpdateDTO} from "./dto/tracker.dto";
import {ICurrentUser} from "src/decorators/user.decorator";
import {ERR} from "src/enums/error.enum";
import {SpendCreateDTO} from "./dto/spend.dto";

@Injectable()
export class TrackerService {
	constructor(private prisma: PrismaService, private userService: UserService) {}

	/* TRACKER */

	/**
	 * Creates a tracker based on the given data and user information.
	 * @param data - The data for creating the tracker.
	 * @param userData - The user information.
	 * @returns The created tracker if successful, otherwise an error code.
	 */
	public async createTracker(data: TrackerCreateDTO, userData: ICurrentUser) {
		// Determine the props based on the user type
		const props: {googleId?: string; id?: number} = {};
		if (userData.type === `google`) props.googleId = userData.id;
		if (userData.type === `local`) props.id = userData.id;

		// Retrieve the user based on the props
		const user = await this.userService.get(props);
		if (!user) return ERR.USER_NOT_FOUND;

		// Check if a tracker already exists for the user
		const tracker = await this.prisma.tracker.findFirst({where: {ownerId: user.id}});
		if (tracker) return ERR.TRACKER_EXIST;

		// Create the tracker
		const created = await this.prisma.tracker.create({
			data: {
				name: `Личный трекер`,
				limit: data.limit,
				dayLimit: data.dayLimit,
				startLimit: data.limit,
				months: data.months,
				calc: data.calc,
				ownerId: user.id,
			},
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
		const props: {googleId?: string; id?: number} = {};
		if (data.type === `google`) props.googleId = data.id;
		if (data.type === `local`) props.id = data.id;

		// Retrieve the user
		const user = await this.userService.get(props);
		if (!user) return ERR.USER_NOT_FOUND;

		// Retrieve the tracker associated with the user
		const tracker = await this.prisma.tracker.findFirst({
			where: {ownerId: user.id},
			include: {spends: true},
		});

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
		const props: {googleId?: string; id?: number} = {};
		if (userData.type === `google`) props.googleId = userData.id;
		if (userData.type === `local`) props.id = userData.id;

		// Retrieve the user
		const user = await this.userService.get(props);
		if (!user) return ERR.USER_NOT_FOUND;

		// Retrieve the tracker associated with the user
		const tracker = await this.prisma.tracker.findFirst({
			where: {ownerId: user.id},
			include: {spends: true},
		});

		// If tracker is not found, return error
		if (!tracker) return ERR.TRACKER_NOT_FOUND;

		// Update the tracker
		const updated = await this.prisma.tracker.update({
			where: {id: tracker.id},
			data: {
				dayLimit: data.dayLimit,
				calc: data.calc,
				createdAt: new Date(data.startDate),
				limit: data.limit,
			},
			include: {spends: true},
		});

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
	public async removeTracker(id: number, userData: ICurrentUser) {
		// Prepare props object based on the user's type
		const props: {googleId?: string; id?: number} = {};
		if (userData.type === `google`) props.googleId = userData.id;
		if (userData.type === `local`) props.id = userData.id;

		// Retrieve the user
		const user = await this.userService.get(props);
		if (!user) return ERR.USER_NOT_FOUND;

		// Retrieve the tracker associated with the user
		const tracker = await this.prisma.tracker.findFirst({
			where: {ownerId: user.id, id: id},
			include: {spends: true},
		});

		// If tracker is not found, return error
		if (!tracker) return ERR.TRACKER_NOT_FOUND;

		// Delete the spends
		for (const spend of tracker.spends) {
			await this.prisma.spend.delete({
				where: {id: spend.id},
			});
		}

		// Delete the tracker
		await this.prisma.tracker.delete({
			where: {id: tracker.id},
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

		// Check if the required data is provided
		if (!data || !data.cost) return ERR.INCORRECT_DATA;

		// Create the spend entry
		const created = this.prisma.spend.create({
			data: {
				cost: data.cost,
				category: data.category,
				description: data.description,
				date: data.date,
				trackerId: tracker.id,
			},
		});

		// If the spend entry is not created, return error
		if (!created) return ERR.DATABASE;

		// Return the created spend entry
		return created;
	}
}
