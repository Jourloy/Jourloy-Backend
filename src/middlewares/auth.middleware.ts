import {Injectable, Logger, NestMiddleware} from "@nestjs/common";
import {Request, Response} from "express";
import jwt from "jsonwebtoken";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	private logger = new Logger(AuthMiddleware.name);

	use(req: Request, res: Response, next: () => void) {
		let token = null;
		const headers = req.headers;
		const l = {
			id: ``,
			type: ``,
			access: ``,
		};

		if (headers && headers[`authorization`]) {
			if (
				headers[`authorization`].split(` `)[0] === `Bearer` &&
				headers[`authorization`].split(` `)[1] != null
			) {
				token = headers[`authorization`].split(` `)[1];
			}
		}

		if (token) {
			try {
				const decode = jwt.verify(token, process.env.SECRET);
				l.id = decode[`id`];
				l.access = token;
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
