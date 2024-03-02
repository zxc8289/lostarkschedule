import React, { useEffect, useState } from 'react';
import { auth, db } from "../../firebase";
import { ref, set, push, child, onValue, update } from "firebase/database";
import { Card, ListGroup, Button, Modal, Form, Spinner, Nav, Navbar, Container } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { CiSettings } from "react-icons/ci";
import './groupCreator.css';
import { useNavigate } from 'react-router-dom';
import RaidSchedule from '../raidScheduleCreator/raidSchedule';
import ApiKeyForm from '../../componnent/apikeyform/apiKeyForm';
import GroupModal from '../../componnent/modal/groupModal';
import GroupSettingModal from '../../componnent/modal/groupSettingModal';

function GroupCreator() {
    const [roomTitle, setRoomTitle] = useState('');
    const [groupTitle, setGroupTitle] = useState('');
    const [groupPermissions, setGroupPermissions] = useState('option1');
    const [showModal, setShowModal] = useState(false);  // 그룹 추가창 모달 상태
    const [groupCreationModal, setGroupCreationModal] = useState(false);    // 그룹 생성창 모달 상태
    const [groupParticipationModal, setGroupParticipationModal] = useState(false);    // 그룹 참여창 모달 상태
    const [groupSettingModal, setGroupSettingModal] = useState(false);    // 그룹 설정창 모달 상태


    const [raidSchedules, setRaidSchedules] = useState([]); // 변수 이름 변경
    const [isLoading, setIsLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null); // 현재 선택된 메뉴의 ID 상태
    const [createdBy, setCreatedBy] = useState(null); // 현재 선택된 그룹장의 ID
    const [groupJoinId, setGroupJoinId] = useState('');
    const [userApiKey, setUserApiKey] = useState(null); // 사용자 API 키 상태

    // 그룹 추가 모달
    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => {
        setGroupCreationModal(false);
        setGroupParticipationModal(false);
        setShowModal(true);
    }

    // 그룹 생성 모달
    const groupCreationModalClose = () => setGroupCreationModal(false);
    const groupCreationModalShow = () => {
        setShowModal(false);
        setTimeout(() => {
            setGroupCreationModal(true);
        }, 200);
    }

    // 그룹 참여 모달
    const groupParticipationModalClose = () => setGroupParticipationModal(false);
    const groupParticipationModalShow = () => {
        setShowModal(false);
        setTimeout(() => {
            setGroupParticipationModal(true);
        }, 200);
    }

    // 그룹 설정 모달
    const groupSettingModalClose = () => setGroupSettingModal(false);
    const groupSettingModalShow = () => setGroupSettingModal(true);


    const navigate = useNavigate();

    useEffect(() => {
        // 로그인 상태 확인
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                // 로그인한 사용자가 있을 때만 데이터 로드
                loadUserData(user.uid);
            } else {
                // 로그인하지 않은 경우 로그인 페이지로 리디렉트
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, []);

    const loadUserData = (userId) => {
        const userRef = ref(db, `Users/${userId}`);
        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData && userData.apiKey) {
                setUserApiKey(userData.apiKey);
            } else {
                // setShowModal(true);
            }
        });
    };

    useEffect(() => {
        const raidSchedulesRef = ref(db, 'RaidSchedule');
        const unsubscribe = onValue(raidSchedulesRef, (snapshot) => {
            const data = snapshot.val();
            const loadedRaidSchedules = [];
            for (let key in data) {
                // 현재 사용자가 생성한 그룹 또는 참여한 그룹인 경우 목록에 추가
                if (data[key].createdBy === auth.currentUser.uid ||
                    (data[key].members && data[key].members[auth.currentUser.uid])) {
                    loadedRaidSchedules.push({
                        id: key,
                        title: data[key].title,
                        createdBy: data[key].createdBy,
                    });
                }
            }
            setRaidSchedules(loadedRaidSchedules);

            setIsLoading(false);

            // 새로운 raidSchedules 배열이 로드되면 첫 번째 그룹을 선택
            if (loadedRaidSchedules.length > 0) {
                setSelectedId(loadedRaidSchedules[0].id);
            }
        });
        setIsLoading(true);
        return () => unsubscribe();
    }, []);



    const createGroup = () => {
        if (!roomTitle.trim()) {
            alert('방 제목을 입력해주세요.');
            return;
        }

        const userId = auth.currentUser.uid;
        const newRoomKey = push(child(ref(db), 'RaidSchedule')).key;

        // 그룹에 참여자 목록 추가
        set(ref(db, 'RaidSchedule/' + newRoomKey), {
            title: roomTitle,
            createdBy: userId,
            members: {
                [userId]: true // 그룹 생성자를 멤버로 추가
            }
        });

        setRoomTitle('');
        groupCreationModalClose();
    };

    const joinGroup = () => {
        if (!groupJoinId.trim()) {
            alert('그룹 ID를 입력해주세요.');
            return;
        }
        const userId = auth.currentUser.uid;
        // 입력된 그룹 ID의 참여자 목록에 현재 사용자 ID 추가
        const groupRef = ref(db, `RaidSchedule/${groupJoinId}/members`);
        set(child(groupRef, userId), true)
            .then(() => {
                alert('그룹에 참여되었습니다.');
                setGroupJoinId('');
                groupParticipationModalClose();
            })
            .catch((error) => {
                console.error('그룹 참여 실패:', error);
                alert('그룹 참여에 실패했습니다.');
            });
    };


    const handleRoomClick = (raidScheduleId, raidCreatedBy) => { // 파라미터 이름 변경
        setSelectedId(raidScheduleId);
        setCreatedBy(raidCreatedBy);
    };

    // api key 저장 함수
    const saveApiKey = (apiKey) => {
        // API 키 저장
        set(ref(db, `Users/${auth.currentUser.uid}/apiKey`), apiKey)
            .then(() => {
                setUserApiKey(apiKey);
                setShowModal(false);
            })
            .catch((error) => {
                console.error('API 키 저장 실패:', error);
                alert('API 키 저장에 실패했습니다.');
            });
    };

    // 그룹 설정 완료
    const groupSettingComplete = () => {
        // 경로 문자열이 백틱으로 묶여 있는지 확인
        update(ref(db, `RaidSchedule/${selectedId}`), { title: groupTitle })
            .then(() => {
                groupSettingModalClose();
            })
            .catch((error) => {
                console.error('그룹 설정 실패:', error);
            });

    };



    if (isLoading) {
        // 로딩 중 로딩 인디케이터 표시
        return <div className="text-center">
            <div className="spinner-border" style={{ width: "3rem", height: "3rem", borderWidth: "0.3rem", color: "#15A658" }}>
                <span className="sr-only"></span>
            </div>
        </div>
    }

    if (userApiKey === null) {
        // API 키 입력 폼을 렌더링
        return (
            <ApiKeyForm onSave={(apiKey) => saveApiKey(apiKey)} />
        );
    }

    return (
        <div className="flex-container">
            <Modal show={showModal} onHide={handleModalClose} className="my-modal">
                <Modal.Body>
                    <div style={{
                        height: '180px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',

                    }}>
                        <div style={{ fontFamily: "pretendard-bold", fontSize: 24, color: "#15A658" }}>그룹 추가</div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginTop: '50px',
                            fontSize: 16,
                            fontFamily: "pretendard-semibold",
                            textAlign: 'center'
                        }}>
                            <div>
                                <div style={{ fontSize: 14, fontFamily: "pretendard-regular", marginBottom: 10, color: "#727272" }}>새로운 그룹을 만들고싶다면</div>
                                <button onClick={() => groupCreationModalShow()} style={{ cursor: 'pointer', background: "#15A658", color: "white", width: 240, height: 40, border: 'none', borderRadius: 50 }}>
                                    그룹 생성하기
                                </button>
                            </div>
                            <div style={{ marginLeft: 50 }}>
                                <div style={{ fontSize: 14, fontFamily: "pretendard-regular", marginBottom: 10, color: "#727272" }} >기존에 있는 그룹에 초대를 받았다면</div>
                                <button onClick={() => groupParticipationModalShow()} style={{ cursor: 'pointer', background: "#15A658", color: "white", width: 240, height: 40, border: 'none', borderRadius: 50 }}>
                                    그룹에 참여하기
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <GroupModal show={groupCreationModal} onHide={() => groupCreationModalClose()} title="그룹 생성" subTitle="그룹을 생성하고 레이드를 함께 갈 그룹원을 초대할 수 있어요." content="그룹 이름" placeholder="그룹 이름을 입력하세요." value={roomTitle} onChange={(e) => setRoomTitle(e.target.value)} button={handleModalShow} button2={createGroup} buttonTitle="뒤로" buttonTitle2="생성하기" />
            <GroupModal show={groupParticipationModal} onHide={() => groupParticipationModalClose()} title="그룹 참여" subTitle="초대를 받았다면 그룹에 참여할 수 있어요." content="초대 링크 입력" placeholder="초대 링크를 이 곳에 입력해주세요." value={groupJoinId} onChange={(e) => setGroupJoinId(e.target.value)} button={handleModalShow} button2={joinGroup} buttonTitle="뒤로" buttonTitle2="참여하기" />

            <div className="flex-left">
                {/* 좌측 컴포넌트 내용 */}
            </div>


            <div className="flex-center">
                <div style={{ marginBottom: '15px' }}>
                    <h4 style={{ color: "#15A658", marginBottom: '5px' }}>주간 레이드 숙제</h4>
                    <p style={{ color: "#7D8395", fontSize: 12, marginTop: '-5px' }}>그룹원들의 레이드 완료 현황을 확인하세요.</p>
                </div>

                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {raidSchedules.map((raidSchedule) => (
                                <div style={{ display: 'flex', alignItems: 'center', marginRight: 30 }}>
                                    <div
                                        key={raidSchedule.id}
                                        onClick={() => handleRoomClick(raidSchedule.id, raidSchedule.createdBy)}
                                        style={{
                                            cursor: 'pointer',
                                            borderBottom: selectedId === raidSchedule.id ? '2px solid #15A658' : 'none',
                                            fontFamily: selectedId === raidSchedule.id ? "pretendard-semibold" : "pretendard-regular",
                                            fontSize: selectedId === raidSchedule.id ? 25 : 20,
                                        }}
                                    >
                                        {raidSchedule.title}

                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {raidSchedule.createdBy === auth.currentUser.uid && selectedId === raidSchedule.id ? (
                                            <CiSettings onClick={() => groupSettingModalShow()} style={{ fontSize: '25px', cursor: 'pointer' }} />
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="groupcreator-addbutton" onClick={() => handleModalShow()}>
                            + 그룹
                        </div>
                    </div>
                </div>
                <GroupSettingModal show={groupSettingModal} onHide={() => groupSettingModalClose()} onClick={groupSettingModalClose} onClick2={groupSettingComplete} onChange={(e) => setGroupTitle(e.target.value)} onChange2={(e) => setGroupPermissions(e.target.value)} />

                {selectedId && <RaidSchedule id={selectedId} createdBy={createdBy} />}
            </div>
            <div className="flex-right">

            </div>
        </div >

    );
}

export default GroupCreator;
