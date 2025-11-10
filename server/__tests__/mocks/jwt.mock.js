import { jest } from '@jest/globals';

export const createJwtMock = () => ({
  sign: jest.fn(),
  verify: jest.fn()
});

export default createJwtMock;