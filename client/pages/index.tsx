/**
 * Represents the index page of the web chat app.
 * This component displays a list of available rooms and allows the user to create and join rooms.
 */
import { useState, useEffect, useContext } from 'react'
import { API_URL } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { WEBSOCKET_URL } from '../constants'
import { AuthContext, UserInfo } from '../modules/auth_provider'
import { WebsocketContext } from '../modules/websocket_provider'
import { useRouter } from 'next/router'

import { NavigationButton, Drawer } from './menu';  // Adjust the import path based on your project structure

// Add the correct import path for the authenticated variable

const Index = () => {
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([])
  const [roomName, setRoomName] = useState('')
  const { user } = useContext(AuthContext)
  const { setConn } = useContext(WebsocketContext)
  const { setAuthenticated } = useContext(AuthContext);
  const { setUser } = useContext(AuthContext); // Add setUser to update user info

  const router = useRouter()

  const getRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/ws/getRooms`, {
        method: 'GET',
      })

      const data = await res.json()
      if (res.ok) {
        setRooms(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getRooms()
  }, [])


  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    try {
      setRoomName('')
      const res = await fetch(`${API_URL}/ws/createRoom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: uuidv4(),
          name: roomName,
        }),
      })

      if (res.ok) {
        getRooms()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const joinRoom = (roomId: string) => {
    const ws = new WebSocket(
      `${WEBSOCKET_URL}/ws/joinRoom/${roomId}?userId=${user.id}&username=${user.username}`
    )
    if (ws.OPEN) {
      setConn(ws)
      router.push('/app')
      return
    }
  }

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    console.log("isDrawerOpen");
  };

  const logoutHandler = () => {
    console.log("logout");
    
    localStorage.removeItem('user_info');
    setAuthenticated(false);
    setUser({} as UserInfo);
    // You may also want to redirect the user to the login page or another appropriate page
    router.push('/login');
  };

  return (
    <>
    
      <div className='w-full h-full'>
        <Drawer isDrawerOpen={isDrawerOpen} logoutHandler={logoutHandler}/>
        <div className="container ml-12 mt-10 text-left">
          <h1 className='text-white float-right'>goLang Websocket Chat</h1>
        <NavigationButton toggleDrawer={toggleDrawer} />
        <input
          type='text'
          className='border mt-12 border-grey p-2 rounded-md focus:outline-none focus:border-blue'
          placeholder='room name'
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button
          className=' text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center md:ml-4'
          
          onClick={submitHandler}
        >
          create room
        </button>

          <div className='font-bold text-white mt-5'>Available Rooms</div>
          <div className='grid grid-cols-1  gap-4 mt-6'>
            {rooms.map((room, index) => (
              <div
                key={index}
                className='border border-blue p-4 flex items-center rounded-md w-full'
              >
                <div className='w-full'>
                  <div className='text-sm text-white'>room</div>
                  <div className='font-bold text-lg text-white'>{room.name}</div>
                </div>
                <div className=''>
                  <button
                    className=' text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center md:ml-4'
                    onClick={() => joinRoom(room.id)}
                  >
                    join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


    </>
  )
}

export default Index
