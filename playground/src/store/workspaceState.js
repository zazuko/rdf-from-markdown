import { Parser } from 'n3'
import { defineStore } from 'pinia'
import rdf from 'rdf-ext'
import { ref, toRaw, watch } from 'vue'
import ns from '../namespaces.js'

const parser = new Parser()

function toQuads (str) {
  return parser.parse(str)
}

export const useWorkspaceState = defineStore('workspace-store',
  () => {
    const currentQuads = ref([])

    return {
      currentQuads,
    }
  })



