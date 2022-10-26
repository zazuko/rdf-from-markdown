import { expect } from 'expect'

import toMatchSnapshot from 'expect-mocha-snapshot'
import {
  extractInlineFields,
} from '../../src/text/inlineFields.js'

const markdown = [
  'inline :: field',
  'nested ( inline :: field )',
  '**Thoughts**:: It was decent.',
  '**Rating**:: 6',
  '[mood:: okay] | [length:: 2 hours]']

expect.extend({ toMatchSnapshot })

describe('extractInlineFields', async function () {
  for (const current of markdown) {
    it(current, async function () {

      const fields = extractInlineFields(current)

      expect(fields).toMatchSnapshot(this)
    })
  }
})
