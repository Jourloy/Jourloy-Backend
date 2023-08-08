import {Injectable, Logger, NestMiddleware} from "@nestjs/common";
import {Request, Response} from "express";
import jwt from "jsonwebtoken";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	private logger = new Logger(AuthMiddleware.name);

	use(req: Request, res: Response, next: () => void) {
		const cookies = req.cookies;

		let accessToken = null;
		const l = {
			id: ``,
			type: ``,
			access: ``,
			refresh: ``,
		};

		if (cookies && cookies[`authorization`]) {
			if (cookies[`authorization`]) {
				accessToken = cookies[`authorization`];
			}
		}

		if (cookies && cookies[`authorization_refresh`]) {
			if (cookies[`authorization_refresh`]) {
				l.refresh = cookies[`authorization_refresh`];
			}
		}

		if (accessToken) {
			try {
				const decode = jwt.verify(accessToken, process.env.SECRET);
				l.id = decode[`id`];
				l.access = accessToken;
				l.type = decode[`type`];
				res.locals = l;
				next();
			} catch (e) {
				this.logger.error(e);
				res.locals = l;
				next();
			}
		} else next();
	}
}
