import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

function CustomModal({ showModal, handleModalClose, title, subtitle, content, link, buttonName, button, linkFontSize, linkWidth, handleInputChange, placeholder, type, handleKeyDown }) {
    return (
        <Modal show={showModal} onHide={handleModalClose} className="my-modal2" >
            <Modal.Body>
                <div style={{
                    height: '150px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',

                }}>
                    <div style={{ fontFamily: "pretendard-semibold", fontSize: 24, color: "#15A658" }}>{title}</div>
                    <div style={{ fontFamily: "pretendard-regular", fontSize: 13, color: "#727272" }}>{subtitle}</div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: '45px',
                    }}>
                        <div style={{
                            marginRight: 15,
                            color: "#606574",
                            display: 'flex', // Flex 컨테이너 설정
                            justifyContent: 'center', // 가로 중앙 정렬
                            alignItems: 'center', // 세로 중앙 정렬
                            fontFamily: "pretendard-semibold",
                            fontSize: 14,
                        }}>{content}</div>
                        <input
                            type="text"
                            value={link}
                            placeholder={placeholder}
                            readOnly={type}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            style={{
                                marginRight: 20,
                                border: "1px solid #B4B4B4",
                                background: "#EDEDED",
                                color: "#727272",
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '37px',
                                borderRadius: 50,
                                fontFamily: "pretendard-regular",
                                width: linkWidth, // 외부에서 받아온 값
                                fontSize: linkFontSize, // 외부에서 받아온 값
                                textAlign: 'center', // 텍스트를 가운데 정렬합니다.
                            }}

                        />
                        <div style={{
                            border: "1px solid #15A658",
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingRight: 23,
                            paddingLeft: 23,
                            borderRadius: 50,
                            fontSize: 16,
                            cursor: "pointer",
                            background: "#15A658",
                            fontFamily: "pretendard-semibold",
                            color: "white",
                        }} onClick={button}>{buttonName}</div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default CustomModal;
