// This file mocks the logger used in the application.
// It allows tests to verify logging behavior without producing actual log output.

import { jest } from '@jest/globals';

export const createLoggerMock = () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
});

export default createLoggerMock;