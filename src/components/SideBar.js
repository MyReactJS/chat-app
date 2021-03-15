import React, { useRef, useState, useEffect }  from 'react';
import { Divider } from 'rsuite';
import CreateRoomBtnModal from './CreateRoomBtnModal';
import DashboardToggle from './dashboard/DashboardToggle';
import ChatRoomList from './rooms/ChatRoomList';

const SideBar = () => {
    const topSidebarRef = useRef();
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (topSidebarRef.current) {
            setHeight(topSidebarRef.current.scrollHeight);
        }

    }, [topSidebarRef]);
    return (
        <div className="h-100  pt-2">
            <div className="h-100" >
                <DashboardToggle />
                <CreateRoomBtnModal />
                <Divider> Join Conversation</Divider>
                <div className="h-100">
                    <ChatRoomList aboveElHeight={height}/>
                </div>
            </div>
        </div>


        )
}
export default SideBar;
