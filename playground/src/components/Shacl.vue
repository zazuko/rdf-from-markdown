<script setup>
import '@rdfjs-elements/rdf-editor'
import { storeToRefs } from 'pinia'
import { useWorkspaceState } from '../store/workspaceState.js'
import EditBox from './common/Editbox.vue'

const store = useWorkspaceState()
const {
  currentShaclQuads,
} = storeToRefs(store)

</script>

<template>

  <div>
    <template v-if="currentShaclQuads.length>0">
      <edit-box format="application/trig" :quads="currentShaclQuads"/>
    </template>
  </div>

</template>
