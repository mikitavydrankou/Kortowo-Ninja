import { jest } from "@jest/globals";

export const createBcryptMock = () => ({
  hash: jest.fn(),
  compare: jest.fn(),
});

export default createBcryptMock;
