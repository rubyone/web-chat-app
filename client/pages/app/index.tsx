import React, { useState, useRef, useContext, useEffect } from 'react'
import ChatBox from '../../components/chat_box'
import { WebsocketContext } from '../../modules/websocket_provider'
import { useRouter } from 'next/router'
import { API_URL } from '../../constants'
import autosize from 'autosize'
import { AuthContext } from '../../modules/auth_provider'

export type Message = {
  content: string
  client_id: string
  username: string
  room_id: string
  type: 'recv' | 'self'
}

const Index = () => {
  const [rooms] = useState<{ id: string; name: string }[]>([])
  const [messages, setMessage] = useState<Array<Message>>([])
  const textarea = useRef<HTMLTextAreaElement>(null)
  const { conn } = useContext(WebsocketContext)
  const [users, setUsers] = useState<Array<{ username: string }>>([])
  const { user } = useContext(AuthContext)

  const router = useRouter()

  useEffect(() => {
    if (conn === null) {
      router.push('/')
      return
    }

    const roomId = conn.url.split('/')[5]
    async function getUsers() {
      try {
        const res = await fetch(`${API_URL}/ws/getClients/${roomId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()

        setUsers(data)
      } catch (e) {
        console.error(e)
      }
    }
    getUsers()
  }, [])

  useEffect(() => {
    if (textarea.current) {
      autosize(textarea.current)
    }

    if (conn === null) {
      router.push('/')
      return
    }

    conn.onmessage = (message) => {
      const m: Message = JSON.parse(message.data)
      if (m.content == 'A new user has joined the room') {
        setUsers([...users, { username: m.username }])
      }

      if (m.content == 'user left the chat') {
        const deleteUser = users.filter((user) => user.username != m.username)
        setUsers([...deleteUser])
        setMessage([...messages, m])
        return
      }

      user?.username == m.username ? (m.type = 'self') : (m.type = 'recv')
      setMessage([...messages, m])
    }

    conn.onclose = () => {}
    conn.onerror = () => {}
    conn.onopen = () => {}
  }, [textarea, messages, conn, users])

  const sendMessage = () => {
    if (!textarea.current?.value) return
    if (conn === null) {
      router.push('/')
      return
    }

    conn.send(textarea.current.value)
    textarea.current.value = ''
  }

  return (
    <>
      <div className='container text-left mx-auto mt-8'>
        <a  href="/" className="text-white ml-5 p-3 pl-5 pr-5  rounded-md bg-blue text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl">
          Back
        </a>
        <div className='pt-4 mt-4 md:mx-6 mb-14'>
          <ChatBox data={messages} />
        </div>
        <div className='fixed bottom-0 mt-4 container'>
          <div className='flex md:flex-row px-4 py-2 bg-grey rounded-md bg-black'>
            <div className='flex w-full mr-4 rounded-md border border-blue'>
              <textarea
                ref={textarea}
                placeholder='type your message here'
                className='w-full h-10 p-2 rounded-md focus:outline-none'
                style={{ resize: 'none' }}
              />
            </div>
            <div className=''>
              <button
                className='p-2 pl-5 pr-5 rounded-md text-white  bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl'
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Index
