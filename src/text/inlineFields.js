function keyValue (txt) {
  const chunks = txt.split('::')
  if (chunks.length === 2) {
    return {
      property: chunks[0], value: chunks[1],
    }
  }
  return undefined
}

function contentBetweenParenthesis (txt) {
  const result = []
  for (const [i, value] of txt.split('(').entries()) {
    if (i > 0) {
      result.push(value.split(')')[0])
    }
  }
  for (const [i, value] of txt.split('[').entries()) {
    if (i > 0) {
      result.push(value.split(']')[0])
    }
  }
  return result
}

// Accepts embedded pairs between brackets, [like:: this] (or like::this)
function extractInlineFields (txt) {

  const content = contentBetweenParenthesis(txt)

  return content.length ? content.map(keyValue).filter(x => x) : keyValue(txt)
}

export { extractInlineFields }
