import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { auth, database } from '../../../misc/firebase';
import { transformArrWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const Messages = () => {
    const { chatId } = useParams();
    const [messages, setMessages] = useState(null);
    const isChatEmpty = messages && messages.length === 0;
    const canShowMessages = messages && messages.length > 0;
    useEffect(() => {
        const messageRef = database.ref('/messages');
        messageRef.orderByChild('roomId').equalTo(chatId).on('value', (snap) => {
            const data = transformArrWithId(snap.val());
            
            setMessages(data);
        })
        return () => {
            messageRef.off('value');

        }
    }, [chatId])
    const handleAdmin = useCallback(async (uid) => {

        const adminRef = database.ref(`/rooms/${chatId}/admins`);
        let alertMsg;
        await adminRef.transaction(admins => {
            if (admins) {
                if (admins[uid]) {
                    admins[uid] = null;
                    alertMsg = `Admin Permission Removed`;
                }
                else {
                    admins[uid] = true;
                    alertMsg = `Admin Permission Granted`;
                }
               
            }
            return admins;
        })
       
        Alert.info(alertMsg, 5000);
    }, [chatId])

    const handleLike = useCallback(async (msgid) => {
        // console.log(msgid);
        const { uid } = auth.currentUser;
        const messageRef = database.ref(`/messages/${msgid}`);
        let alertMsg;
        await messageRef.transaction(msg => {
            if (msg) {
                if (msg.likes && msg.likes[uid]) {
                    msg.likes[uid] = null;
                    msg.likeCount -= 1;
                    alertMsg = `Like Removed`;
                }
                else {                    
                    msg.likeCount += 1;
                    if (!msg.likes)
                        msg.likes = {};
                    msg.likes[uid] = true;
                    alertMsg = `Like Added`;
                }

            }
            return msg;
        })
        Alert.info(alertMsg, 5000);
    }, [])
    const handleDelete = useCallback(async (msgId) => {
        if (!window.confirm('Delete this message?')) {
            return;
        }
        const isLast = messages[messages.length - 1].id === msgId;

        const updates = {};
        
        updates[`/messages/${msgId}`] = null;
        if (isLast && messages.length>2) {
            updates[`/rooms/${chatId}/lastMessage`] = {
                ...messages[messages.length - 2],
                msgId: messages[messages.length-2].id
            }
        }
        if (isLast && messages.length ===1) {
            updates[`/rooms/${chatId}/lastMessage`] = null;

        }
        try {
            await database.ref().update(updates);
            Alert.info('Message is deleted');
        }
        catch (err) {
            Alert.error(err.message, 5000);
        }
    }, [chatId, messages])
    return (
        <ul className="msg-list custom-scroll">
            {isChatEmpty && <li> No messages </li>}
            {canShowMessages && messages.map(msg =>
                <MessageItem key={msg.id} message={msg} handleAdmin={handleAdmin} handleLike={handleLike} handleDelete={handleDelete}/>
            )
                }

        </ul>

    );
}

export default Messages;