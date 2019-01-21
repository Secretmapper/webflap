// https://github.com/devhubapp/devhub/blob/master/packages/components/src/hooks/use-hover.ts
// mouseover/out -> mouseenter/leave
// https://stackoverflow.com/questions/350639/how-to-disable-mouseout-events-triggered-by-child-elements

import { useEffect, useRef, useState } from 'react'
import { findDOMNode } from 'react-dom'

import { Platform } from 'react-native'

export default function useHover(ref, callback) {
  if (Platform.OS !== 'web') return false

  const cacheRef = useRef(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(
    () => {
      const node = findNode(ref)

      if (!(node && typeof node.addEventListener === 'function')) return

      const resolve = value => {
        if (cacheRef.current === value) return

        cacheRef.current = value

        if (callback) {
          callback(value)
          return
        }

        setIsHovered(value)
      }

      const handleMouseOver = () => resolve(true)
      const handleMouseOut = () => resolve(false)

      node.addEventListener('mouseenter', handleMouseOver)
      node.addEventListener('mouseleave', handleMouseOut)

      return () => {
        if (!node) return

        node.removeEventListener('mouseenter', handleMouseOver)
        node.removeEventListener('mouseleave', handleMouseOut)
      }
    },
    [ref && ref.current, callback]
  )

  return isHovered
}

export function findNode(ref) {
  let node = ref && (ref.current || ref)

  if (node && node.getNode && node.getNode()) node = node.getNode()

  if (node && node._touchableNode) node = node._touchableNode

  if (node && node._node) node = node._node

  if (Platform.OS === 'web') node = findDOMNode(node)

  return node
}
