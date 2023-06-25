import {Controller} from "@nestjs/common";
import {TrackerService} from "./tracker.service";

@Controller(`tracker`)
export class TrackerController {
	constructor(private readonly trackerService: TrackerService) {}
}
