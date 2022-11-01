import { expect } from 'expect'

import toMatchSnapshot from 'expect-mocha-snapshot'
import { resolve } from 'path'
import { getAstDag } from '../../src/markdown/astDag.js'
import { createMarkdownParser } from '../../src/markdown/markdownParser.js'
import { getText, prettyPrint } from '../util.js'
import { tests } from '../tests.js'

expect.extend({ toMatchSnapshot })


describe('astDag', async function () {
  for (const current of tests) {
    it(current.title, async function () {
      const fullText = await getText(
        { path: resolve(current.markdown) })
      const parser = createMarkdownParser()
      const astNode = await parser.parse(fullText)

      const astGraph = await getAstDag({ astNode, fullText })

      const turtle = await prettyPrint(astGraph.dataset)
      expect(turtle).toMatchSnapshot(this)
    })
  }
})
