import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { server } from '../mocks/server';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        get length() {
            return Object.keys(store).length;
        },
        key: vi.fn((index: number) => Object.keys(store)[index] || null),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));

// Reset handlers after each test
afterEach(() => {
    server.resetHandlers();
    localStorageMock.clear();
});

// Close server after all tests
afterAll(() => server.close());
