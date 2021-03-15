import React, { useState,useRef} from 'react';
import { Alert, Button, Modal } from 'rsuite';
import AvatarEditor from 'react-avatar-editor';
import { useModelState } from '../../misc/custom-hooks';
import { storage, database } from '../../misc/firebase';
import { useProfile } from '../../context/profile.context';
import ProfileAvatar from '../ProfileAvatar';



const AVATAR_FILE_TYPE = ".png,.jpeg, .jpg";
const acceptedFielTypes = ['image/png', 'image/jpeg', 'image/jpg'];
const isValidFile = (file) => acceptedFielTypes.includes(file.type);
const getBlob = (canvas) => {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            }
            else {
                reject(new Error('File process error'));
            }
        });
    });
};
const AvatarUploadBtn = () => {
    const { profile } = useProfile();
    const { isOpen, open, close } = useModelState();
    const [img,setImg] = useState(null);
    const avatarEditorRef = useRef();
    const [isLoading, setIsLoading] = useState(false);

    const onFileInputChange = event => {
        const currFiles = event.target.files;
        if (currFiles.length === 1) {
            const file = currFiles[0];
            if (isValidFile(file)) {
                setImg(file);
                
                open();
            }
            else {
                Alert.warning(`Wrong file type ${file.type}`, 5000);
            }
        }
    }
    const onUploadClick = async () => {
        const canvas = avatarEditorRef.current.getImageScaledToCanvas();
        setIsLoading(true);
        try {

            const blob= await getBlob(canvas);
            const avatarFileRef = storage.ref(`/profiles/${profile.uid}`).child('avatar');
            const uploadAvatarResult = await avatarFileRef.put(blob, { cacheControl: `public,max-age=${3600 * 24 * 3}` }
            );
            const downloadUrl = await uploadAvatarResult.ref.getDownloadURL();
            const userAvatarRef = database.ref(`/profiles/${profile.uid}`).child('avatar');
            userAvatarRef.set(downloadUrl);
            setIsLoading(true);
            Alert.info('Avatar has been uploaded', 5000);
            
        }
        catch (err) {
            setIsLoading(false);
            Alert.error(err.message, 5000);

        }
    }
    return (
        <div className="mt-3 text-center">
            <ProfileAvatar src={profile.avatar} name={profile.name} className="width-200 height-200 img-fullsize font-huge"/>
            <div>
                <label htmlFor="avatar-upload" className="d-block curesor-pointed padded"> Select  new avatar
                    <input id="avatar-upload" type="file" className="d-none" accept={AVATAR_FILE_TYPE}
                        onChange={onFileInputChange} />
                </label>
                <Modal show={isOpen} onHide={close}>
                    <Modal.Header>
                        <Modal.Title>
                            Adjust or Upload New Avatar
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex justify-content-center align-items-center h-100" >
                        {img &&
                                <AvatarEditor
                                ref={avatarEditorRef}
                            image={img}
                                width={200}
                                height={200}
                                border={10}
                                borderRadius={100}
                                rotate={0}
                            />
                            }
                            </div>
                        </Modal.Body>
                    <Modal.Footer>
                        <Button block appearance='ghost' onClick={onUploadClick} disabled={isLoading}>  Upload new avatar </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

export default AvatarUploadBtn;