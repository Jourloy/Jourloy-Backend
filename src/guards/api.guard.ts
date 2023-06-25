/* eslint-disable no-unreachable */
import {
	CanActivate,
	ExecutionContext,
	Injectable,
} from '@nestjs/common';
import {Observable} from 'rxjs';

@Injectable()
export class ApiGuard implements CanActivate {
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {

		const headers = context.switchToHttp().getRequest().headers;
		
		if (headers && headers[`api_key`]) {
			if (headers[`api_key`] === process.env.API_KEY) return true;
		}

		return false;
	}
}
