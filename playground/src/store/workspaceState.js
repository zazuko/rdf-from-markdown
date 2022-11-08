import { Parser } from 'n3'
import { defineStore } from 'pinia'
import rdf from 'rdf-ext'
import { ref, watch } from 'vue'
import { quadsFromMarkdown } from '../../../index.js'

const parser = new Parser()

function toQuads (str) {
  return parser.parse(str)
}

export const useWorkspaceState = defineStore('workspace-store', () => {

  const currentMarkdown = ref('')
  const currentResultQuads = ref([])
  const currentShaclQuads = ref([])

  async function triplifyContents () {
    const shapesDataset = rdf.dataset().addAll(currentShaclQuads.value)
    const resultQuads = await quadsFromMarkdown({
      markdownText: currentMarkdown.value, shapesDataset,
    })
    currentResultQuads.value = [...rdf.dataset().addAll(resultQuads)]
  }

  async function setExample ({ markdown, shacl }) {
    currentShaclQuads.value = toQuads(shacl)
    currentMarkdown.value = markdown
  }

  watch(currentMarkdown, () => triplifyContents())

  return {
    currentMarkdown,
    currentShaclQuads,
    currentResultQuads,
    setExample,
  }
})



