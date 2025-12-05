import { jest } from "@jest/globals";

export const createLoggerMock = () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
});

export default createLoggerMock;
