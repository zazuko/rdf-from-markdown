import { expect } from 'expect'

import toMatchSnapshot from 'expect-mocha-snapshot'
import { resolve } from 'path'
import { getAstDag } from '../../src/markdown/astDag.js'
import { createMarkdownParser } from '../../src/markdown/markdownParser.js'
import { getText } from '../support/readFiles.js'

expect.extend({ toMatchSnapshot })

describe('astDag', async function () {

  it('should produce a DAG from an ast', async function () {
    const fullText = await getText(
      { path: resolve('./test/support/roles-mini.md') })
    const parser = createMarkdownParser()
    const ast = await parser.parse(fullText)

    const astGraph = await getAstDag({ astNode: ast, fullText })

    expect(astGraph.dataset.toString()).toMatchSnapshot(this)
  })

})
