// setupTests.ts
import chromeMock from './__mocks__/chrome'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).chrome = chromeMock
