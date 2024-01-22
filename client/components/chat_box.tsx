/**
 * Renders a chat box component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array<Message>} props.data - The array of messages to be displayed in the chat box.
 * @returns {JSX.Element} The rendered chat box component.
 */
import React from 'react'
import { Message } from '../pages/app'

const ChatBox = ({ data }: { data: Array<Message> }) => {
  return (
    <>
      {data.map((message: Message, index: number) => {
        if (message.type == 'self') {
          return (
            <div
              className='container text-white  bg-gradient-to-br from-blue-400 to-green-600 rounded-md p-5 mt-2 w-full text-right justify-end'
              key={index}
            >
              <div className='text-sm'>{message.username}:</div>
              <div>
                <div className='bg-blue text-white px-4 py-1 rounded-md inline-block mt-1'>
                  {message.content}
                </div>
              </div>
            </div>
          )
        } else {
          return (
            <div className='mt-2' key={index}>
              <div className='text-sm'>{message.username}</div>
              <div>
                <div className='bg-grey text-dark-secondary px-4 py-1 rounded-md inline-block mt-1'>
                  {message.content}
                </div>
              </div>
            </div>
          )
        }
      })}
    </>
  )
}

export default ChatBox
