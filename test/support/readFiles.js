import { readFile } from 'fs/promises'
import { Parser } from 'n3'
import rdf from 'rdf-ext'

async function getText ({ path }) {
  const buffer = await readFile(path, 'utf8')
  return buffer.toString()
}

async function getClownface ({ path }) {
  const parser = new Parser()
  const str = await getText({ path })
  const quads = parser.parse(str)
  const dataset = rdf.dataset().addAll(quads)
  return rdf.clownface({ dataset })
}

export { getText, getClownface }
