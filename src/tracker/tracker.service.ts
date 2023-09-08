import {Injectable} from "@nestjs/common";
import {PrismaService} from "src/database/prisma.service";
import {UserService} from "src/user/user.service";
import {TrackerCreateDTO} from "./dto/create.dto";
import {ICurrentUser} from "src/decorators/user.decorator";
import {ERR} from "src/enums/error.enum";

@Injectable()
export class TrackerService {
	constructor(private prisma: PrismaService, private userService: UserService) {}

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
}
