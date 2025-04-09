import * as matchers from '@testing-library/jest-dom/matchers'
import { expect } from 'vitest'

import chromeMock from './__mocks__/chrome'

expect.extend(matchers)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).chrome = chromeMock
