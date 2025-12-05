import { jest } from '@jest/globals';
import { startContainer, stopContainer } from './setup.js';
import { createMockRequest, createMockResponse, createNext } from '../helpers/test-utils.js';

jest.setTimeout(60000);

let db;
let authController;

beforeAll(async () => {
    await startContainer();
    const mod = await import('../../app/models/index.js');
    db = mod.default;

    await db.sequelize.sync({ force: true });

    authController = await import('../../app/controllers/auth.controller.js');
}, 120000);

afterAll(async () => {
    await db.sequelize.close();
    await stopContainer();
});

describe('Auth Integration', () => {
    test('should register a new user', async () => {
        const req = createMockRequest({
            body: {
                username: 'integration_user',
                password: 'StrongPassword123!',
                link: 'https://facebook.com'
            }
        });
        const res = createMockResponse();
        const next = jest.fn();

        await authController.signup(req, res, next);

        if (next.mock.calls.length > 0) {
            throw next.mock.calls[0][0];
        }

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            username: 'integration_user'
        }));

        const user = await db.User.findOne({ where: { username: 'integration_user' } });
        expect(user).not.toBeNull();
        expect(user.username).toBe('integration_user');
    });

    test('should login with created user', async () => {
        const req = createMockRequest({
            body: {
                username: 'integration_user',
                password: 'StrongPassword123!'
            }
        });
        const res = createMockResponse();
        const next = jest.fn();

        await authController.signin(req, res, next);

        if (next.mock.calls.length > 0) {
            throw next.mock.calls[0][0];
        }

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            username: 'integration_user'
        }));
        expect(res.cookie).toHaveBeenCalled();
    });
});
