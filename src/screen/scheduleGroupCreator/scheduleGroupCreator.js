import React, { useEffect, useRef, useState } from 'react';
import ScheduleModal from '../../componnent/modal/scheduleModal';
import { auth, db } from "../../firebase";
import { ref, set, push, child, onValue, update, get, remove } from "firebase/database";
import { CiSettings } from "react-icons/ci";
import { Modal } from 'react-bootstrap';
import GroupModal from '../../componnent/modal/groupModal';
import useOutsideAlerter from '../../hoook/useOutsideAlerter';
import { MdExpandMore } from 'react-icons/md';
import CustomModal from "../../componnent/modal/customModal";
import GroupSettingModal from '../../componnent/modal/groupSettingModal';
import NProgress from 'nprogress';
import { onAuthStateChanged } from 'firebase/auth';


function ScheduleGroupCreator() {
    const [partyTitle, setPartyTitle] = useState('');
    const [partyContent, setPartyContent] = useState('');

    const [userLoginId, setUserLoginId] = useState();
    const [selectedId, setSelectedId] = useState(null); // 현재 선택된 메뉴의 ID 상태
    const [raidSchedules, setRaidSchedules] = useState([]); // 변수 이름 변경
    const [createdBy, setCreatedBy] = useState(null); // 현재 선택된 그룹장의 ID

    const [showModal, setShowModal] = useState(false);  // 그룹 추가창 모달 상태
    const [groupCreationModal, setGroupCreationModal] = useState(false);    // 그룹 생성창 모달 상태
    const [groupParticipationModal, setGroupParticipationModal] = useState(false);    // 그룹 참여창 모달 상태
    const [groupJoinId, setGroupJoinId] = useState('');

    // 스케줄 등록
    const [weeklyScheduleRegistrationModal, setWeeklyScheduleRegistrationModal] = useState(false);
    const [scheduleRegistrationModal, setScheduleRegistrationModal] = useState(false);
    const [scheduleConfirmationModal, setScheduleConfirmationModal] = useState(false);

    const [selectedDay, setSelectedDay] = useState(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [confirmedDays, setConfirmedDays] = useState([]); // 확정일


    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRef = useRef(null);
    useOutsideAlerter(dropdownRef, setOpenDropdownId);

    const [isLinkVisible, setIsLinkVisible] = useState(false);
    const [inviteLink, setInviteLink] = useState();
    const isLinkVisibleModalClose = () => setIsLinkVisible(false);
    const isLinkVisibleModalShow = (id) => {
        setInviteLink(id);
        setIsLinkVisible(true);
    };


    // 그룹 설정 모달
    const [groupSettingModal, setGroupSettingModal] = useState(false);    // 그룹 설정창 모달 상태
    const [groupTitle, setGroupTitle] = useState('');
    const [groupPermissions, setGroupPermissions] = useState('option1');
    const groupSettingModalClose = () => setGroupSettingModal(false);
    const groupSettingModalShow = (id) => {
        setSelectedId(id);
        setGroupSettingModal(true);
    }


    const weeklyScheduleRegistrationClose = () => {
        setWeeklyScheduleRegistrationModal(false);
    }


    const weeklyScheduleRegistrationShow = () => {
        setWeeklyScheduleRegistrationModal(true);
    }

    const scheduleRegistrationClose = () => {
        setScheduleRegistrationModal(false);
        setSelectedDay(null);
        setDays([{ name: '수', times: [] },
        { name: '목', times: [] },
        { name: '금', times: [] },
        { name: '토', times: [] },
        { name: '일', times: [] },
        { name: '월', times: [] },
        { name: '화', times: [] },]);
    };

    const scheduleRegistrationShow = (id, createdBy) => {
        const userId = auth.currentUser.uid;
        const selectedParty = raidSchedules.find(party => party.id === id);

        if (selectedParty && selectedParty.membersDays && selectedParty.membersDays[userId]) {
            const userDays = selectedParty.membersDays[userId];
            const processedDays = userDays.map(day => ({
                name: day.name,
                times: day.times ? day.times : []
            }));

            setDays(processedDays);
        }

        setSelectedId(id);
        setScheduleRegistrationModal(true);
    };


    const scheduleConfirmationClose = () => {
        setScheduleConfirmationModal(false);
        setSelectedDay(null);
    };

    const scheduleConfirmationShow = (id, createdBy) => {
        const userId = auth.currentUser.uid;
        const selectedParty = raidSchedules.find(party => party.id === id);
        const memberCount = Object.keys(selectedParty.membersName).length;
        // membersDays가 undefined 또는 null인 경우 빈 객체를 기본값으로 설정
        const membersDays = selectedParty ? selectedParty.membersDays : {};
        const commonTimesByDay = {};
        const dayNames = ['수', '목', '금', '토', '일', '월', '화'];

        dayNames.forEach(day => {
            // 아무것도 입력되지 않았을 때 기본적으로 빈 배열을 할당
            if (!membersDays || Object.keys(membersDays).length === 0) {
                commonTimesByDay[day] = [];
            } else {
                let allMemberTimes = [];
                Object.values(membersDays).forEach(memberDays => {
                    memberDays.forEach(memberDay => {
                        if (memberDay.name === day && memberDay.times) {
                            const times = memberDay.times.map(time => {
                                const [start, end] = time.split('~').map(t => t.trim());
                                return { start, end };
                            });
                            allMemberTimes.push(times);
                        }
                    });
                });

                // 해당 요일에 시간을 입력한 멤버가 1명보다 많을 때만 공통 시간대 계산
                if (allMemberTimes.length == memberCount) {
                    let commonTimes = allMemberTimes[0];
                    for (let i = 1; i < allMemberTimes.length; i++) {
                        let tempCommonTimes = [];
                        commonTimes.forEach(ct => {
                            allMemberTimes[i].forEach(at => {
                                const startMax = ct.start >= at.start ? ct.start : at.start;
                                const endMin = ct.end <= at.end ? ct.end : at.end;
                                if (startMax < endMin) {
                                    tempCommonTimes.push({ start: startMax, end: endMin });
                                }
                            });
                        });
                        commonTimes = tempCommonTimes;
                    }
                    commonTimesByDay[day] = commonTimes.map(time => `${time.start}~${time.end}`);
                } else {
                    commonTimesByDay[day] = [];
                }
            }
        });

        const updatedDays = dayNames.map(day => ({
            name: day,
            times: commonTimesByDay[day] || []
        }));

        console.log(userId);
        setUserLoginId(userId);
        setCreatedBy(createdBy);
        setSelectedId(id);
        setConfirmationDays(updatedDays);
        setScheduleConfirmationModal(true);
    };


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


    // 날짜, 시간 상태
    const [confirmationDays, setConfirmationDays] = useState([
        { name: '수', times: [] },
        { name: '목', times: [] },
        { name: '금', times: [] },
        { name: '토', times: [] },
        { name: '일', times: [] },
        { name: '월', times: [] },
        { name: '화', times: [] },
    ]);


    const [days, setDays] = useState([
        { name: '수', times: [] },
        { name: '목', times: [] },
        { name: '금', times: [] },
        { name: '토', times: [] },
        { name: '일', times: [] },
        { name: '월', times: [] },
        { name: '화', times: [] },
    ]);


    const [thisWeekSchedule, setThisWeekSchedule] = useState([
        { name: '수', times: [] },
        { name: '목', times: [] },
        { name: '금', times: [] },
        { name: '토', times: [] },
        { name: '일', times: [] },
        { name: '월', times: [] },
        { name: '화', times: [] },
    ]);

    const [weeklySchedule, setWeeklySchedule] = useState([
        { name: '수', times: [], title: [], },
        { name: '목', times: [], title: [], },
        { name: '금', times: [], title: [], },
        { name: '토', times: [], title: [], },
        { name: '일', times: [], title: [], },
        { name: '월', times: [], title: [], },
        { name: '화', times: [], title: [], },
    ]);

    useEffect(() => {
        NProgress.start();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userId = user.uid;
                const raidSchedulesRef = ref(db, 'RaidSchedule');
                const userRef = ref(db, `Users/${userId}/thisWeekSchedule`);

                const unsubscribeRaid = onValue(raidSchedulesRef, (snapshot) => {
                    const data = snapshot.val();
                    const loadedRaidSchedules = [];
                    for (let key in data) {
                        if (data[key].createdBy === auth.currentUser.uid ||
                            (data[key].members && data[key].members[auth.currentUser.uid])) {
                            loadedRaidSchedules.push({
                                id: key,
                                title: data[key].title,
                                membersDays: data[key].membersDays,
                                content: data[key].content,
                                createdBy: data[key].createdBy,
                                membersName: data[key].membersName,
                                confirmedDays: data[key].confirmedDays || {}
                            });
                        }
                    }

                    const newWeeklySchedule = [
                        { name: '수', times: [], title: [] },
                        { name: '목', times: [], title: [] },
                        { name: '금', times: [], title: [] },
                        { name: '토', times: [], title: [] },
                        { name: '일', times: [], title: [] },
                        { name: '월', times: [], title: [] },
                        { name: '화', times: [], title: [] },
                    ];


                    loadedRaidSchedules.forEach(schedule => {
                        // confirmedDays가 객체 형태인지 확인하고, 그렇지 않으면 무시
                        if (schedule.confirmedDays && typeof schedule.confirmedDays === 'object' && !Array.isArray(schedule.confirmedDays)) {
                            const { name, times, title } = schedule.confirmedDays;
                            const dayIndex = newWeeklySchedule.findIndex(day => day.name === name);
                            if (dayIndex !== -1) {
                                // times 데이터 추가
                                if (Array.isArray(times)) {
                                    newWeeklySchedule[dayIndex].times.push(...times);
                                }

                                if (title) {
                                    newWeeklySchedule[dayIndex].title.push(title);
                                }
                            }
                        }
                    });

                    setRaidSchedules(loadedRaidSchedules);
                    setWeeklySchedule(newWeeklySchedule);

                    document.fonts.ready.then(() => {
                        NProgress.done();
                    });
                });


                const unsubscribeUserSchedule = onValue(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        // Firebase에서 불러온 객체를 배열로 변환
                        const schedulesArray = Object.entries(data).map(([key, value]) => ({
                            name: value.name,
                            times: value.times || [], // 'times'가 없는 경우 빈 배열 할당
                            // 필요한 경우 여기에 더 많은 속성을 추가할 수 있습니다.
                        }));
                        setThisWeekSchedule(schedulesArray);
                    } else {
                        console.log("No thisWeekSchedule data available.");
                        setThisWeekSchedule([]);
                    }
                });

                return () => {
                    unsubscribeRaid();
                    unsubscribeUserSchedule();
                };
            } else {
                console.log("User is not logged in.");
                NProgress.done();
            }
        });
    }, []);


    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            isLinkVisibleModalClose();
        } catch (err) { }
    };

    // 시작 시간과 종료 시간을 저장하는 핸들러
    const handleTimeChange = (e) => {
        const { name, value } = e.target;
        const input = value.replace(/[^0-9]/g, ''); // 숫자만 입력받음

        // 입력값이 완전히 삭제된 경우, 상태를 빈 문자열로 초기화
        if (input.length === 0) {
            if (name === "startTime") {
                setStartTime("");
            } else if (name === "endTime") {
                setEndTime("");
            }
            return; // 조기 반환하여 아래 로직을 실행하지 않음
        }

        let time = input;

        if (input.length <= 2) {
            time = input;
        } else if (input.length === 3) {
            time = `${input.slice(0, 1)}:${input.slice(1, 3)}`;
        } else if (input.length >= 4) {
            time = `${input.slice(0, 2)}:${input.slice(2, 4)}`;
        }

        const hours = parseInt(time.slice(0, 2), 10);
        const minutes = time.length > 2 ? parseInt(time.slice(3, 5), 10) : 0;

        if (!isNaN(hours) && hours < 24 && !isNaN(minutes) && minutes <= 59) {
            if (name === "startTime") {
                setStartTime(time);
            } else if (name === "endTime") {
                setEndTime(time);
            }
        }
    };


    // 시간 추가 핸들러
    const addTimeToDay = () => {
        if (selectedDay) {
            // 선택한 요일에 대한 day 객체를 찾습니다.
            const dayIndex = days.findIndex(day => day.name === selectedDay);

            // 시작 시간과 종료 시간이 "HH:MM" 형식에 부합하는지 검사
            const timeFormatRegex = /^\d{2}:\d{2}$/;
            if (!timeFormatRegex.test(startTime) || !timeFormatRegex.test(endTime)) {
                alert('시간은 "HH:MM" 형식으로 입력해야 합니다.');
                return;
            }

            // 시작 시간과 종료 시간의 유효성 검사
            if (startTime >= endTime) {
                alert('시작 시간은 종료 시간보다 이전이어야 합니다.');
                return;
            }

            const updatedDays = [...days];
            if (dayIndex !== -1) { // 선택한 요일이 days 배열에 존재하는 경우
                const dayObject = updatedDays[dayIndex];
                if (dayObject.times && dayObject.times.length > 0) {
                    // 이미 시간 데이터가 존재하는 경우, 시간 데이터를 수정합니다.
                    dayObject.times = dayObject.times.map(time => `${startTime} ~ ${endTime}`);
                } else {
                    // 시간 데이터가 없는 경우, 새로운 시간을 추가합니다.
                    dayObject.times = [`${startTime} ~ ${endTime}`];
                }
                updatedDays[dayIndex] = dayObject;
            } else {
                // 선택한 요일이 days 배열에 없는 경우, 새로운 요일과 시간을 추가합니다.
                updatedDays.push({ name: selectedDay, times: [`${startTime} ~ ${endTime}`] });
            }

            // 상태 업데이트
            setThisWeekSchedule(updatedDays);
            setDays(updatedDays);
            setStartTime("");
            setEndTime("");
        }
    };

    const registration = () => {
        const userId = auth.currentUser.uid;
        set(ref(db, `RaidSchedule/${selectedId}/membersDays/${userId}`), days);
        scheduleRegistrationClose();
    };

    const confirmed = () => {
        set(ref(db, `RaidSchedule/${selectedId}/confirmedDays/`), confirmedDays)
            .then(() => {
                alert("확정일이 성공적으로 저장되었습니다.");
                scheduleConfirmationClose();


            })
            .catch((error) => {
                alert(`오류가 발생했습니다: ${error.message}`);
            });
    }

    const createGroup = () => {
        if (raidSchedules.length >= 5) {
            alert("더 이상 파티를 생성할 수 없습니다.");
            return;
        }

        if (partyTitle) {
            const user = auth.currentUser;
            const userId = user.uid;
            const userName = user.displayName
            const newRoomKey = push(child(ref(db), 'RaidSchedule')).key;

            // 그룹에 참여자 목록 추가
            set(ref(db, 'RaidSchedule/' + newRoomKey), {
                title: partyTitle,
                content: partyContent,
                createdBy: userId,
                members: {
                    [userId]: true // 그룹 생성자를 멤버로 추가
                },
                membersName: {
                    [userId]: userName // 여기에 사용자 이름을 추가
                }
            });
        }

        setPartyTitle('');
        groupCreationModalClose();
    };

    const joinGroup = () => {
        if (!groupJoinId.trim()) {
            alert('그룹 ID를 입력해주세요.');
            return;
        }
        const user = auth.currentUser;
        const userId = user.uid;
        const userName = user.displayName; // 사용자 이름 가져오기

        // 입력된 그룹 ID에 현재 사용자 ID와 이름을 추가
        const groupRef = ref(db, `RaidSchedule/${groupJoinId}`);
        const updates = {};
        updates[`members/${userId}`] = true; // 멤버 ID 추가
        updates[`membersName/${userId}`] = userName; // 멤버 이름 추가

        update(groupRef, updates)
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

    // 요일 클릭 핸들러
    const handleDayClick = (day) => {
        const userId = auth.currentUser.uid;
        const userDays = raidSchedules.find(party => party.id === selectedId)?.membersDays?.[userId];
        const dayData = userDays?.find(d => d.name === day.name);

        if (dayData && dayData.times && dayData.times.length > 0) {
            const [start, end] = dayData.times[0].split(' ~ ');
            setStartTime(start);
            setEndTime(end);
        } else {
            setStartTime("");
            setEndTime("");
        }

        setSelectedDay(day.name);
        // setConfirmedDays(dayData);
    };


    const handleconfirmedDayClick = (day) => {
        const partyTitle = raidSchedules.find(party => party.id === selectedId);
        const selectedDayData = confirmationDays.find(d => d.name === day.name);

        // 선택된 요일 데이터에 파티 제목을 추가
        const updatedSelectedDayData = {
            ...selectedDayData,
            title: partyTitle.title
        };
        setSelectedDay(day.name);
        setConfirmedDays(updatedSelectedDayData);
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


    const leaveGroupButton = async (createdBy, raidScheduleId) => {
        try {
            // 그룹 정보를 가져옵니다.
            const raidScheduleRef = ref(db, `/RaidSchedule/${raidScheduleId}`);
            const raidScheduleSnapshot = await get(raidScheduleRef);
            const raidScheduleData = raidScheduleSnapshot.val();

            // 현재 사용자가 그룹장일 경우
            if (createdBy === auth.currentUser.uid) {

                // 멤버 목록에서 현재 사용자를 제외합니다.
                const remainingMembers = Object.keys(raidScheduleData.members).filter(memberId => memberId !== auth.currentUser.uid);

                // 남은 멤버가 있는 경우
                if (remainingMembers.length > 0) {
                    // 남은 멤버 중 첫 번째 사용자에게 그룹장을 물려줍니다.
                    const newCreatedBy = remainingMembers[0];
                    await update(ref(db, `/RaidSchedule/${raidScheduleId}`), { createdBy: newCreatedBy });
                } else {
                    // 남은 멤버가 없으면 그룹을 삭제합니다.
                    await remove(raidScheduleRef);
                    return; // 함수를 종료합니다.
                }
            }

            const updates = {};
            updates[`/RaidSchedule/${raidScheduleId}/members/${auth.currentUser.uid}`] = null;
            updates[`/RaidSchedule/${raidScheduleId}/membersName/${auth.currentUser.uid}`] = null;
            updates[`/RaidSchedule/${raidScheduleId}/membersDays/${auth.currentUser.uid}`] = null;

            await update(ref(db), updates);

            // 그룹에 멤버가 아무도 남지 않았다면 그룹을 삭제합니다.
            if (Object.keys(raidScheduleData.members).length === 1) {
                await remove(raidScheduleRef);
            }

        } catch (error) {
            console.error("Error removing data: ", error);
        }
    }

    const deleteButton = async (dayToDelete) => {
        const userId = auth.currentUser.uid;
        const userDaysRef = ref(db, `/RaidSchedule/${selectedId}/membersDays/${userId}`);

        try {
            // userDays 데이터를 가져옵니다.
            const snapshot = await get(userDaysRef);
            if (snapshot.exists()) {
                let userDays = snapshot.val();
                // day.name과 일치하는 요일 객체를 찾습니다.
                const dayIndex = userDays.findIndex(d => d.name === dayToDelete.name);
                if (dayIndex !== -1) {
                    // 해당 요일 객체의 times 배열을 삭제합니다.
                    const updates = {};
                    updates[`/${dayIndex}/times`] = null;
                    await update(userDaysRef, updates);

                    // 로컬 상태를 업데이트합니다.
                    setDays(prevDays => {
                        const newDays = [...prevDays];
                        newDays[dayIndex] = { ...newDays[dayIndex], times: [] };
                        return newDays;
                    });
                }
            }
        } catch (error) {
            console.error("Error removing times: ", error);
        }
    };

    const handleWeekScheduleClick = (day) => {
        console.log(day);
        setSelectedDay(day.name);
    }


    const registerThisWeekSchedule = () => {
        const userRef = ref(db, `Users/${auth.currentUser.uid}`);
        const updates = {};
        updates['/thisWeekSchedule'] = thisWeekSchedule;


        update(userRef, updates)
            .then(() => {
                console.log('This week schedule updated successfully!');
            })
            .catch((error) => {
                console.error('Error updating this week schedule:', error);
            });

    }



    return (

        <div className='flex-container'>
            <div className="flex-left">

            </div>
            <div className="flex-center">
                <div style={{ marginBottom: '10px' }}>
                    <h4 style={{ color: "#15A658", marginBottom: '5px' }}>고정 파티 스케줄러</h4>
                    <p style={{ color: "#7D8395", fontSize: 12, marginTop: '-5px' }}>스케줄러를 통해 쉽고 빠르게 파티원들의 시간을 조율해보세요.</p>
                </div>
                <div style={{ fontFamily: 'Pretendard-ExtraBold', fontSize: 20, marginBottom: 50, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontFamily: 'Pretendard-Semibold' }}>이번 주 내 스케줄</div>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 10, textAlign: 'center' }}>
                        {weeklySchedule.map(day => (
                            <div style={{ background: "#FFFFFF", padding: "10px 10px 0 10px", display: 'flex', flexDirection: 'column', minHeight: 220, height: 'auto', width: 150, fontFamily: 'Pretendard-Semibold' }} key={day.name}>
                                <div style={{ marginBottom: 10, fontSize: 16, color: "#0A0A0A" }}>{day.name}</div>
                                {day.title.slice().reverse().map((title, index) => (
                                    <div style={{ paddingTop: 5, paddingBottom: 5, fontSize: 13, marginBottom: 10, background: "#D9D9D9" }} key={`${day.name}-title-${index}`}>
                                        <div>{title}</div>
                                        <div>{day.times[day.times.length - 1 - index]}</div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* <div onClick={() => weeklyScheduleRegistrationShow()}>이번주 스케줄 등록</div> */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 25,
                    flexWrap: 'wrap',
                    marginBottom: 30
                }}>
                    {raidSchedules.map((raidSchedule) => (
                        <div key={raidSchedule.id} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            flexBasis: 'calc(20% - 12.5px)',
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'row', padding: "10px 15px 10px 15px", background: "#FFFFFF", justifyContent: 'space-between', width: 259 }}>
                                <div style={{
                                    display: 'flex',
                                    fontSize: 15,
                                    fontFamily: 'Pretendard-ExtraBold',
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    alignItems: 'center',
                                }}>
                                    {raidSchedule.title}

                                </div>

                                <div
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (openDropdownId === raidSchedule.id) {
                                            setOpenDropdownId(null);
                                        } else {
                                            setOpenDropdownId(raidSchedule.id);
                                        }
                                    }}><MdExpandMore /></div>

                            </div>
                            {openDropdownId === raidSchedule.id && (
                                <div ref={dropdownRef} style={{
                                    position: 'absolute',
                                    top: '10.2%',
                                    left: 118,
                                    zIndex: 1,
                                    background: 'white',
                                    padding: '10px 0px',
                                    width: 140,
                                    borderRadius: '0 0 7px 7px',
                                    border: '1px solid #E6E8EC',
                                    borderTop: 'none',
                                    fontSize: 15,
                                }}>
                                    <div style={{ paddingLeft: 13, marginBottom: 10, color: "black", cursor: 'pointer' }} onClick={() => isLinkVisibleModalShow(raidSchedule.id)}>초대하기 </div>
                                    {/* <div style={{ paddingLeft: 13, marginBottom: 10, color: "black", cursor: 'pointer' }}>파티원 목록</div> */}
                                    <div style={{ paddingLeft: 13, marginBottom: 10, color: "black", cursor: 'pointer' }} onClick={() => groupSettingModalShow(raidSchedule.id)}>파티 설정</div>
                                    <div style={{ border: "1px solid #E6E8EC", marginBottom: 10, marginLeft: 8, marginRight: 8 }}></div>
                                    <div style={{ paddingLeft: 13, marginBottom: 5, color: "black", cursor: 'pointer', color: '#FF5252' }} onClick={() => leaveGroupButton(raidSchedule.createdBy, raidSchedule.id)}>파티 나가기</div>
                                </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', background: '#D9D9D9', padding: "10px 15px 10px 15px", height: 400, justifyContent: 'space-between', }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gridGap: '10px',
                                    maxWidth: '100%',

                                }}>
                                    {Object.entries(raidSchedule.membersName).map(([id, name], index) => (
                                        <div
                                            key={index}
                                            style={{
                                                background: '#F4F4F4',
                                                padding: '10px',
                                                textAlign: 'center',
                                                fontSize: '14px',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis',
                                                width: '100%',
                                                maxWidth: '100%',
                                                border: Object.keys(raidSchedule.membersDays || {}).includes(id) ? '1px solid #15A658' : 'none',
                                            }}
                                        >
                                            {name}
                                        </div>
                                    ))}

                                </div>

                                <div>
                                    <div style={{
                                        background: '#F4F4F4',
                                        borderRadius: 20,
                                        marginBottom: 10,
                                        textAlign: 'center',
                                        padding: "6px 8px 6px 8px",
                                        fontSize: 16,
                                        color: "#545863",
                                        cursor: 'pointer'
                                    }} onClick={() => scheduleConfirmationShow(raidSchedule.id, raidSchedule.createdBy)}>스케줄 조율 현황</div>
                                    <div style={{ background: '#F4F4F4', borderRadius: 20, marginBottom: 5, textAlign: 'center', padding: "6px 8px 6px 8px", fontSize: 16, color: "#545863", cursor: 'pointer' }} onClick={() => scheduleRegistrationShow(raidSchedule.id)}>스케줄 조율</div>
                                </div>
                            </div>

                        </div>
                    ))}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#FFFFFF',
                        fontSize: 16,
                        color: "#545863",
                        width: '25%',
                        maxWidth: 259, // 최대 너비를 제한합니다.
                        height: 444,
                        cursor: 'pointer',
                    }}
                        onClick={() => handleModalShow()
                        }>
                        + 고정팟 만들기
                    </div>
                </div>

                <GroupSettingModal
                    show={groupSettingModal}
                    onHide={() => groupSettingModalClose()}
                    onClick={groupSettingModalClose}
                    onClick2={groupSettingComplete}
                    onChange={(e) => setGroupTitle(e.target.value)}
                    onChange2={(e) => setGroupPermissions(e.target.value)}
                    title="파티 설정"
                    subtitle="파티 이름을 변경하거나 수정권한을 부여해보세요."
                    textInputName="파티 이름 변경"
                    textInputName2="수정 권한 부여"
                    placeholder="파티 이름을 입력하세요."
                />


                <CustomModal
                    showModal={isLinkVisible}
                    handleModalClose={isLinkVisibleModalClose}
                    title="파티에 초대"
                    subtitle="링크를 복사하고 공유하여 파티원을 초대하세요"
                    content="초대 링크" link={inviteLink}
                    buttonName="복사"
                    button={copyToClipboard}
                    linkWidth={230}
                    type={true}
                />

                <ScheduleModal
                    onHide={weeklyScheduleRegistrationClose}
                    show={weeklyScheduleRegistrationModal}
                    title="이번주 스케줄 등록"
                    days={thisWeekSchedule}
                    partyLeader={false}
                    handleDayClick={handleWeekScheduleClick}
                    selectedDay={selectedDay}
                    startTime={startTime}
                    endTime={endTime}
                    handleTimeChange={handleTimeChange}
                    addTimeToDay={addTimeToDay}
                    registration={() => registerThisWeekSchedule()}
                    buttonName="스케줄 등록"
                    deleteButton={deleteButton}
                />

                <ScheduleModal
                    onHide={scheduleRegistrationClose}
                    show={scheduleRegistrationModal}
                    title="스케줄 조율"
                    days={days}
                    partyLeader={false}
                    handleDayClick={handleDayClick}
                    selectedDay={selectedDay}
                    startTime={startTime}
                    endTime={endTime}
                    handleTimeChange={handleTimeChange}
                    addTimeToDay={addTimeToDay}
                    registration={() => registration()}
                    buttonName="스케줄 등록"
                    deleteButton={deleteButton}
                />

                <ScheduleModal
                    onHide={scheduleConfirmationClose}
                    show={scheduleConfirmationModal}
                    title="스케줄 조율 현황"
                    days={confirmationDays}
                    partyLeader={true}
                    handleDayClick={handleconfirmedDayClick}
                    selectedDay={selectedDay}
                    startTime={startTime}
                    endTime={endTime}
                    handleTimeChange={handleTimeChange}
                    addTimeToDay={addTimeToDay}
                    registration={() => confirmed()}
                    buttonName="스케줄 확정"
                    createdBy={createdBy}
                    userId={userLoginId}
                />

                <Modal show={showModal} onHide={handleModalClose} className="my-modal">
                    <Modal.Body>
                        <div style={{
                            height: '180px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}>
                            <div style={{ fontFamily: "pretendard-bold", fontSize: 24, color: "#15A658" }}>파티원 추가</div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginTop: '50px',
                                fontSize: 16,
                                fontFamily: "pretendard-semibold",
                                textAlign: 'center'
                            }}>
                                <div>
                                    <div style={{ fontSize: 14, fontFamily: "pretendard-regular", marginBottom: 10, color: "#727272" }}>새로운 고정파티를 만들고싶다면</div>
                                    <button onClick={() => groupCreationModalShow()} style={{ cursor: 'pointer', background: "#15A658", color: "white", width: 240, height: 40, border: 'none', borderRadius: 50 }}>
                                        파티 생성하기
                                    </button>
                                </div>
                                <div style={{ marginLeft: 50 }}>
                                    <div style={{ fontSize: 14, fontFamily: "pretendard-regular", marginBottom: 10, color: "#727272" }} >기존에 있는 파티에 초대를 받았다면</div>
                                    <button onClick={() => groupParticipationModalShow()} style={{ cursor: 'pointer', background: "#15A658", color: "white", width: 240, height: 40, border: 'none', borderRadius: 50 }}>
                                        파티에 참여하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>


                <GroupModal
                    show={groupCreationModal} onHide={() => groupCreationModalClose()}
                    title="파티 생성" subTitle="파티를 생성하고 레이드를 함께 갈 파티원을을 초대할 수 있어요."
                    content="파티 이름"
                    placeholder="파티 이름을 입력하세요."
                    value={partyTitle} onChange={(e) => setPartyTitle(e.target.value)}
                    button={handleModalShow}
                    button2={createGroup}
                    buttonTitle="뒤로"
                    buttonTitle2="생성하기"
                />
                <GroupModal
                    show={groupParticipationModal} onHide={() => groupParticipationModalClose()}
                    title="파티 참여"
                    subTitle="초대를 받았다면 파티에 참여할 수 있어요."
                    content="초대 링크 입력"
                    placeholder="초대 링크를 이 곳에 입력해주세요."
                    value={groupJoinId} onChange={(e) => setGroupJoinId(e.target.value)}
                    button={handleModalShow}
                    button2={joinGroup}
                    buttonTitle="뒤로"
                    buttonTitle2="참여하기"
                />
            </div>
            <div className="flex-right">
            </div>
        </div>
    );
}

export default ScheduleGroupCreator;
