import {Controller} from "@nestjs/common";
import {DarkService} from "./dark.service";

@Controller(`/dark`)
export class DarkController {
	constructor(private readonly darkService: DarkService) {}
}
