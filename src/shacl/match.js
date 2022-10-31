import rdf from 'rdf-ext'
import ns from '../namespaces.js'
import { extractInlineFields } from '../text/inlineFields.js'
import { normalizeText } from '../text/normalize.js'

function isNormalizedMatch (first, second) {
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
    quads.push(...getMatchHeader(
      { uri, propertyCF, uriResolver, astPointer, shapePointer }))
    quads.push(...getMatchAllHeaders(
      { uri, propertyCF, uriResolver, astPointer, shapePointer }))
  }
  return quads
}

function getMatchAllHeaders ({
  uri, propertyCF, uriResolver, astPointer, shapePointer,
}) {
  const quads = []
  for (const termToMatch of propertyCF.out(ns.mark.matchAll).terms) {
    for (const childUri of astPointer.out(ns.mark.contains).terms) {

      const childAstPointer = astPointer.node(childUri)

      for (const text of childAstPointer.out(termToMatch).terms) {
        quads.push(...getValue({
          uri,
          propertyCF,
          uriResolver,
          text,
          astPointer: childAstPointer,
          shapePointer,
        }))
      }
    }
  }
  return quads
}

function getMatchHeader ({
  uri,
  propertyCF,
  uriResolver,
  astPointer,
  shapePointer,
}) {
  const quads = []
  const matchHeader = propertyCF.out(ns.mark.matchHeader).term
  if (matchHeader) {
    const astHeader = astPointer.out(ns.mark.header).term
    quads.push(rdf.quad(uri, ns.schema.name, normalizeLiteral(astHeader)))
    for (const childUri of astPointer.out(ns.mark.contains).terms) {
      const childAstPointer = astPointer.node(childUri)
      if (isNormalizedMatch(childAstPointer.out(ns.mark.header).term,
        matchHeader)) {
        for (const text of childAstPointer.out(ns.mark.text).terms) {
          quads.push(...getValue({
            uri,
            propertyCF,
            uriResolver,
            text,
            astPointer: childAstPointer,
            shapePointer,
          }))
        }
      }
    }
  }
  return quads
}

function getValue ({
  uri,
  propertyCF,
  uriResolver,
  text,
  astPointer,
  shapePointer,
}) {
  const path = propertyCF.out(ns.sh.path).term
  const quads = []
  const nodeKind = propertyCF.out(ns.sh.nodeKind).term
  const normalizedLiteral = normalizeLiteral(text)

  if (nodeKind.equals(ns.sh.Literal)) {
    quads.push(rdf.quad(uri, path, normalizedLiteral))
  } else if (nodeKind.equals(ns.sh.IRI)) {
    const childUri = uriResolver.mintUri(normalizedLiteral)
    quads.push(rdf.quad(uri, path, childUri))
    quads.push(rdf.quad(childUri, ns.rdf.label, normalizedLiteral))
    const inlineQuads = getQuadsFromInline(
      { uri: childUri, literal: text, shapes: shapePointer.any() })
    quads.push(...inlineQuads)

    const node = propertyCF.out(ns.sh.node).term
    if (node) {
      quads.push(...produceQuads({
        uri: childUri,
        astPointer,
        shapePointer: shapePointer.node(node),
        uriResolver,
      }))
    }
  }
  return quads
}

function getQuadsFromInline ({ uri, literal, shapes }) {

  const result = []
  for (const inlineField of extractInlineFields(literal.value)) {
    const normalizedProperty = rdf.literal(normalizeText(inlineField.property))
    for (const current of shapes.dataset.match(null,
      ns.mark.matchInlineProperty, normalizedProperty)) {
      const normalizedValue = rdf.literal(normalizeText(inlineField.value))
      const path = shapes.node(current.subject).out(ns.sh.path).term
      result.push(rdf.quad(uri,path,normalizedValue))
    }
  }
  return result
}

function getShapesByProperty ({ property, value, shapes }) {
  const matches = []
  for (const current of shapes.dataset.match(null, property, value)) {
    matches.push(shapes.node(current.subject))
  }
  return matches
}

function getShapesByTag ({ tag, shapes }) {
  return getShapesByProperty(
    { property: ns.mark.matchHashTag, value: tag, shapes })
}

function getShapesByType ({ type, shapes }) {
  return getShapesByProperty(
    { property: ns.mark.matchType, value: type, shapes })
}

const defaultUriResolver = {
  mintUri (literal) {
    return rdf.blankNode()
  },
}

function doShaclMatch ({
  astPointer, shapes, uriResolver = defaultUriResolver,
}) {
  const result = []

  for (const type of astPointer.out(ns.rdf.type).terms) {
    for (const shapeRoot of getShapesByType({ type, shapes })) {
      const uri = uriResolver.mintUri(type)
      const quads = produceQuads(
        { uri, astPointer, shapePointer: shapeRoot, uriResolver })
      result.push(...quads)
    }
  }

  // Check if a tag is found
  for (const tag of astPointer.out(ns.mark.tag).terms) {
    for (const shapeRoot of getShapesByTag({ tag, shapes })) {
      const uri = uriResolver.mintUri(tag)
      const quads = produceQuads(
        { uri, astPointer, shapePointer: shapeRoot, uriResolver })
      result.push(...quads)
    }
  }

  // Recursively process the tree
  for (const term of astPointer.out(ns.mark.contains).terms) {
    const quads = doShaclMatch(
      { astPointer: astPointer.node(term), shapes, uriResolver })
    result.push(...quads)
  }

  return result
}

export { doShaclMatch }
