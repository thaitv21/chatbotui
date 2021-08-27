import React from 'react'
import styles from './styles.module.css'
import ChatUI from './ChatUI'
import './logo.svg'

export const ExampleComponent = ({ text }) => {
  return <div className={styles.test}>Example Component: {text}</div>
}

export default ChatUI
