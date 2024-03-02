import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

function GroupModal({ show, onHide, title, subTitle, content, placeholder, value, onChange, button, button2, buttonTitle, buttonTitle2 }) {
    return (
        <Modal show={show} onHide={onHide} className="my-modal3">
            <Modal.Body>
                <div style={{
                    height: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <div style={{ fontFamily: "pretendard-bold", fontSize: 24, color: "#15A658" }}>{title}</div>
                    <div style={{ fontFamily: "pretendard-regular", fontSize: 13, color: "#727272" }}>{subTitle}</div>
                    <div style={{
                        marginTop: 50,
                        marginBottom: 10,
                        color: "#7D8395",
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontFamily: "pretendard-semibold",
                        fontSize: 16,
                    }}>{content}</div>
                    <input
                        type="text"
                        value={value}
                        placeholder={placeholder}
                        onChange={onChange}
                        // onKeyDown={handleKeyDown}
                        style={{
                            marginRight: 20,
                            border: "1px solid #B4B4B4",
                            background: "#EDEDED",
                            color: "#727272",
                            borderRadius: 50,
                            fontFamily: "pretendard-regular",
                            fontSize: 14,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '37px',
                            width: 380,
                            textAlign: 'center',
                        }}

                    />
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: '10px',
                        justifyContent: 'space-between',
                        width: '100%',

                    }}>
                        <div style={{
                            border: "none",
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 70,
                            borderRadius: 50,
                            fontSize: 16,
                            width: 100,
                            cursor: "pointer",
                            background: "#E1E1E1",
                            fontFamily: "pretendard-regular",
                            color: "#727272",

                        }} onClick={button}>{buttonTitle}</div>
                        <div style={{
                            border: "1px solid #15A658",
                            height: 42,
                            width: 140,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 70,
                            borderRadius: 50,
                            fontSize: 16,
                            cursor: "pointer",
                            background: "#15A658",
                            fontFamily: "pretendard-regular",
                            color: "white",
                        }} onClick={button2}>{buttonTitle2}</div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default GroupModal;
