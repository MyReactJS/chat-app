import React from 'react';
import { useParams } from 'react-router'
import { Loader } from 'rsuite';
import ChatBottom from '../../components/chatwindow/bottom';
import Messages from '../../components/chatwindow/messages';
import ChatTop from '../../components/chatwindow/top';
import { CurrentRoomProvider } from '../../context/currentroom.context';
import { useRooms } from '../../context/rooms.context';
import { auth } from '../../misc/firebase';
import { transformToArr } from '../../misc/helpers';

const Chat = () => {
    const { chatId } = useParams();

    const rooms = useRooms();
    if (!rooms) {
        return <Loader center vertical size="md" content="Loading" speed="slow" />
    }
    const currentRoom = rooms.find(room => room.id === chatId);
    if (!currentRoom) {
        return <h6 className="text-center mt-page"> Chat {chatId} not found </h6>
    }

    const { name, description } = currentRoom;
    const admins = transformToArr(currentRoom.admins);
    const isAdmin = admins.includes(auth.currentUser.uid);
    const currentRoomData = {
        name,
        description,
        isAdmin,
        admins
    }
    return (
        <CurrentRoomProvider data={currentRoomData} >
            <div className="chat-top">
                <ChatTop />
            </div>
            <div className="chat-middle">
                <Messages />
            </div>
            <div className="chat-bottom">
                <ChatBottom />
            </div>
        </CurrentRoomProvider>
    );
}

export default Chat;