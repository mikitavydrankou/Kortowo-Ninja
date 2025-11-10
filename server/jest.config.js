export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  moduleFileExtensions: ['js'],
  testMatch: ['**/?(*.)+(test).js'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  testEnvironmentOptions: {
    'node-options': '--experimental-vm-modules'
  }
};
