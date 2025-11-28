import { jest } from '@jest/globals';
import { startContainer, stopContainer } from './setup.js';
import { createMockRequest, createMockResponse, createNext } from '../helpers/test-utils.js';

jest.setTimeout(60000);

let db;
let offerController;
let user;

beforeAll(async () => {
    await startContainer();
    const mod = await import('../../app/models/index.js');
    db = mod.default;

    await db.sequelize.sync({ force: true });

    offerController = await import('../../app/controllers/offer.controller.js');

    user = await db.User.create({
        username: 'offer_user',
        password: 'ValidPass123!',
        roleId: 1,
        link: 'https://facebook.com/testuser'
    });
}, 120000);

afterAll(async () => {
    await db.sequelize.close();
    await stopContainer();
});

describe('Offer Integration', () => {
    test('should create a new offer', async () => {
        const req = createMockRequest({
            body: {
                title: 'Integration Offer',
                description: 'Testing with real DB',
                ttlHours: 24,
                place: 'DS1'
            },
            user: { id: user.id }
        });
        const res = createMockResponse();
        const next = jest.fn();

        await offerController.createOffer(req, res, next);

        if (next.mock.calls.length > 0) {
            throw next.mock.calls[0][0];
        }

        expect(res.status).toHaveBeenCalledWith(201);
        const offer = await db.Offer.findOne({ where: { title: 'Integration Offer' } });
        expect(offer).not.toBeNull();
        expect(offer.userId).toBe(user.id);
    });

    test('should fetch active offers', async () => {
        const req = createMockRequest();
        const res = createMockResponse();
        const next = jest.fn();

        await offerController.getActiveOffers(req, res, next);

        if (next.mock.calls.length > 0) {
            throw next.mock.calls[0][0];
        }

        expect(res.status).toHaveBeenCalledWith(200);
        const responseData = res.json.mock.calls[0][0];
        expect(Array.isArray(responseData)).toBe(true);
        expect(responseData.length).toBeGreaterThan(0);
        expect(responseData[0].title).toBe('Integration Offer');
    });
});
