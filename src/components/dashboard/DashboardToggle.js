import React, { useCallback } from 'react';
import { Button, Drawer, Icon , Alert} from 'rsuite';
import Dashboard from '.';
import { useMediaQuery, useModelState } from '../../misc/custom-hooks';
import { auth } from '../../misc/firebase';

const DashboardToggle = () => {
    const { isOpen, open, close } = useModelState();
    const onSignOut = useCallback(() => {

        auth.signOut();
        Alert.info('Signed Out', 5000);
        close();
    }, [close]);
    const isMobile = useMediaQuery('(max-Width: 992 px)');
    return (
        <div >
            <Button block color="blue" onClick={open}>
                <Icon icon="dashboard"/> Dashboard
            </Button>

            <Drawer full={isMobile} show={isOpen} onHide={close} placement='left'>
                <Dashboard onSignOut={onSignOut}/>               
            </Drawer>

        </div>
        

    );
}

export default DashboardToggle;