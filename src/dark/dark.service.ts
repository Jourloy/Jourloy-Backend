import {Injectable, Logger} from "@nestjs/common";
import {PrismaService} from "src/database/prisma.service";
import {CreateAttributeDTO, UpdateAttributeDTO} from "./dto/attribute.dto";
import {ERR} from "src/enums/error.enum";
import {CreateClassDTO, UpdateClassDTO} from "./dto/class.dto";
import {CreateLevelDTO, UpdateLevelDTO} from "./dto/level.dto";

@Injectable()
export class DarkService {
	constructor(private prisma: PrismaService) {}

	private readonly logger = new Logger(DarkService.name);

	// Attributes //

	public async getOneAttribute(id: number) {
		return await this.prisma.darkAttribute.findUnique({where: {id}});
	}

	public async getAllAttributes() {
		return await this.prisma.darkAttribute.findMany();
	}

	public async createAttribute(props: CreateAttributeDTO) {
		const attribute = await this.prisma.darkAttribute.findFirst({where: {enName: props.enName}});
		if (attribute) return ERR.DARK_ATTRIBUTE_EXIST;

		const created = await this.prisma.darkAttribute.create({data: props});
		if (!created) return ERR.DATABASE;

		return created;
	}

	public async updateAttribute(id: number, props: UpdateAttributeDTO) {
		const attribute = await this.prisma.darkAttribute.findUnique({where: {id}});
		if (!attribute) return ERR.DARK_ATTRIBUTE_NOT_FOUND;

		const updated = await this.prisma.darkAttribute.update({where: {id}, data: props});
		if (!updated) return ERR.DATABASE;

		return updated;
	}

	public async deleteAttribute(id: number) {
		const attribute = await this.prisma.darkAttribute.findUnique({where: {id}});
		if (!attribute) return ERR.DARK_ATTRIBUTE_NOT_FOUND;

		const deleted = await this.prisma.darkAttribute.delete({where: {id}});
		if (!deleted) return ERR.DATABASE;

		return deleted;
	}

	// Classes //

	public async getOneClass(id: number) {
		return await this.prisma.darkClass.findUnique({where: {id}});
	}

	public async getAllClasses() {
		return await this.prisma.darkClass.findMany();
	}

	public async createClass(props: CreateClassDTO) {
		const attribute = await this.prisma.darkClass.findFirst({where: {enName: props.enName}});
		if (attribute) return ERR.DARK_CLASS_EXIST;

		const created = await this.prisma.darkClass.create({data: props});
		if (!created) return ERR.DATABASE;

		return created;
	}

	public async updateClass(id: number, props: UpdateClassDTO) {
		const attribute = await this.prisma.darkClass.findUnique({where: {id}});
		if (!attribute) return ERR.DARK_CLASS_NOT_FOUND;

		const updated = await this.prisma.darkClass.update({where: {id}, data: props});
		if (!updated) return ERR.DATABASE;

		return updated;
	}

	public async deleteClass(id: number) {
		const attribute = await this.prisma.darkClass.findUnique({where: {id}});
		if (!attribute) return ERR.DARK_CLASS_NOT_FOUND;

		const deleted = await this.prisma.darkClass.delete({where: {id}});
		if (!deleted) return ERR.DATABASE;

		return deleted;
	}

	// Levels //

	public async createLevel(props: CreateLevelDTO) {
		const level = await this.prisma.darkAttributeLevel.findFirst({
			where: {depth: props.depth, attributeId: props.attributeId},
		});
		if (level) return ERR.DARK_LEVEL_EXIST;

		const created = await this.prisma.darkAttributeLevel.create({data: props});
		if (!created) return ERR.DATABASE;

		return created;
	}

	public async updateLevel(id: number, props: UpdateLevelDTO) {
		const level = await this.prisma.darkAttributeLevel.findUnique({where: {id}});
		if (!level) return ERR.DARK_LEVEL_NOT_FOUND;

		const updated = await this.prisma.darkAttributeLevel.update({where: {id}, data: props});
		if (!updated) return ERR.DATABASE;

		return updated;
	}

	public async deleteLevel(id: number) {
		const level = await this.prisma.darkAttributeLevel.findUnique({where: {id}});
		if (!level) return ERR.DARK_LEVEL_NOT_FOUND;

		const deleted = await this.prisma.darkAttributeLevel.delete({where: {id}});
		if (!deleted) return ERR.DATABASE;

		return deleted;
	}
}
