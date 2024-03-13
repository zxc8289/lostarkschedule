import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

function GroupSettingModal({ show, onHide, onClick, onClick2, onChange, onChange2, title, subtitle, subtitle2, textInputName, textInputName2, placeholder }) {
    return (
        <Modal show={show} onHide={onHide} className="my-modal5">
            <Modal.Body>
                <div style={{
                    display: 'flex', flexDirection: 'column', padding: 20, textAlign: 'center', gap: 40
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 10 }}>
                        <div style={{ fontSize: 30, color: '#15A658', fontFamily: 'pretendard-bold' }}>{title}</div>
                        <div style={{ fontSize: 13, color: '#7D8395', fontFamily: 'pretendard-regular' }}>{subtitle}<br />{subtitle2}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 20, paddingLeft: 20 }} >
                        <div style={{
                            display: 'flex', flexDirection: 'row', gap: 20,
                            alignItems: 'center',
                        }}>
                            <div style={{ fontSize: 18, fontFamily: 'pretendard-semibold', color: '#434346' }}>{textInputName}</div>
                            <input
                                placeholder={placeholder}
                                onChange={onChange}
                                type="text"
                                style={{
                                    border: "1px solid #B4B4B4",
                                    background: "#EDEDED",
                                    color: "#727272",
                                    borderRadius: 50,
                                    fontFamily: "pretendard-regular",
                                    fontSize: 14,
                                    height: 37,
                                    width: 350,
                                    textAlign: 'left',
                                    paddingLeft: 20
                                }} />
                        </div>
                        <div style={{
                            display: 'flex', flexDirection: 'row', gap: 20,
                            alignItems: 'center', fontFamily: 'pretendard-semibold',
                        }}>
                            <div style={{ fontSize: 18, fontFamily: 'pretendard-semibold', color: '#434346' }}>{textInputName2}</div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: "1px solid #B4B4B4",
                                background: "#EDEDED",
                                borderRadius: 50,
                                height: 37,
                                width: 350,
                                paddingLeft: 20,
                                paddingRight: 20,
                            }}>
                                <select
                                    onChange={onChange2}
                                    style={{
                                        border: "none",
                                        background: "transparent",
                                        color: "#606574",
                                        fontFamily: "pretendard-semibold",
                                        fontSize: 14,
                                        width: '100%',
                                        paddingLeft: 0,
                                        outline: 'none',
                                    }}>
                                    <option value="option1">그룹을 만든 사람만</option>
                                    <option value="option2">초대된 모든 사용자</option>
                                </select>
                            </div>
                            (미완성)
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', flex: 1, justifyContent: 'space-between', padding: '0px 20px 0px 20px', marginTop: 30 }}>
                        <div
                            onClick={() => onClick()}
                            style={{
                                border: "none",
                                borderRadius: 50,
                                fontSize: 16,
                                cursor: "pointer",
                                background: "#E1E1E1",
                                fontFamily: "pretendard-regular",
                                color: "#727272",
                                padding: "9px 26px 9px 26px",
                            }}>닫기</div>
                        <div
                            onClick={() => onClick2()}
                            style={{
                                border: "none",
                                borderRadius: 50,
                                fontSize: 16,
                                cursor: "pointer",
                                background: "#15A658",
                                fontFamily: "pretendard-regular",
                                color: "white",
                                padding: "9px 26px 9px 26px"
                            }}>완료</div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default GroupSettingModal;
