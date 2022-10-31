import { expect } from 'expect'

import toMatchSnapshot from 'expect-mocha-snapshot'
import { resolve } from 'path'
import rdf from 'rdf-ext'
import { getAstDag } from '../../src/markdown/astDag.js'
import { createMarkdownParser } from '../../src/markdown/markdownParser.js'
import ns from '../../src/namespaces.js'
import { doShaclMatch } from '../../src/shacl/match.js'
import { getClownface, getText } from '../support/readFiles.js'
import { prettyPrint } from '../util.js'
import {tests} from '../support/tests.js'

expect.extend({ toMatchSnapshot })

describe('match', async function () {
  for (const current of tests) {
    it(current.title, async function () {

      let counter = 0
      const uriResolver = {
        mintUri (literal) {
          counter = counter+1
          return ns.ex['named/'+counter]
        },
      }

      const fullText = await getText(
        { path: resolve(current.markdown) })
      const shapesClownface = await getClownface(
        { path: resolve(current.shacl) })
      const parser = createMarkdownParser()
      const ast = await parser.parse(fullText)

      const astGraph = await getAstDag({ astNode: ast, fullText })
      const quads = doShaclMatch({ astPointer:astGraph, shapes:shapesClownface, uriResolver})

      const dataset = rdf.dataset().addAll(quads)

      const turtle = await prettyPrint(dataset)
      expect(turtle).toMatchSnapshot(this)
    })
  }
})
