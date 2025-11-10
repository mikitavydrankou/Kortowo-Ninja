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
        group: ['userId'],
        order: expect.any(Array),
        limit: 3
      }));
      expect(mockSequelizeFns.fn.mock.calls[0][0]).toBe('COUNT');
      expect(mockSequelizeFns.col).toHaveBeenCalledWith('offers.id');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: topUsers });
    });

    test('handles errors and responds 500', async () => {
      const error = new Error('db issue');
      mockOffer.findAll.mockRejectedValueOnce(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await leaderboard(req, res, createNext());
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error fetching top users',
        error: error.message
      });
      consoleSpy.mockRestore();
    });
  });

  describe('users', () => {
    test('denies access when role not admin or moderator', async () => {
      await users(req, res);
      expectForbidden();
    });

    test('returns users list for admins', async () => {
      req.user.role = 'admin';
      const userList = [{ id: 1 }];
      mockUser.findAll.mockResolvedValueOnce(userList);

      await users(req, res);
      await flushPromises();

      expect(mockUser.findAll).toHaveBeenCalledWith(expect.objectContaining({
        include: expect.any(Array)
      }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(userList);
    });

    test('returns 500 on error', async () => {
      req.user.role = 'admin';
      const error = new Error('db fail');
      mockUser.findAll.mockRejectedValueOnce(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await users(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error while getting users' });
      consoleSpy.mockRestore();
    });
  });

  describe('getUserActiveOffers', () => {
    test('denies when user not owner/admin/moderator', async () => {
      req.params = { userId: '20' };
      await getUserActiveOffers(req, res);
      expectForbidden();
    });

    test('returns offers when authorized', async () => {
      req.user.role = 'admin';
      req.params = { userId: '20' };
      const offers = [{ id: 1 }];
      mockOffer.findAll.mockResolvedValueOnce(offers);

      await getUserActiveOffers(req, res);
      await flushPromises();

      expect(mockOffer.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ userId: '20', status: 'active' }),
        include: expect.any(Array)
      }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(offers);
    });

    test('handles errors with 500', async () => {
      req.user.role = 'admin';
      req.params = { userId: '20' };
      const error = new Error('fetch fail');
      mockOffer.findAll.mockRejectedValueOnce(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await getUserActiveOffers(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to get user active offers' });
      consoleSpy.mockRestore();
    });
  });

  describe('getUserArchivedOffers', () => {
    test('denies when user not owner/admin/moderator', async () => {
      req.params = { userId: '30' };
      await getUserArchivedOffers(req, res);
      expectForbidden();
    });

    test('returns offers when authorized', async () => {
      req.user.role = 'moderator';
      req.params = { userId: '30' };
      const offers = [{ id: 5 }];
      mockOffer.findAll.mockResolvedValueOnce(offers);

      await getUserArchivedOffers(req, res);
      await flushPromises();

      expect(mockOffer.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ userId: '30', status: 'archived' })
      }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(offers);
    });

    test('handles errors with 500', async () => {
      req.user.role = 'moderator';
      req.params = { userId: '30' };
      const error = new Error('archived fail');
      mockOffer.findAll.mockRejectedValueOnce(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await getUserArchivedOffers(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to get user archived offers' });
      consoleSpy.mockRestore();
    });
  });

  describe('getUserById', () => {
    test('denies when unauthorized', async () => {
      req.params = { id: '50' };
      await getUserById(req, res);
      expectForbidden();
    });

    test('returns 404 when user not found', async () => {
      req.user.role = 'admin';
      req.params = { id: '50' };
      mockUser.findByPk.mockResolvedValueOnce(null);

      await getUserById(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

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

    test('handles errors with 500', async () => {
      req.user.role = 'admin';
      req.params = { id: '50' };
      const error = new Error('lookup fail');
      mockUser.findByPk.mockRejectedValueOnce(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await getUserById(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to get user' });
      consoleSpy.mockRestore();
    });
  });

  describe('deleteUser', () => {
    test('returns 404 when user missing', async () => {
      req.params = { id: '7' };
      mockUser.findByPk.mockResolvedValueOnce(null);

      await deleteUser(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    test('destroys user and offers', async () => {
      req.params = { id: '7' };
      const destroy = jest.fn();
      mockUser.findByPk.mockResolvedValueOnce({ id: '7', destroy });

      await deleteUser(req, res);
      await flushPromises();

      expect(mockOffer.destroy).toHaveBeenCalledWith({ where: { userId: '7' } });
      expect(destroy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    test('handles cascading offer deletion errors with 500', async () => {
      req.params = { id: '7' };
      const destroy = jest.fn();
      mockUser.findByPk.mockResolvedValueOnce({ id: '7', destroy });
      const error = new Error('offer delete fail');
      mockOffer.destroy.mockRejectedValueOnce(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await deleteUser(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to delete user' });
      expect(destroy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('handles errors with 500', async () => {
      req.params = { id: '7' };
      const error = new Error('delete fail');
      mockUser.findByPk.mockRejectedValueOnce(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await deleteUser(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to delete user' });
      consoleSpy.mockRestore();
    });
  });

  describe('updateUser', () => {
    test('denies when unauthorized', async () => {
      req.params = { id: '11' };
      await updateUser(req, res);
      expectForbidden();
    });

    test('returns 404 when user missing', async () => {
      req.user.role = 'admin';
      req.params = { id: '11' };
      mockUser.findByPk.mockResolvedValueOnce(null);

      await updateUser(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

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

    test('handles errors with 500', async () => {
      req.user.role = 'admin';
      req.params = { id: '11' };
      const error = new Error('update fail');
      mockUser.findByPk.mockRejectedValueOnce(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await updateUser(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to update profile' });
      consoleSpy.mockRestore();
    });
  });

  describe('updateUserRole', () => {
    test('returns 404 when user not found', async () => {
      req.params = { id: '9' };
      mockUser.findByPk.mockResolvedValueOnce(null);

      await updateUserRole(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found!' });
    });

    test('returns 400 when role missing', async () => {
      req.params = { id: '9' };
      req.body = { role: 'admin' };
      mockUser.findByPk.mockResolvedValueOnce({ id: '9', update: jest.fn() });
      mockRole.findOne.mockResolvedValueOnce(null);

      await updateUserRole(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Role does not exist' });
    });

    test('updates user role when role exists', async () => {
      req.params = { id: '9' };
      req.body = { role: 'admin' };
      const update = jest.fn();
      mockUser.findByPk.mockResolvedValueOnce({ id: '9', update });
      mockRole.findOne.mockResolvedValueOnce({ id: 2 });

      await updateUserRole(req, res);
      await flushPromises();

      expect(update).toHaveBeenCalledWith({ roleId: 2 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User role updated successfully' });
    });

    test('handles errors with 500', async () => {
      req.params = { id: '9' };
      const error = new Error('role update fail');
      mockUser.findByPk.mockRejectedValueOnce(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await updateUserRole(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to update role' });
      consoleSpy.mockRestore();
    });

    test('returns 500 when role lookup throws', async () => {
      req.params = { id: '9' };
      req.body = { role: 'admin' };
      const update = jest.fn();
      mockUser.findByPk.mockResolvedValueOnce({ id: '9', update });
      const error = new Error('role lookup fail');
      mockRole.findOne.mockRejectedValueOnce(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await updateUserRole(req, res);
      await flushPromises();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to update role' });
      expect(update).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('usersCount', () => {
    test('returns total user count', async () => {
      mockUser.count.mockResolvedValueOnce(12);

      await usersCount(req, res);
      await flushPromises();

      expect(mockUser.count).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ count: 12 });
    });

    test('returns 500 when count fails', async () => {
      const error = new Error('count fail');
      mockUser.count.mockRejectedValueOnce(error);

      await usersCount(req, res);
      await flushPromises();

      expect(mockUser.count).toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('User count error'));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to get user count' });
    });
  });
});
