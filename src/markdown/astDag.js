import rdf from 'rdf-ext'
import ns from '../namespaces.js'
import { getList, getText } from './ast.js'
import {getTags} from '../text/tags.js'

async function getAstDag ({ astNode, fullText }) {

  const root = rdf.blankNode()
  const dataset = rdf.dataset()
  const pointer = rdf.clownface({ term: root, dataset })
  const quads = []
  quads.push(rdf.quad(root, ns.ex.label, rdf.literal('ROOT')))

  let headersStack = []
  astNode.children.reduce((currentUri, astNode) => {
    const text = getText({ astNode, fullText })

    if (astNode.type === 'heading') {
      const currentIri = rdf.blankNode()

      const ancesters = headersStack.filter(x => x.depth < astNode.depth)
      if (ancesters.length) {
        headersStack = headersStack.filter(x => x.depth < astNode.depth)
      }
      const parentIri = ancesters.length
        ? ancesters[ancesters.length - 1].iri
        : currentUri

      quads.push(rdf.quad(parentIri, ns.mark.contains, currentIri))
      quads.push(rdf.quad(currentIri, ns.mark.header, rdf.literal(text)))

      for (const tag of getTags(text)){
        quads.push(rdf.quad(currentIri, ns.mark.tag, rdf.literal(tag)))
      }

      headersStack.push({
        iri: currentIri,
        depth: astNode.depth,
      })
      return currentIri
    } else {
      if (astNode.type === 'list') {
        for (const text of getList({ astNode: astNode, fullText: fullText })) {
          quads.push(rdf.quad(currentUri, ns.mark.text, rdf.literal(text)))
        }
      } else if (astNode.type === 'paragraph') {
        quads.push(rdf.quad(currentUri, ns.mark.text, rdf.literal(text)))
      }
    }
    return currentUri
  }, root)
  pointer.dataset.addAll(quads)
  return pointer
}

export { getAstDag }
