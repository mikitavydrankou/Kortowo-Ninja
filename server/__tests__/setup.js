import { jest } from '@jest/globals';

beforeEach(() => {
	jest.clearAllMocks();
});

afterEach(() => {
	jest.resetAllMocks();
});

export { flushPromises } from './helpers/test-utils.js';