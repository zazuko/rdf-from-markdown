import { expect } from 'expect'

import toMatchSnapshot from 'expect-mocha-snapshot'
import { resolve } from 'path'
import { getHeadersTree } from '../../src/markdown/headersTree.js'
import { createMarkdownParser } from '../../src/markdown/markdownParser.js'
import { getText } from '../support/readFiles.js'

expect.extend({ toMatchSnapshot })

describe('astGraph', async function () {

  it('should produce a graph from an ast', async function () {
    const fullText = await getText(
      { path: resolve('./test/support/roles-mini.md') })
    const parser = createMarkdownParser()
    const ast = await parser.parse(fullText)
    const headersTree = await getHeadersTree({ astNode: ast, fullText })
    expect(headersTree).toMatchSnapshot(this)
  })

})
