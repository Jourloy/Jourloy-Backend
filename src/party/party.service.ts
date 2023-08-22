import {Injectable} from "@nestjs/common";
import {Prisma} from "@prisma/client";
import {PrismaService} from "src/database/prisma.service";
import {ICurrentUser} from "src/decorators/user.decorator";
import {ERR} from "src/enums/error.enum";
import {UserService} from "src/user/user.service";

@Injectable()
export class PartyService {
	constructor(private prisma: PrismaService, private userService: UserService) {}

	private async _getCalculator(query: Prisma.CalculatorWhereInput) {
		const calculator = await this.prisma.calculator.findFirst({
			where: query,
			include: {positions: true, members: true},
		});
		if (!calculator) return null;

		return calculator;
	}

	private async _getPosition(query: Prisma.PositionWhereInput) {
		const position = await this.prisma.position.findFirst({where: query});
		if (!position) return null;

		return position;
	}

	private async _getMember(query: Prisma.MemberWhereInput) {
		const member = await this.prisma.member.findFirst({where: query});
		if (!member) return null;

		return member;
	}

	private async _updateCalculator(
		where: Prisma.CalculatorWhereUniqueInput,
		data: Prisma.CalculatorUpdateInput
	) {
		const updated = await this.prisma.calculator.update({where, data});
		if (!updated) return ERR.DATABASE;
		return updated;
	}

	async createCalculator(userData: ICurrentUser) {
		const props: {googleId?: string; id?: number} = {};
		if (userData.type === `google`) props.googleId = userData.id;
		if (userData.type === `local`) props.id = userData.id;

		const user = await this.userService.get(props);
		if (!user) return ERR.USER_NOT_FOUND;

		const calculator = await this._getCalculator({ownerId: user.id});
		if (calculator) return ERR.CALC_EXIST;

		const created = await this.prisma.calculator.create({
			data: {
				name: `Party калькулятор`,
				ownerId: user.id,
			},
		});

		if (!created) return ERR.DATABASE;
		return created;
	}

	async getCalculator(userData: ICurrentUser) {
		const props: {googleId?: string; id?: number} = {};
		if (userData.type === `google`) props.googleId = userData.id;
		if (userData.type === `local`) props.id = userData.id;

		const user = await this.userService.get(props);
		if (!user) return ERR.USER_NOT_FOUND;

		const calculator = await this._getCalculator({ownerId: user.id});
		if (!calculator) return ERR.CALC_NOT_FOUND;

		return calculator;
	}

	// async updateCalculator() {}

	// async removeCalculator() {}

	// async getOwnedCalculators() {}

	async createMember(
		data: {name: string; calculatorId: number},
		userData: ICurrentUser
	) {
		const props: {googleId?: string; id?: number} = {};
		if (userData.type === `google`) props.googleId = userData.id;
		if (userData.type === `local`) props.id = userData.id;

		const user = await this.userService.get(props);
		if (!user) return ERR.USER_NOT_FOUND;

		const calculator = await this._getCalculator({
			ownerId: user.id,
			id: data.calculatorId,
		});
		if (!calculator) return ERR.CALC_NOT_FOUND;

		const created = await this.prisma.member.create({
			data: {
				name: data.name,
				avatar: `https://avatars.dicebear.com/api/identicon/${data.name}.svg`,
				calculatorId: data.calculatorId,
			},
		});

		if (!created) return ERR.DATABASE;
		return created;
	}

	async getMembers(calculatorId: number, userData: ICurrentUser) {
		const props: {googleId?: string; id?: number} = {};
		if (userData.type === `google`) props.googleId = userData.id;
		if (userData.type === `local`) props.id = userData.id;

		const user = await this.userService.get(props);
		if (!user) return ERR.USER_NOT_FOUND;

		const calculator = await this._getCalculator({
			ownerId: user.id,
			id: calculatorId,
		});
		if (!calculator) return ERR.CALC_NOT_FOUND;

		return await this.prisma.member.findMany({where: {calculatorId: calculatorId}});
	}

	// async getMember() {}

	// async updateMember() {}

	async removeMember(memberId: number, userData: ICurrentUser) {
		const member = await this._getMember({id: memberId});

		const props: {googleId?: string; id?: number} = {};
		if (userData.type === `google`) props.googleId = userData.id;
		if (userData.type === `local`) props.id = userData.id;

		const user = await this.userService.get(props);
		if (!user) return ERR.USER_NOT_FOUND;

		const calculator = await this._getCalculator({
			ownerId: user.id,
			id: member.calculatorId,
		});
		if (!calculator) return ERR.CALC_NOT_FOUND;

		await this.prisma.member.delete({where: member});

		return `OK`;
	}

	async removeMembers(calculatorId: number, userData: ICurrentUser) {
		const props: {googleId?: string; id?: number} = {};
		if (userData.type === `google`) props.googleId = userData.id;
		if (userData.type === `local`) props.id = userData.id;

		const user = await this.userService.get(props);
		if (!user) return ERR.USER_NOT_FOUND;

		const calculator = await this._getCalculator({
			ownerId: user.id,
			id: calculatorId,
		});
		if (!calculator) return ERR.CALC_NOT_FOUND;

		for (const member of calculator.members) {
			await this.prisma.member.delete({where: member});
		}

		return `OK`;
	}

	async createPosition(data: {calculatorId: number, name: string, cost: number, memberIds?: number[]}, userData: ICurrentUser) {
		const props: {googleId?: string; id?: number} = {};
		if (userData.type === `google`) props.googleId = userData.id;
		if (userData.type === `local`) props.id = userData.id;

		const user = await this.userService.get(props);
		if (!user) return ERR.USER_NOT_FOUND;

		const calculator = await this._getCalculator({
			ownerId: user.id,
			id: data.calculatorId,
		});
		if (!calculator) return ERR.CALC_NOT_FOUND;

		const created = await this.prisma.position.create({data: data});

		if (!created) return ERR.DATABASE;
		return created;
	}
}
