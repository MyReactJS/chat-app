import React, { useState,createContext, useContext, useEffect } from 'react';
import firebase from 'firebase/app';
import { auth, database } from '../misc/firebase';

export const isOfflineForDatabase = {
    state: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
    state: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
};
const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    

    useEffect(() => {
        let userRef;
        let userStatusRef;
        const authUnsub=auth.onAuthStateChanged(authObj => {
            if (authObj) {

                userRef = database.ref(`/profiles/${authObj.uid}`);
                userRef.on('value', snap => {
                    const { name, createdAt,avatar } = snap.val();
                    const data = {
                        name,
                        createdAt,
                        avatar,
                        uid: authObj.uid,
                        email: authObj.email,

                    };
                    setProfile(data);
                    setIsLoading(false);
                });

                userStatusRef = database.ref(`/status/${authObj.uid}`);

                database.ref('.info/connected').on('value', function (snapshot) {                  
                    if (!!snapshot.val() === false) {
                        return;
                    }

                    
                    userStatusRef.onDisconnect().set(isOfflineForDatabase).then(function () {                
                        userStatusRef.set(isOnlineForDatabase);
                    });
                });
            
            }
            else {
                if (userRef) {
                    userRef.off();
                }
                if (userStatusRef) {
                    userStatusRef.off();
                }
                database.ref('.info/connected').off();
                setProfile(null);
                setIsLoading(false);
            }

        });
        return () => {
            authUnsub();
            if (userRef) {
                userRef.off();
            }
            database.ref('.info/connected').off();
            if (userStatusRef) {
                userStatusRef.off();
            }
        }
    }, []);
    return (
        <ProfileContext.Provider value={{ isLoading, profile }}>
            {children}
        </ProfileContext.Provider>
        )
};
export default ProfileProvider;
export const useProfile = ()=>useContext(ProfileContext);