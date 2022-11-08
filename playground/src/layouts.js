import { ItemType } from 'golden-layout'
import { MARKDOWN,  SHACL, TURTLE  } from './config.js'

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
        type: 'component',
        header: { show: 'top', popout: false },
        width: 30,
        componentState: undefined,
        ...SHACL,
      },
      {
        type: 'component',
        header: { show: 'top', popout: false },
        width: 30,
        componentState: undefined,
        ...TURTLE,
      },
    ],
  },
}
export { contentLayout }
