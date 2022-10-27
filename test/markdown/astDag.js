import { expect } from 'expect'

import toMatchSnapshot from 'expect-mocha-snapshot'
import { resolve } from 'path'
import { getAstDag } from '../../src/markdown/astDag.js'
import { createMarkdownParser } from '../../src/markdown/markdownParser.js'
import { getText } from '../support/readFiles.js'

expect.extend({ toMatchSnapshot })

import { tests } from '../support/tests.js'
import { prettyPrint } from '../util.js'

describe('astDag', async function () {
  for (const current of tests) {
    it(current.title, async function () {
      const fullText = await getText(
        { path: resolve(current.markdown) })
      const parser = createMarkdownParser()
      const ast = await parser.parse(fullText)

      const astGraph = await getAstDag({ astNode: ast, fullText })

      const turtle = await prettyPrint(astGraph.dataset)
      expect(turtle).toMatchSnapshot(this)
    })
  }
})
