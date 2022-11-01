import { getAstDag } from './src/markdown/astDag.js'
import { createMarkdownParser } from './src/markdown/markdownParser.js'
import { doShaclMatch } from './src/shacl/match.js'

async function quadsFromMarkdown ({ markdownText, shapesDataset }) {
  const parser = createMarkdownParser()
  const astNode = await parser.parse(markdownText)
  const astPointer = await getAstDag({ astNode, fullText:markdownText })
  return doShaclMatch({ astPointer, shapesDataset })
}

export { quadsFromMarkdown }
