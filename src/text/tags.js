// @TODO move to Regexp
function getTags (str) {
  return str.split(' ').
    filter(x => !x.endsWith('#')).
    filter(x => x.startsWith('#'))
}

function removeTags (str) {
  let result = str
  for (const tag of getTags(str)) {
    result.replaceAll(tag, '')
  }
  return result
}

export { getTags, removeTags }
