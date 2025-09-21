// Jest setup file for VS Code extension tests
// Configure global test environment

// Mock VS Code environment
global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn()
};

// Mock process.env for tests
process.env.NODE_ENV = 'test';

// Set reasonable test timeouts
jest.setTimeout(10000);