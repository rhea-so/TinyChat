import Runtime from 'runtime';
import { IHealthCheckRequest } from './IHealthCheck.request';
import { IHealthCheckResponse } from './IHealthCheck.response';

Runtime.get('/', async (req, res) => {
	const request: IHealthCheckRequest = req.query;
	const response: IHealthCheckResponse = {
		status: 'ok',
		received: request
	};
	res.json(response);
});