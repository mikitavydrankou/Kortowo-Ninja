import { jest } from '@jest/globals';
import { flushPromises, createMockRequest, createMockResponse, createNext } from '../../helpers/test-utils.js';
import { createBcryptMock, createJwtMock, createDbMock, createLoggerMock } from '../../mocks/index.js';

const mockBcrypt = createBcryptMock();
const mockJwt = createJwtMock();
const mockDb = createDbMock();
const mockLogger = createLoggerMock();

const mockUser = mockDb._mockUser;
const mockRole = mockDb._mockRole;

jest.unstable_mockModule('bcrypt', () => ({ default: mockBcrypt }));
jest.unstable_mockModule('jsonwebtoken', () => ({ default: mockJwt }));
jest.unstable_mockModule('../../../app/models/index.js', () => ({ default: mockDb }));
jest.unstable_mockModule('../../../app/config/logger.js', () => ({ default: mockLogger }));

const { signup, signin } = await import('../../../app/controllers/auth.controller.js');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();
  });

  describe('signup', () => {
    test('empty password passes error to next', async () => {
      req.body = { username: 'u1', password: '', link: '' };
      const next = createNext();
      signup(req, res, next);
      await flushPromises();
      expect(next).toHaveBeenCalled();
    });

    test('weak password (too short) passes error to next', async () => {
      req.body = { username: 'u1', password: 'A1!a', link: '' };
      const next = createNext();
      signup(req, res, next);
      await flushPromises();
      expect(next).toHaveBeenCalled();
    });

    test('happy path: creates user, sets cookie and returns user info', async () => {
      req.body = { username: 'alice', password: 'Str0ng!Pass', link: 'link' };

      mockUser.findOne.mockResolvedValue(null);
      mockRole.findOne.mockResolvedValue({ id: 2, name: 'user' });
      mockBcrypt.hash.mockResolvedValue('hashed-pass');
      mockUser.create.mockResolvedValue({ id: 11, username: 'alice', link: 'link' });

  const next = createNext();
      signup(req, res, next);
      await flushPromises();

      expect(mockRole.findOne).toHaveBeenCalled();
      expect(mockBcrypt.hash).toHaveBeenCalledWith('Str0ng!Pass', 8);
      expect(mockUser.create).toHaveBeenCalledWith(expect.objectContaining({ username: 'alice', password: 'hashed-pass', roleId: 2, link: 'link' }));
      expect(mockJwt.sign).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 11, username: 'alice', role: 'user', link: 'link' }));
      expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('alice'));
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('signin', () => {
    test('happy path: signs in and returns user info', async () => {
      req.body = { username: 'bob', password: 'mypassword' };

      mockUser.findOne.mockResolvedValue({ id: 7, username: 'bob', password: 'hashed', role: { name: 'user' }, link: 'some-link' });
      mockBcrypt.compare.mockResolvedValue(true);

  const next = createNext();
      signin(req, res, next);
      await flushPromises();

      expect(mockUser.findOne).toHaveBeenCalledWith(expect.objectContaining({ where: { username: 'bob' } }));
      expect(mockBcrypt.compare).toHaveBeenCalledWith('mypassword', 'hashed');
      expect(mockJwt.sign).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 7, username: 'bob', role: 'user', link: 'some-link' }));
      expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('bob'));
      expect(next).not.toHaveBeenCalled();
    });

    test('wrong password calls next with error', async () => {
      req.body = { username: 'bob', password: 'bad' };
  const next = createNext();

      mockUser.findOne.mockResolvedValue({ id: 7, username: 'bob', password: 'hashed', role: { name: 'user' }, link: 'some-link' });
      mockBcrypt.compare.mockResolvedValue(false);

      signin(req, res, next);
      await flushPromises();

      expect(next).toHaveBeenCalled();
    });
  });
});