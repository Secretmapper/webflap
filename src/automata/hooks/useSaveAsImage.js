import { useCallback } from 'react'

export default function useSaveAsImage(cy) {
  return useCallback(
    type => {
      let image

      if (type === 'image/jpeg') {
        image = cy.jpeg()
      } else if (type === 'image/png') {
        image = cy.png()
      }

      if (image) {
        const url = image.replace(
          /^data:image\/[^;]+/,
          'data:application/octet-stream'
        )
        window.open(url)
      }
    },
    [cy]
  )
}
