import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, Icon, InputGroup, Modal, Uploader } from 'rsuite';
import { useModelState } from '../../../misc/custom-hooks';
import { storage } from '../../../misc/firebase';

const MAX_FILE_SIZE = 1000 * 1024 * 5;


const AttachmentBtnModal = ({afterUpload}) => {
    const { chatId } = useParams();
    const { isOpen, close, open } = useModelState();
    const [fileList, setFileList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const onChange = (fileArr) => {

        const filtered = fileArr.filter(el => el.blobFile.size <= MAX_FILE_SIZE).slice(0, 5);
        setFileList(filtered);
    }
    const onUpload = async () => {
        try {
            setIsLoading(true);
            const uploadPromises = fileList.map(f => {
                return storage
                    .ref(`/chat/${chatId}`)
                    .child(Date.now() + f.name)
                    .put(f.blobFile,
                        {
                            cacheControl: `public, max-age=${3600 * 12 * 3}`,
                        });

            });
            const uploadSnapshots = await Promise.all(uploadPromises);
            const shapePromises = uploadSnapshots.map(async snap => {
                return {
                    contentType: snap.metadata.contentType,
                    name: snap.metadata.name,
                    url: await snap.ref.getDownloadURL()
                }
            })
            const files = await Promise.all(shapePromises);
            await afterUpload(files);
            setIsLoading(false);
            close();
        }

        catch (err) {
            setIsLoading(false);
            Alert.error(err.message, 5000);
        }
    }

    return (
        <>
            <InputGroup.Button onClick={open}>
                <Icon icon="attachment" />
            </InputGroup.Button>
            <Modal show={isOpen} onHide={close} >
                <Modal.Header>
                    <Modal.Title>Upload Files </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <Uploader
                        autoUpload={false}
                        action=""
                        fileList={fileList}
                        onChange={onChange}
                        multiple
                        listType="picture-text"
                        className="w-100"
                        />
                   </Modal.Body>
                <Modal.Footer>
                    <Button block disabled={isLoading} onClick={onUpload} >
                        Send to Chat
                    </Button>
                    <div className="text-right mt-2">
                        <small> * only files less than 5 MBs are  allowed</small>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AttachmentBtnModal;