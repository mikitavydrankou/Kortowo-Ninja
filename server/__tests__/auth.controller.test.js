import { jest } from '@jest/globals';

// Helper to wait for asyncHandler's internal promise chain to settle
const flushPromises = () => new Promise((resolve) => setImmediate(resolve));
const mockUser = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockRole = {
  findOne: jest.fn(),
};

const mockDb = {
  default: {
    User: mockUser,
    Role: mockRole,
  },
};

const mockBcrypt = {
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
};

const mockJwt = {
  default: {
    sign: jest.fn(() => 'signed-token'),
  },
};

const mockLogger = { default: { info: jest.fn() } };

let controllerModule;
let signout, signup, signin;

beforeAll(async () => {
  await jest.unstable_mockModule('../app/models/index.js', () => mockDb);
  await jest.unstable_mockModule('bcrypt', () => mockBcrypt);
  await jest.unstable_mockModule('jsonwebtoken', () => mockJwt);
  await jest.unstable_mockModule('../app/config/logger.js', () => mockLogger);

  controllerModule = await import('../app/controllers/auth.controller.js');
  signout = controllerModule.signout;
  signup = controllerModule.signup;
  signin = controllerModule.signin;
});

describe('auth.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup password validation via errors', () => {
    test('empty password passes error to next', async () => {
      const req = { body: { username: 'u1', password: '', link: '' } };
      const res = { cookie: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      signup(req, res, next);
      await flushPromises();
      expect(next).toHaveBeenCalled();
    });

    test('weak password (too short) passes error to next', async () => {
      const req = { body: { username: 'u1', password: 'A1!a', link: '' } };
      const res = { cookie: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      signup(req, res, next);
      await flushPromises();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('signout', () => {
    test('clears cookie and returns success message', () => {
      const req = {};
      const res = {
        clearCookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      signout(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('token');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Wyloguj się pomyślnie' });
    });
  });

  describe('signup', () => {
    test('happy path: creates user, sets cookie and returns user info', async () => {
      const req = { body: { username: 'alice', password: 'Str0ng!Pass', link: 'link' } };
      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      mockRole.findOne.mockResolvedValue({ id: 2, name: 'user' });
      mockBcrypt.default.hash.mockResolvedValue('hashed-pass');
      mockUser.create.mockResolvedValue({ id: 11, username: 'alice', link: 'link' });

  signup(req, res, next);
  await flushPromises();

      expect(mockRole.findOne).toHaveBeenCalled();
      expect(mockBcrypt.default.hash).toHaveBeenCalledWith('Str0ng!Pass', 8);
      expect(mockUser.create).toHaveBeenCalledWith(expect.objectContaining({ username: 'alice', password: 'hashed-pass', roleId: 2, link: 'link' }));
      expect(mockJwt.default.sign).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 11, username: 'alice', role: 'user', link: 'link' }));
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('signin', () => {
    test('happy path: signs in and returns user info', async () => {
      const req = { body: { username: 'bob', password: 'mypassword' } };
      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      mockUser.findOne.mockResolvedValue({ id: 7, username: 'bob', password: 'hashed', role: { name: 'user' }, link: 'some-link' });
      mockBcrypt.default.compare.mockResolvedValue(true);

  signin(req, res, next);
  await flushPromises();

      expect(mockUser.findOne).toHaveBeenCalledWith(expect.objectContaining({ where: { username: 'bob' } }));
      expect(mockBcrypt.default.compare).toHaveBeenCalledWith('mypassword', 'hashed');
      expect(mockJwt.default.sign).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 7, username: 'bob', role: 'user', link: 'some-link' }));
      expect(next).not.toHaveBeenCalled();
    });

    test('wrong password calls next with error', async () => {
      const req = { body: { username: 'bob', password: 'bad' } };
      const res = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      mockUser.findOne.mockResolvedValue({ id: 7, username: 'bob', password: 'hashed', role: { name: 'user' }, link: 'some-link' });
      mockBcrypt.default.compare.mockResolvedValue(false);

  signin(req, res, next);
  await flushPromises();

      expect(next).toHaveBeenCalled();
    });
  });
});
