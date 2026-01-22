
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMessagesByChatId, addSocketMessage } from '../redux/slice/chats.js'
import io from 'socket.io-client'
import styles from './chat.module.scss'
import { localDateFormat } from '../utils/index'
import { useTranslation } from 'react-i18next'

const socket = io(process.env.REACT_APP_BASE_URL, { autoConnect: false })

const ChatBox = ({ chatId, currentUserId, receiverId }) => {
  const { t } = useTranslation('chatBox')

  const dispatch = useDispatch()
  const messages = useSelector((state) => state.chats.messages)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)


  useEffect(() => {
    if (!chatId) return
    dispatch(fetchMessagesByChatId(chatId))
  }, [chatId, dispatch])

  useEffect(() => {
    if (!chatId) return

    socket.connect()
    socket.emit('joinRoom', { chatId })

    socket.on('newMessage', (msg) => {
      dispatch(addSocketMessage(msg))
    })

    return () => {
      socket.off('newMessage')
      socket.emit('leaveRoom', { chatId })
      socket.disconnect()
    }
  }, [chatId, dispatch])

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Stable sendMessage handler
  const sendMessage = useCallback(() => {
    if (!newMessage.trim()) return
    socket.emit('sendMessage', {
      chatId,
      senderId: currentUserId,
      receiverId,
      message: newMessage,
    })
    setNewMessage('')
  }, [chatId, currentUserId, receiverId, newMessage])

  return (
    <div className={styles.chat_box}>
      <div className={styles.chat_box__messages}>
        {messages.length === 0 ? (
          <p className={styles.chat_box__empty}>{t('empty')}</p>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.senderId === currentUserId
            return (
              <div
                key={msg._id || idx}
                className={`${styles.chat_box__message} ${isOwn ? styles.own : styles.other}`}
              >
                <div className={styles.chat_box__bubble}>{msg.message}</div>
                <span className={styles.chat_box__timestamp}>{localDateFormat(msg.timestamp)}</span>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.chat_box__input}>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={t('input.placeholder')}
        />
        <button onClick={sendMessage} disabled={!newMessage.trim()}>
          {t('buttons.send')}
        </button>
      </div>
    </div>
  )
}

export default ChatBox
