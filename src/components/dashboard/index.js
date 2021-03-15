import React from 'react';
// import fb from 'firebase/app';
import { Button, Drawer, Divider, Alert} from 'rsuite';
import { useProfile } from '../../context/profile.context';
import { database } from '../../misc/firebase';
import EditableInput from '../EditableInput';
import AvatarUploadBtn from './AvatarUploadBtn';
import ProviderBlock from './ProviderBlock';
 import { getUserUpdates } from '../../misc/helpers';

const Dashboard = ({ onSignOut}) => {
    const {  profile } = useProfile();
    const onSave = async newData => {
         // const userNickNameRef = database.ref(`/profiles/${profile.uid}`).child('name')
        try {
            // await userNickNameRef.set(newData);
            const updates = await getUserUpdates(profile.uid, 'name', newData, database);
            
            await database.ref().update(updates);
            Alert.success('Nick name has been updated', 5000);

        }
        catch (err) {
            Alert.error(err.message, 5000);
        }
    }  
    return (
        <>
        <Drawer.Header>
            <Drawer.Title> Dashboard</Drawer.Title>
        </Drawer.Header>
            <Drawer.Body>
                <h3> Hey, {profile.name} </h3>
                <ProviderBlock/>
            <Divider />
            
            <EditableInput
                name="nickname"
                initialValue={profile.name}
                onSave={onSave}
                label={<h6 claasName="mb-2"> Nick Name </h6>}
                />
                <AvatarUploadBtn />
            </Drawer.Body>
            <Drawer.Footer>
                <Button block color="red" onClick={onSignOut}>
                Sign Out</Button>
            </Drawer.Footer>
    </>


    )
}
export default Dashboard;
