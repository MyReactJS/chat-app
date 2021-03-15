import React from 'react';
import firebase from 'firebase/app';

import { Container, Grid, Row, Col, Panel, Button, Icon, Alert } from 'rsuite';
import { auth, database } from '../misc/firebase';

const SignIn = () => {
    const onSignInWithProvider =  async provider => {
       /* const results =  auth.signOut();
         console.log('Result: ', results); */
        try {
            const { additionalUserInfo, user } = await auth.signInWithPopup(provider);
            if (additionalUserInfo.isNewUser) {
                await database.ref(`/profiles/${user.uid}`).set({
                    name: user.displayName,
                    createdAt:firebase.database.ServerValue.TIMESTAMP
                })
            }
            Alert.success("Success", 10000);
        }
        catch (err) {
            Alert.info(err.message, 10000);
        }
    }
    const onFacebookSignIn = () => {
        onSignInWithProvider(new firebase.auth.FacebookAuthProvider());

    }
    const onGoogleSignIn = () => {
        onSignInWithProvider(new firebase.auth.GoogleAuthProvider());

    }
    return (
        <Container>
            <Grid className="mt-page">
                <Row>
                    <Col xs={24} md={12} mdOffset={6}>
                        <Panel>
                            <div className="text-center">
                                <h2>Welcome to Chat </h2>
                                <p> Progressive chat platform </p>
                            </div>
                            <div className="mt-3">
                                <Button block color="blue" onClick={onFacebookSignIn}> 
                                    <Icon icon ="facebook"/> Continue with Facebook
                                 </Button>
                           
                                <Button block color="green" onClick={onGoogleSignIn}>
                                    <Icon icon="google" /> Continue with Google
                                 </Button>
                            </div>
                        </Panel>
                    </Col>
                </Row>

            </Grid>
        </Container>
        )
}

export default SignIn;