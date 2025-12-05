import { jest } from "@jest/globals";

export const createDbMock = () => {
  const mockUser = {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
  };

  const mockRole = {
    findOne: jest.fn(),
    findAll: jest.fn(),
  };

  const mockOffer = {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    count: jest.fn(),
    destroy: jest.fn(),
  };

  const sequelizeFn = jest.fn((name) => `fn(${name})`);
  const sequelizeCol = jest.fn((name) => `col(${name})`);
  const sequelizeLiteral = jest.fn((value) => `literal(${value})`);

  return {
    User: mockUser,
    Role: mockRole,
    Offer: mockOffer,
    sequelize: {
      transaction: jest.fn(),
      fn: sequelizeFn,
      col: sequelizeCol,
      literal: sequelizeLiteral,
    },
    Sequelize: {
      Op: {
        gt: Symbol("gt"),
        lt: Symbol("lt"),
        gte: Symbol("gte"),
      },
    },

    _mockUser: mockUser,
    _mockRole: mockRole,
    _mockOffer: mockOffer,
    _sequelizeFns: {
      fn: sequelizeFn,
      col: sequelizeCol,
      literal: sequelizeLiteral,
    },
  };
};
