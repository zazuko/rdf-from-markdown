import { removeTags } from './tags.js'
import { trim } from './util.js'

function normalizeText (str) {
  const withoutTagsNoHeader = removeTags(str).
    split(' ').
    filter(x => !x.startsWith('#')).
    join(' ')
  const withoutList = withoutTagsNoHeader.startsWith('- ')
    ? withoutTagsNoHeader.slice(2)
    : withoutTagsNoHeader
  return trim(withoutList)
}

export { normalizeText }
