import { ItemType } from 'golden-layout'
import { MARKDOWN, SHACL, TURTLE } from './config.js'

const contentLayout = {
  root: {
    type: ItemType.row,
    content: [
      {
        type: ItemType.column,
        width: 20,
        content: [
          {
            type: 'component',
            header: { show: 'top' },
            isClosable: false,
            height: 90,
            componentState: undefined,
            ...MARKDOWN,
          },
        ],

      },
      {
        type: ItemType.column, width: 80, content: [
          {
            type: 'component',
            header: { show: 'top', popout: false },
            height: 50,
            componentState: undefined, ...TURTLE,

          }, {
            type: 'component',
            header: { show: 'top', popout: false },
            height: 50,
            componentState: undefined, ...SHACL,
          }],

      },
    ],
  },
}
export { contentLayout }
