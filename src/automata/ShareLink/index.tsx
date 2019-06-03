import React, { useCallback } from 'react'
import copy from 'copy-text-to-clipboard'

function ShareLink (props: { url: string }) {
  const onClick = useCallback(() => {
    copy(props.url)
  }, [props.url])

  return (
    <div className='share-link' style={styles.container} onClick={onClick}>
      <div style={styles.heading}>Share Link: <small>(Click to copy)</small></div>
      <div style={styles.text}>{props.url}</div>
    </div>
  )
}

const styles = {
  container: {
    cursor: 'pointer',
    padding: 8,
    width: '100%'
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 12
  },
  text: {
    fontSize: 16
  }
} as { [s: string]: React.CSSProperties }

export default ShareLink
