import { jest } from '@jest/globals';

export const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

export const createMockRequest = (overrides = {}) => ({
	body: {},
	params: {},
	query: {},
	cookies: {},
	headers: {},
	...overrides
});

export const createMockResponse = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	res.cookie = jest.fn().mockReturnValue(res);
	res.clearCookie = jest.fn().mockReturnValue(res);
	res.send = jest.fn().mockReturnValue(res);
	return res;
};

export const createNext = () => jest.fn();