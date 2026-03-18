import { AsyncLocalStorage } from 'async_hooks';

// A global storage for the current request's user ID
export const userContext = new AsyncLocalStorage<string>();
