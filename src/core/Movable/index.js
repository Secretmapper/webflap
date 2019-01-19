import React, { useState } from 'react'
import { Transform, Group } from 'react-art'

export function Movable() {
  const [transform, setTransform] = useState(() => new Transform())
  const onMouseUp = () => {}
  const onMouseMove = () => {
    setTransform({ transform: transform.translate({}) })
  }
  const onMouseDown = () => {}

  return (
    <Group
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      transform={transform}
    >
      {this.props.children}
    </Group>
  )
}

export default Movable
