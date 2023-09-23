import {Controller, Get, Logger, Res} from "@nestjs/common";
import {AppService} from "./app.service";
import {Response} from "express";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	private logger = new Logger(AppController.name);

	@Get(`/live`)
	async checkLive(@Res() response: Response) {
		this.logger.debug(`Check live`);
		response.status(200).send(`OK`);
	}
}
