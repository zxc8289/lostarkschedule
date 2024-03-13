import React, { useEffect, useState } from 'react';
import { Modal, ProgressBar } from 'react-bootstrap';
import './modal.css';

function MessageModal({ show, onHide, title }) {

    return (
        <Modal show={show} onHide={onHide} className='message-modal'>
            <Modal.Body >
                <div style={{
                    display: 'flex', flexDirection: 'column', padding: 20, textAlign: 'center', gap: 20
                }}>
                    <div style={{ fontSize: 20, color: '#15A658', fontFamily: 'pretendard-bold' }}>{title}</div>

                </div>
            </Modal.Body>
        </Modal>
    );
}

export default MessageModal;
