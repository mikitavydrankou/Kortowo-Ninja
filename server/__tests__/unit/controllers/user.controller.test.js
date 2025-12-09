import { jest } from '@jest/globals';
import {
  flushPromises,
  createMockRequest,
  createMockResponse,
  createNext
} from '../../helpers/test-utils.js';
import { createDbMock, createLoggerMock } from '../../mocks/index.js';

const mockDb = createDbMock();
const mockOffer = mockDb._mockOffer;
const mockUser = mockDb._mockUser;
const mockRole = mockDb._mockRole;
const mockSequelizeFns = mockDb._sequelizeFns;
const mockLogger = createLoggerMock();

jest.unstable_mockModule('../../../app/models/index.js', () => ({ default: mockDb }));
jest.unstable_mockModule('../../../app/config/logger.js', () => ({ default: mockLogger }));

const {
  leaderboard,
  users,
  getUserActiveOffers,
  getUserArchivedOffers,
  getUserById,
  deleteUser,
  updateUser,
  updateUserRole,
  usersCount
} = await import('../../../app/controllers/user.controller.js');

describe('User Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = createMockRequest({
      user: { id: 10, username: 'current', role: 'user' }
    });
    res = createMockResponse();
  });

  const expectForbidden = () => {
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Permission denied' });
  };


  describe('leaderboard', () => {
    test('returns top users data', async () => {
      const topUsers = [{ userId: 1, offerCount: 3 }];
      mockOffer.findAll.mockResolvedValueOnce(topUsers);
      await leaderboard(req, res, createNext());
      await flushPromises();

      expect(mockOffer.findAll).toHaveBeenCalledWith(expect.objectContaining({
        attributes: expect.any(Array),
        where: expect.objectContaining({ status: ['active', 'archived'] }),
        group: expect.arrayContaining(['offers.userId']),
        order: expect.any(Array),
        limit: 3
      }));
      expect(mockSequelizeFns.fn.mock.calls[0][0]).toBe('COUNT');
      expect(mockSequelizeFns.col).toHaveBeenCalledWith('offers.id');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: topUsers });
    });
  });

  describe('getUserById', () => {
    test('returns user when found', async () => {
      req.user.role = 'admin';
      req.params = { id: '50' };
      const user = { id: 50 };
      mockUser.findByPk.mockResolvedValueOnce(user);

      await getUserById(req, res);
      await flushPromises();

      expect(mockUser.findByPk).toHaveBeenCalledWith('50', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });
  });

  describe('updateUser', () => {
    test('updates user profile', async () => {
      req.user.role = 'admin';
      req.params = { id: '11' };
      req.body = { username: 'new', link: 'link' };
      const update = jest.fn();
      const userInstance = { id: '11', update };
      mockUser.findByPk.mockResolvedValueOnce(userInstance);

      await updateUser(req, res);
      await flushPromises();

      expect(update).toHaveBeenCalledWith({ username: 'new', link: 'link' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(userInstance);
    });
  });
});
