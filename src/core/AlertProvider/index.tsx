import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { transitions, positions, Provider, AlertComponentPropsWithStyle } from 'react-alert'

const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 0,
  offset: '30px',
  transition: transitions.FADE
}

function AlertTemplate ({ style, options, message, close }: AlertComponentPropsWithStyle) {
  return (
    <div style={style}>
      <div style={styles.container}>
        <div style={styles.text}>{message}</div>
        <div
          onClick={close}
          style={styles.closeButton}
        >
          <svg fill='white' xmlns='http://www.w3.org/2000/svg' height='25' width='25' viewBox='0 0 48 48'>
            <path d='M38 12.83l-2.83-2.83-11.17 11.17-11.17-11.17-2.83 2.83 11.17 11.17-11.17 11.17 2.83 2.83 11.17-11.17 11.17 11.17 2.83-2.83-11.17-11.17z' />
            <path d='M0 0h48v48h-48z' fill='none' />
          </svg>
        </div>
      </div>
    </div>
  )
}

// TODO: Refactor (handle this in one place)
const AlertProvider: React.FC<{}> = (props) => {
  return (
    <Provider template={AlertTemplate} {...options}>
      {props.children}
    </Provider>
  )
}

const styles = {
  container: {
    alignItems: 'stretch',
    backgroundColor: '#333333',
    boxShadow: '0 8px 12px 0 rgba(0,0,0,0.3)',
    boxSizing: 'border-box',
    color: 'white',
    fontSize: '11px',
    position: 'relative',
    width: 300,
    display: 'flex',
    justifyContent: 'space-between'
  },
  closeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '50px',
    borderRadius: '0 2px 2px 0',
    cursor: 'pointer',
    top: 0,
    right: 0,
    backgroundColor: '#444',
  },
  button: {
    position: 'absolute',
    right: 4,
    top: 4
  },
  text: {
    display: 'flex',
    width: '100%',
    fontSize: 12
  }
} as { [s: string]: React.CSSProperties }

export default AlertProvider
