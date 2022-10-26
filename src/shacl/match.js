import rdf from 'rdf-ext'
import ns from '../namespaces.js'
import { normalizeText } from '../text/normalize.js'

function isHeaderMatch (first, second) {
  return normalizeLiteral(first).value.toLowerCase() ===
    normalizeLiteral(second).value.toLowerCase()
}

function normalizeLiteral (term) {
  return rdf.literal(normalizeText(term.value))
}

function produceQuads ({ uri, astPointer, shapePointer, uriResolver }) {

  const quads = []
  const entityType = shapePointer.out(ns.sh.class).term
  quads.push(rdf.quad(uri, ns.rdf.type, entityType))

  for (const property of shapePointer.out(ns.sh.property).terms) {

    const propertyCF = shapePointer.node(property)
    const path = propertyCF.out(ns.sh.path).term
    const matchText = propertyCF.out(ns.mark.matchText).term
    const nodeKind = propertyCF.out(ns.sh.nodeKind).term

    if (path && matchText) {
      const astHeader = astPointer.out(ns.mark.header).term
      quads.push(rdf.quad(uri, ns.schema.name, normalizeLiteral(astHeader)))
      for (const childUri of astPointer.out(ns.mark.contains).terms) {
        const childPointer = astPointer.node(childUri)
        if (isHeaderMatch(childPointer.out(ns.mark.header).term, matchText)) {

          for (const text of childPointer.out(ns.mark.text).terms) {
            const normalizedText = normalizeLiteral(text)
            if (nodeKind.equals(ns.sh.Literal)) {
              quads.push(rdf.quad(uri, path, normalizedText))
            } else if (nodeKind.equals(ns.sh.IRI)) {
              const childUri = uriResolver.mintUri(normalizedText)
              quads.push(rdf.quad(uri, path, childUri))
              quads.push(rdf.quad(childUri, ns.rdf.label, normalizedText))
            }
          }

        }
      }
// ## TODO, do recursion when complex patterns emerge
    }
  }
  return quads
}

function getShapesByTag ({ tag, shapes }) {
  const matches = []
  for (const current of shapes.dataset.match(null, ns.mark.tag, tag)) {
    matches.push(shapes.node(current.subject))
  }
  return matches
}

const defaultUriResolver = {
  mintUri (literal) {
    return rdf.blankNode()
  },
}

function doShaclMatch ({
  astPointer,
  shapes,
  uriResolver = defaultUriResolver,
}) {
  const result = []

  for (const tag of astPointer.out(ns.mark.tag).terms) {
    for (const shapeRoot of getShapesByTag({ tag, shapes })) {
      const uri = rdf.blankNode()
      const quads = produceQuads({ uri, astPointer, shapePointer: shapeRoot, uriResolver })
      result.push(...quads)
    }
  }

  for (const term of astPointer.out(ns.mark.contains).terms) {
    const quads = doShaclMatch(
      { astPointer: astPointer.node(term), shapes, uriResolver })
    result.push(...quads)
  }

  return result
}

export { doShaclMatch }