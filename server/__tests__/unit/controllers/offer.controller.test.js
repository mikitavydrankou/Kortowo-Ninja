import { jest } from '@jest/globals';
import {
  flushPromises,
  createMockRequest,
  createMockResponse,
  createNext
} from '../../helpers/test-utils.js';
import {
  createDbMock,
  createLoggerMock
} from '../../mocks/index.js';

const mockDb = createDbMock();
const mockLogger = createLoggerMock();
const mockOffer = mockDb._mockOffer;
const mockUser = mockDb._mockUser;

jest.unstable_mockModule('../../../app/models/index.js', () => ({ default: mockDb }));
jest.unstable_mockModule('../../../app/config/logger.js', () => ({ default: mockLogger }));

const {
  getActiveOffers,
  getArchivedOffers,
  createOffer,
  deleteOffer,
  updateOffer,
  fetchOfferById,
  countAllOffers
} = await import('../../../app/controllers/offer.controller.js');

describe('Offer Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = createMockRequest({
      user: { id: 42, username: 'alice', role: 'user' }
    });
    res = createMockResponse();
  });

  describe('getActiveOffers', () => {
    test('returns active offers with expected query', async () => {
      const offers = [{ id: 1 }];
      mockOffer.findAll.mockResolvedValueOnce(offers);
      const next = createNext();

      await getActiveOffers(req, res, next);
      await flushPromises();

      expect(mockOffer.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ status: expect.any(String) }),
        include: expect.any(Array),
        order: [['createdAt', 'DESC']]
      }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(offers);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('getArchivedOffers', () => {
    test('returns archived offers with expected query', async () => {
      const offers = [{ id: 3 }];
      mockOffer.findAll.mockResolvedValueOnce(offers);
      const next = createNext();

      await getArchivedOffers(req, res, next);
      await flushPromises();

      expect(mockOffer.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ status: expect.any(String) }),
        include: expect.any(Array),
        order: [['createdAt', 'DESC']]
      }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(offers);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('createOffer', () => {
    test('validates required fields', async () => {
      req.body = { title: '', description: '', ttlHours: '', place: '' };
      const next = createNext();

      createOffer(req, res, next);
      await flushPromises();

      expect(next).toHaveBeenCalled();
      expect(mockOffer.create).not.toHaveBeenCalled();
    });

    test('validates ttlHours as positive number', async () => {
      req.body = {
        title: 'title',
        description: 'desc',
        ttlHours: 'abc',
        place: 'place'
      };
      const next = createNext();

      createOffer(req, res, next);
      await flushPromises();

      expect(next).toHaveBeenCalled();
      expect(mockOffer.create).not.toHaveBeenCalled();
    });

    test('creates offer and logs action', async () => {
      const now = Date.now;
      Date.now = () => 1000;
      req.body = {
        title: 'New offer',
        description: 'Great offer',
        ttlHours: 2,
        place: 'Downtown',
        counter_offer: 'Maybe'
      };
      mockOffer.create.mockResolvedValueOnce({ id: 1, title: 'New offer' });
      const next = createNext();

      await createOffer(req, res, next);
      await flushPromises();

      expect(mockOffer.create).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New offer',
        description: 'Great offer',
        ttlHours: 2,
        userId: 42,
        status: expect.any(String),
        expiresAt: expect.any(Date)
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
      expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('alice'), expect.any(Object));
      expect(next).not.toHaveBeenCalled();
      Date.now = now;
    });
  });

  describe('deleteOffer', () => {
    test('throws when offer not found', async () => {
      mockOffer.findByPk.mockResolvedValueOnce(null);
      const next = createNext();

      deleteOffer(req, res, next);
      await flushPromises();

      expect(next).toHaveBeenCalled();
    });

    test('throws when user is not owner and not admin/moderator', async () => {
      mockOffer.findByPk.mockResolvedValueOnce({ id: 2, userId: 13 });
      const next = createNext();

      deleteOffer(req, res, next);
      await flushPromises();

      expect(next).toHaveBeenCalled();
    });

    test('deletes offer and logs action', async () => {
      const destroy = jest.fn();
      mockOffer.findByPk.mockResolvedValueOnce({ id: 2, userId: 42, title: 'Temp', destroy });
      const next = createNext();

      await deleteOffer(req, res, next);
      await flushPromises();

      expect(destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Offer deleted successfully' });
      expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('alice'), expect.any(Object));
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('updateOffer', () => {
    test('throws when offer not found', async () => {
      mockOffer.findByPk.mockResolvedValueOnce(null);
      const next = createNext();

      updateOffer(req, res, next);
      await flushPromises();

      expect(next).toHaveBeenCalled();
    });

    test('throws when user cannot access offer', async () => {
      mockOffer.findByPk.mockResolvedValueOnce({ id: 3, userId: 99 });
      const next = createNext();

      updateOffer(req, res, next);
      await flushPromises();

      expect(next).toHaveBeenCalled();
    });

    test('updates offer and logs action', async () => {
      const update = jest.fn().mockResolvedValue({ id: 3, title: 'Updated' });
      mockOffer.findByPk.mockResolvedValueOnce({ id: 3, userId: 42, title: 'Old', update });
      const next = createNext();

      await updateOffer(req, res, next);
      await flushPromises();

      expect(update).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 3, title: 'Updated' });
      expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('alice'), expect.any(Object));
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('fetchOfferById', () => {
    test('throws when offer missing', async () => {
      mockOffer.findByPk.mockResolvedValueOnce(null);
      const next = createNext();
      req.params = { id: 10 };

      fetchOfferById(req, res, next);
      await flushPromises();

      expect(next).toHaveBeenCalled();
    });

    test('returns offer when found', async () => {
      const offer = { id: 5 };
      mockOffer.findByPk.mockResolvedValueOnce(offer);
      const next = createNext();
      req.params = { id: 5 };

      await fetchOfferById(req, res, next);
      await flushPromises();

      expect(mockOffer.findByPk).toHaveBeenCalledWith(5, expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(offer);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('countAllOffers', () => {
    test('returns offer count', async () => {
      mockOffer.count.mockResolvedValueOnce(9);
      const next = createNext();

      await countAllOffers(req, res, next);
      await flushPromises();

      expect(mockOffer.count).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ count: 9 });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
