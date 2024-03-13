import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import './modal.css';

function ScheduleModal({ show, onHide, title, days, handleDayClick, selectedDay, startTime, endTime, handleTimeChange, addTimeToDay, registration, partyLeader, buttonName, deleteButton, createdBy, userId }) {
    return (
        <Modal show={show} onHide={onHide} className='schedule-modal'>
            <Modal.Body>
                <div style={{
                    display: 'flex', flexDirection: 'column', padding: 50, textAlign: 'center',
                }}>
                    <div style={{ fontSize: 16, color: '#0A0A0A', fontFamily: 'pretendard-semibold', marginBottom: 30 }}>{title}</div>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                        {days.map(day => (
                            <div
                                style={{
                                    background: "#FFFFFF",
                                    padding: "10px",
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 190,
                                    width: 150,
                                    fontFamily: 'Pretendard-SemiBold',
                                    borderColor: selectedDay === day.name ? '#15A658' : 'transparent',
                                    borderWidth: selectedDay === day.name ? '2px' : '0',
                                    borderStyle: 'solid',
                                }}
                                key={day.name}
                                onClick={() => handleDayClick(day)}
                            >
                                <div style={{ marginBottom: 20, fontSize: 16, color: "#0A0A0A", }}>{day.name}</div>
                                {day.times.map((time, index) => (
                                    <div>
                                        <div style={{ background: "#D9D9D9", marginBottom: 5, padding: "7px 5px" }} key={index}>{time}  </div>
                                        {!partyLeader && (<div onClick={() => deleteButton(day)}>삭제(임시버튼)</div>)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {selectedDay && !partyLeader && (
                        <div style={{ display: 'flex', flexDirection: 'column', background: "#FFFFFF", padding: "15px 20px 20px 20px", fontFamily: 'pretendard-semibold', width: 230 }}>
                            <div style={{ marginBottom: 20, textAlign: 'center', }}>가능 시간대 입력</div>
                            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', marginBottom: 20 }}>
                                <input
                                    type="text"
                                    name="startTime"
                                    value={startTime}
                                    onChange={handleTimeChange}
                                    placeholder="HH:MM"
                                    maxLength="5"
                                    style={{
                                        background: "#D9D9D9",
                                        color: "#0A0A0A",
                                        width: "80px",
                                        padding: "3px",
                                        textAlign: "center",
                                        border: "none"
                                    }}
                                />
                                <span>~</span>
                                <input
                                    type="text"
                                    name="endTime"
                                    value={endTime}
                                    onChange={handleTimeChange}
                                    placeholder="HH:MM"
                                    maxLength="5"
                                    style={{
                                        background: "#D9D9D9",
                                        color: "#0A0A0A",
                                        width: "80px",
                                        padding: "3px",
                                        textAlign: "center",
                                        border: "none"
                                    }}
                                />
                            </div>
                            <div style={{
                                background: "#D9D9D9",
                                color: "#0A0A0A",
                                padding: "3px 0px 3px 0px",
                                textAlign: "center",
                                border: "none",
                                cursor: 'pointer'
                            }} onClick={addTimeToDay}>저장</div>
                        </div>
                    )}

                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        fontFamily: 'pretendard-semibold',
                        width: '100%'
                    }}>

                        {createdBy === userId && (
                            < div style={{
                                background: "#FFFFFF",
                                padding: "8px 15px",
                                fontFamily: 'pretendard-semibold',
                            }} onClick={registration}>{buttonName}</div>
                        )}
                    </div>

                </div>
            </Modal.Body>
        </Modal >
    );
}

export default ScheduleModal;
