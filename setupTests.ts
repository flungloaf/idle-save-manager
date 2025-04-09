import chromeMock from './__mocks__/chrome'
import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).chrome = chromeMock
