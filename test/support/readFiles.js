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

async function getClownface ({ path }) {
  const quads = await toQuads({ path })
  const dataset = rdf.dataset().addAll(quads)
  return rdf.clownface({ dataset })
}

export { getText, getClownface }
