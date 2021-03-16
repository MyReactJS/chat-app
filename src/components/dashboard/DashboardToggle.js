import React, { useCallback } from 'react';
import { Button, Drawer, Icon , Alert} from 'rsuite';
import Dashboard from '.';
import { useMediaQuery, useModelState } from '../../misc/custom-hooks';
import { auth, database } from '../../misc/firebase';
import { isOfflineForDatabase } from '../../context/profile.context';

const DashboardToggle = () => {
    const { isOpen, open, close } = useModelState();
    const onSignOut = useCallback(() => {
        database.ref(`/status/${auth.currentUser.uid}`).set(isOfflineForDatabase).then(() => {
            auth.signOut();
            Alert.info('Signed Out', 5000);
            close();
        })
            .catch(err => {
                Alert.error(err.message);
            });
        
       
        
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