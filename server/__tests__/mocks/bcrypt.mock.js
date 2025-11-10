// This file mocks the bcrypt library functions used for hashing and comparing passwords.

import { jest } from '@jest/globals';

export const createBcryptMock = () => ({
  hash: jest.fn(),
  compare: jest.fn()
});

export default createBcryptMock;