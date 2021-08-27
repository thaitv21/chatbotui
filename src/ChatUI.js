import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  Fragment
} from 'react'
import logo from './logo.svg'
import send from './send.svg'
import styles from './styles.module.css'

function MessageFromMe(props) {
  return (
    <>
      <div className={styles.response}>
        <div className={styles['user-caption-response-wrapper']}>
          <div className={styles.caption}>
            <div className={styles['caption-text']}>You</div>
          </div>
        </div>
        <div className={styles['user-response-wrapper']}>
          {props.messages.map((msg, i) => (
            <div className={styles['response-text']} key={i}>
              {msg.text}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function MessageFromBot(props) {
  return (
    <>
      <div className={styles.response}>
        <div className={styles['bot-caption-response-wrapper']}>
          <div className={styles.caption}>
            <div className={styles.avatar}>
              <img src={logo} alt='' />
            </div>
            <div className={styles['caption-text']}>Bot</div>
          </div>
        </div>
        <div className={styles['bot-response-wrapper']}>
          {props.messages.map((message, index) => {
            const localStyle = {
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              borderBottomLeftRadius: 5,
              marginTop: 0,
              marginBottom: 0
            }
            if (index === 0) {
              localStyle.borderTopLeftRadius = 5
              localStyle.borderTopRightRadius = 20
            }
            if (index === props.messages.length - 1) {
              localStyle.borderBottomRightRadius = 20
              localStyle.borderBottomLeftRadius = 20
            }
            if (index !== 0 && index !== props.messages.length - 1) {
              localStyle.marginTop = 5
            }
            if (message.image) {
              return (
                <div
                  style={localStyle}
                  className={styles['response-img']}
                  key={index}
                >
                  <img
                    src='https://cdn.vox-cdn.com/thumbor/zTBzOjycX07hspHfHerM385iAag=/0x0:2040x1360/1200x800/filters:focal(857x517:1183x843)/cdn.vox-cdn.com/uploads/chorus_image/image/69773669/acastro_210104_1777_google_0001.0.jpg'
                    alt=''
                  />
                </div>
              )
            }
            return (
              <div
                style={localStyle}
                className={styles['response-text']}
                key={index}
              >
                {message.text || ''}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

function BotLoading() {
  return (
    <>
      <div className={styles.response}>
        <div className={styles['bot-caption-response-wrapper']}>
          <div className={styles.caption}>
            <div className={styles.avatar}>
              <img src={logo} alt='' />
            </div>
            <div className={styles['caption-text']}>Bot</div>
          </div>
        </div>
        <div className={styles['bot-response-wrapper']}>
          <div
            style={{
              borderTopLeftRadius: 5,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 20
            }}
            className={styles['response-text']}
          >
            <div className={styles.wave}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const sendMessageToServer = async (messages, message) => {
  // eslint-disable-next-line no-undef
  const response = await fetch(
    'http://18.139.217.55:5005/webhooks/rest/webhook',
    {
      method: 'POST',
      body: JSON.stringify({
        sender: 'test_user',
        message: message,
        metadata: {}
      })
    }
  )
  const data = await response.json()
  console.log('data', data)
  return messages.concat([
    {
      from: 'bot',
      messages: data.map((item) => {
        if (item.image) {
          return { image: item.image }
        } else {
          return { text: item.text }
        }
      })
    }
  ])
}

const AlwaysScrollToBottom = () => {
  const elementRef = useRef()
  useEffect(() => elementRef.current.scrollIntoView())
  return <div ref={elementRef} />
}

export default function ChatUI() {
  const [messages, setMessages] = useState([])
  const [typingMessage, setTypingMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const sendMessage = useCallback(() => {
    if (!typingMessage.trim()) {
      return
    }
    const newMessages = messages.concat([
      { from: 'me', messages: [{ text: typingMessage }] }
    ])
    setLoading(true)
    sendMessageToServer(newMessages, typingMessage).then((list) => {
      setMessages(list)
      setLoading(false)
    })
    setTypingMessage('')
    setMessages(newMessages)
  }, [messages, typingMessage])
  return (
    <div className={styles['chat-app-wrapper']}>
      <div className={styles['chat-open']}>
        <div className={styles['chat-app']}>
          <div className={styles.top}>
            <div className={styles.avatar}>
              <img src={logo} alt='' />
            </div>
            <div className={styles.company}>
              <div className={styles.header}>ChatBot</div>
              <div className={styles.status}>Online</div>
            </div>
          </div>
          <div className={styles.conversation}>
            {messages.map((item, index) => {
              if (item.from === 'me') {
                return <MessageFromMe messages={item.messages} key={index} />
              } else {
                return <MessageFromBot messages={item.messages} key={index} />
              }
            })}
            {loading && <BotLoading />}
            <AlwaysScrollToBottom />
          </div>
          <div className={styles.typing}>
            <input
              type='text'
              maxLength={256}
              placeholder='Type your message here'
              value={typingMessage}
              disabled={loading}
              onKeyUp={(event) => {
                if (event.key === 'Enter') {
                  sendMessage()
                }
              }}
              onChange={(event) => setTypingMessage(event.target.value)}
            />
            <div className={styles['send-icon']} onClick={sendMessage}>
              <img src={send} alt='' />
            </div>
          </div>
          <div className={styles['power-by']}>Powered by Viettel</div>
        </div>
      </div>
    </div>
  )
}
