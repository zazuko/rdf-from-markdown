import { turtle } from '@rdfjs-elements/formats-pretty/serializers'
import ns from '../src/namespaces.js'
import getStream from 'get-stream'

function toPlain (prefixes) {
  const result = {}
  for (const [key, value] of Object.entries({ ...ns, ...prefixes })) {
    result[key] = value().value
  }
  return result
}

async function prettyPrint (dataset, prefixes = {}) {
  const sink = await turtle({
    prefixes: toPlain(prefixes),
  })
  const stream = await sink.import(dataset.toStream())
  return await getStream(stream)
}

import { readFile } from 'fs/promises'
import { Parser } from 'n3'
import rdf from 'rdf-ext'

async function getText ({ path }) {
  const buffer = await readFile(path, 'utf8')
  return buffer.toString()
}

async function toQuads ({ path }) {
  try {
    const parser = new Parser()
    const str = await getText({ path })
    return parser.parse(str)
  } catch (error) {
    throw Error(`${path}\n${error.message}`)
  }
}

async function getDataset ({ path }) {
  const quads = await toQuads({ path })
  return rdf.dataset().addAll(quads)
}

export { getText, getDataset, prettyPrint }

