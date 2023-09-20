import {Controller, Get, Res, UseGuards} from "@nestjs/common";
import {AdminService} from "./admin.service";
import {CurrentUser, ICurrentUser} from "src/decorators/user.decorator";
import {Response} from "express";
import { JwtGuard } from "src/guards/jwt.guard";
import { RoleGuard } from "src/guards/role.guard";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";

@Controller(`admin`)
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@Get(`/is-admin`)
	@UseGuards(JwtGuard, RoleGuard)
	@Roles(Role.ADMIN)
	async isAdmin(@CurrentUser() user: ICurrentUser, @Res() response: Response) {
		response.status(200).json({isAdmin: true});
	}
}
