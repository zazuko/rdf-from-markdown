import { expect } from 'expect'

import toMatchSnapshot from 'expect-mocha-snapshot'
import { resolve } from 'path'
import rdf from 'rdf-ext'
import { getAstDag } from '../../src/markdown/astDag.js'
import { createMarkdownParser } from '../../src/markdown/markdownParser.js'
import { doShaclMatch } from '../../src/shacl/match.js'
import { getClownface, getText } from '../support/readFiles.js'

expect.extend({ toMatchSnapshot })

describe('match', async function () {

  it('should produce quads from an astDag', async function () {
    const fullText = await getText(
      { path: resolve('./test/support/roles-mini.md') })
    const shapesClownface = await getClownface(
      { path: resolve('./test/support/roles.shacl') })
    const parser = createMarkdownParser()
    const ast = await parser.parse(fullText)

    const astGraph = await getAstDag({ astNode: ast, fullText })
    const quads = doShaclMatch({ astPointer:astGraph, shapes:shapesClownface})

    const dataset = rdf.dataset().addAll(quads)
    expect(dataset.toString()).toMatchSnapshot(this)
  })

})
