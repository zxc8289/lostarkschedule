import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth, db, ref, set } from "../../firebase";
import { FaPlus, FaMinus, FaCoins, FaCopy, FaRegCopy } from "react-icons/fa";
import { get, onValue, remove, update } from "firebase/database";
import { IoMdRefresh } from "react-icons/io";
import { abyssLevel, corpsCommanderLevel, kazerosLevel, raidLevels } from "../../const/raidLevels";
import "react-toggle/style.css"
import './raidSchedule.css';
import { fetchUserApiKey } from "../../utils/apiKeys";
import CustomModal from "../../componnent/modal/customModal";
import { Modal } from "react-bootstrap";


function RaidSchedule({ id, createdBy }) {
    const [charactersData, setCharactersData] = useState("");

    // 레이드 그룹 아이디
    const [raidScheduleId, setRaidScheduleId] = useState(id);

    // 현재 선택한 관문 상태
    const [selectedGates, setSelectedGates] = useState({});

    // 편집 모드 상태
    const [isEditModes, setEditModes] = useState({});


    // api key
    const [userApiKey, setUserApiKey] = useState(null);

    // 상단 고정 상태를 관리하는 로컬 상태
    const [pinnedSchedules, setPinnedSchedules] = useState(() => {
        const saved = localStorage.getItem("pinnedSchedules");
        return saved !== null ? JSON.parse(saved) : [];
    });


    // 그룹원 초대 버튼 클릭시 활성 상태
    const [isLinkVisible, setIsLinkVisible] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');
    const inviteLink = id;
    const isLinkVisibleModalClose = () => setIsLinkVisible(false);
    const isLinkVisibleModalShow = () => setIsLinkVisible(true);

    const [showModal, setShowModal] = useState(false);  // 캐릭터 편집 모달 상태

    // 캐릭터 편집
    const [selectedCharacterStatus, setSelectedCharacterStatus] = useState({});
    const [characterNickname, setCharacterNickname] = useState("");
    const handleModalClose = () => setShowModal(false);
    const handleModalShow = (nickname) => {
        setCharacterNickname(nickname);
        setShowModal(true);

        const statusOnly = charactersData[nickname].reduce((statusObj, character, index) => {
            // character 객체에 status 키가 존재하고 참이라면 true, 그렇지 않다면 false를 할당합니다.
            statusObj[index] = !!character.status;
            return statusObj;
        }, {});

        setSelectedCharacterStatus(statusOnly);
        console.log(statusOnly);
    }

    // 캐릭터 추가 버튼 클릭시 활성 상태
    const [addCharacter, setAddCharacter] = useState(false);
    const addCharacterModalClose = () => setAddCharacter(false);
    const addCharacterModalShow = () => setAddCharacter(true);
    const [addCharacterTextInput, setAddCharacterInput] = useState();
    const addCharacterPlaceolder = "불러올 계정의 대표 캐릭터명을 입력해주세요.";

    // 4관문 체크 상태
    const [isFourGateChecked, setIsFourGateChecked] = useState(() => {
        const saved = localStorage.getItem("isFourGateChecked");
        return saved === null ? false : JSON.parse(saved);
    });

    // 탭 선택 상태 ex) 군단장 레이드, 어비스 던전, 카제로스 레이드
    const [activeTabsByNickname, setActiveTabsByNickname] = useState({});

    // 골드 받는 레이드의 관문만 보여주는 상태 관리
    const [showGoldOnlyRaids, setShowGoldOnlyRaids] = useState(() => {
        const saved = localStorage.getItem("showGoldOnlyRaids");
        return saved === null ? false : JSON.parse(saved);
    });

    // 골드 받는 레이드 관문 상태 로컬스토리지 저장하기
    useEffect(() => {
        // showGoldOnlyRaids 상태가 변경될 때 로컬 스토리지에 저장
        localStorage.setItem("showGoldOnlyRaids", JSON.stringify(showGoldOnlyRaids));
    }, [showGoldOnlyRaids]);

    // 4관문 체크 상태 로컬스토리지 저장하기
    useEffect(() => {
        // showGoldOnlyRaids 상태가 변경될 때 로컬 스토리지에 저장
        localStorage.setItem("isFourGateChecked", JSON.stringify(isFourGateChecked));
    }, [isFourGateChecked]);


    useEffect(() => {
        const loadApiKey = async () => {
            const userId = auth.currentUser ? auth.currentUser.uid : null;
            if (userId) {
                const apiKey = await fetchUserApiKey(userId);
                setUserApiKey(apiKey);

            } else {
                console.log("사용자가 로그인하지 않았습니다.");
            }
        };

        loadApiKey();
    }, []);



    // 편집 완료 함수
    const handleCompleteSetup = async (nickname) => {
        const updates = {};
        Object.keys(selectedCharacterStatus).forEach((key) => {
            updates[`/${key}/status`] = selectedCharacterStatus[key];
        });

        console.log(updates);

        try {
            // Firebase에 업데이트 실행
            await update(ref(db, `/LostArkData/${raidScheduleId}/${nickname}`), updates);
            setSelectedCharacterStatus({});
            handleModalClose();
        } catch (error) {
            console.error('캐릭터 상태 업데이트 실패:', error);
        }
    };


    // 편집 캐릭터 선택
    const toggleCharacterSelection = (nickname) => {
        setSelectedCharacterStatus(prevStatus => ({
            ...prevStatus,
            [nickname]: !prevStatus[nickname]
        }));
        console.log(selectedCharacterStatus);
    };



    // 캐릭터 추가
    const addCharacterClick = async () => {
        try {
            const response = await axios.get(
                `https://developer-lostark.game.onstove.com/characters/${addCharacterTextInput}/siblings`,
                {
                    headers: {
                        accept: "application/json",
                        authorization: `bearer ${userApiKey}`,
                    },
                }
            );

            if (response.data) {
                // 각 캐릭터 객체에 status: true 추가
                const charactersWithStatus = Object.fromEntries(
                    Object.entries(response.data).map(([key, character]) => {
                        if (!isNaN(key)) { // key가 숫자인지 확인
                            return [key, { ...character, status: true }];
                        }
                        return [key, character];
                    })
                );

                await set(ref(db, `/LostArkData/${raidScheduleId}/${addCharacterTextInput}`), {
                    ...charactersWithStatus,
                    // timestamp: Date.now(),
                });

                setAddCharacterInput('');
                addCharacterModalClose();

            } else {
                throw new Error("Invalid nickname.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("없는 닉네임입니다.");
        }
    };



    const handleDeleteNickname = async (nicknameToDelete) => {
        handleModalClose();
        // 편집 모드 상태 초기화
        setEditModes((prevModes) => ({
            ...prevModes,
            [nicknameToDelete]: false,
        }));
        try {
            // 해당 닉네임 참조를 통해 데이터를 null로 설정하여 삭제
            await set(ref(db, `/LostArkData/${raidScheduleId}/${nicknameToDelete}`), null);
            await set(ref(db, `/RaidCompletion/${raidScheduleId}/${nicknameToDelete}`), null);

            // console.log("Document successfully deleted!");
        } catch (error) {
            console.error("Error removing data: ", error);
        }
    };

    const handleRefreshNickname = async (nicknameToRefresh) => {
        // 타임스탬프 값을 유지
        // const timestamp = charactersData[nicknameToRefresh].timestamp;

        try {
            const response = await axios.get(
                `https://developer-lostark.game.onstove.com/characters/${nicknameToRefresh}/siblings`,
                {
                    headers: {
                        accept: "application/json",
                        authorization: `bearer ${userApiKey}`,
                    },
                }
            );

            // API 호출이 성공했을 경우에만 데이터 처리
            if (response.data) {
                // Firebase에서 현재 캐릭터 데이터를 가져옴
                const currentDataRef = ref(db, `/LostArkData/${raidScheduleId}/${nicknameToRefresh}`);
                const currentDataSnapshot = await get(currentDataRef);
                if (currentDataSnapshot.exists()) {
                    const currentData = currentDataSnapshot.val();
                    // 새 데이터에 현재 데이터의 status 값을 병합
                    const updatedData = {
                        ...response.data,
                        // timestamp: timestamp,
                    };
                    // 현재 데이터의 각 캐릭터에 대해 status 값이 있으면 그 값을 유지
                    Object.keys(response.data).forEach(key => {
                        if (currentData.hasOwnProperty(key) && currentData[key].hasOwnProperty('status')) {
                            updatedData[key].status = currentData[key].status;
                        }
                    });

                    // 업데이트된 데이터로 Firebase 업데이트
                    await update(currentDataRef, updatedData);
                }

            } else {
                throw new Error("Invalid nickname."); // 예외를 생성하고 발생시킵니다.
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    // 캐릭터 데이터 불러오기
    useEffect(() => {
        setRaidScheduleId(id);
        const characterDataRef = ref(db, `LostArkData/${raidScheduleId}`);
        const unsubscribe = onValue(characterDataRef, (snapshot) => {
            const rawData = snapshot.val();
            setCharactersData(rawData || {});
            // setSelectedCharacterStatus(rawData);
        });


        return () => unsubscribe();
    }, [id, raidScheduleId]);




    // 파이어베이스 레이드 관문 호출
    useEffect(() => {
        const raidCompletionRef = ref(db, `/RaidCompletion/${raidScheduleId}`);
        const unsubscribe = onValue(raidCompletionRef, (snapshot) => {
            const raidCompletionData = snapshot.val();

            if (raidCompletionData) {
                setSelectedGates(prev => {
                    let newSelectedGates = { ...prev };

                    for (let nickname in raidCompletionData) {
                        const charactersData = raidCompletionData[nickname];
                        for (let characterName in charactersData) {
                            const raidsData = charactersData[characterName];
                            for (let raidName in raidsData) {
                                const gateNumber = raidsData[raidName];
                                if (typeof gateNumber === 'number') {
                                    if (!newSelectedGates[nickname]) {
                                        newSelectedGates[nickname] = {};
                                    }
                                    if (!newSelectedGates[nickname][characterName]) {
                                        newSelectedGates[nickname][characterName] = {};
                                    }
                                    newSelectedGates[nickname][characterName][raidName] = gateNumber;
                                }
                            }
                        }
                    }

                    return newSelectedGates;
                });
            } else {
                setSelectedGates({});
            }
        });

        return () => unsubscribe();
    }, [raidScheduleId]);

    // activeTabsByNickname 초기값설정
    useEffect(() => {
        if (charactersData) {
            // charactersData에서 모든 닉네임을 추출하여 각각에 대해 'corpsCommander'를 초기값으로 설정
            const initialTabs = {};
            Object.keys(charactersData).forEach(nickname => {
                initialTabs[nickname] = 'corpsCommander';
            });
            setActiveTabsByNickname(initialTabs);
        }
    }, [charactersData]);


    // 편집 모드 토글 함수 수정
    const toggleEditMode = (nickname) => {
        setEditModes(prevModes => ({
            ...prevModes,
            [nickname]: !prevModes[nickname],
        }));
    };

    const handleDelete = async (characterNameToDelete, nickname) => {
        // 캐릭터 정보만 배열로 가져옴
        const characters = Object.values(charactersData[nickname]).filter(
            (character) => typeof character === "object" && character.CharacterName
        );

        // 해당 캐릭터 삭제
        const updatedCharacters = characters.filter(
            (character) => character.CharacterName !== characterNameToDelete
        );

        // 배열을 다시 객체 형태로 변환
        const updatedCharacterObject = updatedCharacters.reduce(
            (acc, character, index) => {
                acc[index] = character;
                return acc;
            },
            {}
        );

        // 타임스탬프 값을 유지
        // const timestamp = charactersData[nickname].timestamp;

        try {
            // Firebase에 업데이트된 데이터와 타임스탬프 저장
            await set(ref(db, `/LostArkData/${raidScheduleId}/${nickname}`), {
                ...updatedCharacterObject,
                // timestamp: timestamp,
            });
            // 상태 업데이트
            setCharactersData({
                ...charactersData,
                [nickname]: {
                    ...updatedCharacterObject,
                    // timestamp: timestamp,
                },
            });
        } catch (error) {
            console.error("Error deleting character:", error);
        }
    };

    // 해당 함수는 캐릭터의 아이템 레벨과 닉네임을 입력으로 받아, 상위 3개의 레이드를 반환합니다.
    const getTopThreeRaids = (itemLevel) => {
        let eligibleRaids = [];

        // 각 레이드와 난이도별로 아이템 레벨이 충분한지 확인
        Object.entries({ ...corpsCommanderLevel, ...abyssLevel, ...kazerosLevel }).forEach(([raidName, raidInfo]) => {
            Object.entries(raidInfo.difficulty).forEach(([difficulty, details]) => {
                // 4관문 체크 상태에 따라 아브렐슈드의 골드 값을 조정
                let gold = details.gold;
                if (isFourGateChecked && raidName === "아브렐슈드") {
                    gold = difficulty === "하드" ? 9000 : 7000;
                }

                if (details.level <= itemLevel) {
                    eligibleRaids.push({
                        raidName: `${raidName} (${difficulty})`,
                        level: details.level,
                        gold: gold,
                        difficulty: difficulty
                    });
                }
            });
        });

        // 골드 양으로 내림차순 정렬
        eligibleRaids.sort((a, b) => b.gold - a.gold);

        // 상위 3개의 레이드를 선택, 같은 레이드의 노말과 하드 중 하나만 포함
        const topRaids = [];
        const addedRaids = new Set();
        for (let raid of eligibleRaids) {
            const raidBaseName = raid.raidName.split(' ')[0];
            if (!addedRaids.has(raidBaseName)) {
                topRaids.push(raid);
                addedRaids.add(raidBaseName);
                if (topRaids.length === 3) break;
            }
        }

        return topRaids.map(raid => raid.raidName);
    };




    const allRaids = (itemLevel) => {
        let eligibleRaids = [];
        // 각 레이드와 난이도별로 아이템 레벨이 충분한지 확인하고, 골드 양으로 내림차순 정렬
        Object.entries({ ...corpsCommanderLevel, ...abyssLevel, ...kazerosLevel }).forEach(([raidName, raidInfo]) => {
            let highestDifficulty = null;

            Object.entries(raidInfo.difficulty).forEach(([difficulty, details]) => {
                // 4관문 체크 상태에 따라 아브렐슈드의 골드 값을 조정
                let gold = details.gold;
                if (isFourGateChecked && raidName === "아브렐슈드") {
                    gold = difficulty === "하드" ? 9000 : 7000;
                }

                if (details.level <= itemLevel) {
                    if (!highestDifficulty || gold > highestDifficulty.gold) {
                        highestDifficulty = { difficulty, level: details.level, gold };
                    }
                }
            });

            if (highestDifficulty) {
                eligibleRaids.push({
                    raidName: `${raidName} (${highestDifficulty.difficulty})`,
                    gold: highestDifficulty.gold
                });
            }
        });

        // 골드 양으로 내림차순 정렬 후 상위 3개 레이드 이름만 추출
        eligibleRaids.sort((a, b) => b.gold - a.gold);
        const topThreeRaids = eligibleRaids.slice(0, 3).map(raid => raid.raidName);

        // 모든 레이드 반환, 상위 3개 레이드는 난이도 이름 포함
        return Object.keys({ ...corpsCommanderLevel, ...abyssLevel, ...kazerosLevel }).map(raidName => {
            const isTopThree = topThreeRaids.some(topRaid => topRaid.includes(raidName));
            if (isTopThree) {
                return topThreeRaids.filter(raid => raid.includes(raidName));
            } else {
                return [raidName];
            }
        }).flat();
    };


    // 관문 수 선택 상태 업데이트 함수
    const updateSelectedGates = async (nickname, characterName, raidName, gateNumber) => {
        // 관문이 선택되지 않았으면 '0'으로 설정
        const updatedRaidData = gateNumber === undefined ? 0 : gateNumber;

        await update(ref(db, `/RaidCompletion/${raidScheduleId}/${nickname}/${characterName}`), {
            [raidName]: updatedRaidData
        });
    };

    // 관문 선택 핸들러 함수
    const selectGate = async (nickname, characterName, raidName, gateNumber) => {
        // 현재 선택된 사용자의 닉네임과 캐릭터 데이터를 로컬 상태에서 가져옴
        const prevNicknameData = selectedGates[nickname] || {};
        const prevCharacterData = prevNicknameData[characterName] || {};
        // 현재 선택된 관문 번호를 가져옴
        const currentSelectedGate = prevCharacterData[raidName];

        // 만약 현재 선택된 관문이 다시 클릭된 관문과 같다면 'undefined'로 설정하여 선택을 취소함.
        // 다른 관문이 선택되었다면, 그 관문 번호로 업데이트함
        const newGateNumber = currentSelectedGate === gateNumber ? undefined : gateNumber;

        // Firebase 데이터베이스를 업데이트하는 함수를 호출함. 이 함수는 선택된 관문의 상태를 Firebase에 반영함
        await updateSelectedGates(nickname, characterName, raidName, newGateNumber);

        // 로컬 상태를 업데이트함.
        // 만약 새로운 관문 번호가 'undefined' (즉, 선택 취소)라면 0으로 설정하여 로컬 상태에 반영함
        // 그렇지 않으면 새로운 관문 번호로 업데이트함
        setSelectedGates(prev => ({
            ...prev,
            [nickname]: {
                ...prevNicknameData,
                [characterName]: {
                    ...prevCharacterData,
                    [raidName]: newGateNumber !== undefined ? newGateNumber : 0
                }
            }
        }));
    };

    // 관문 버튼 컴포넌트 수정
    const GateButton = ({ nickname, characterName, raidName, gateNumber, isSelected }) => {
        let buttonClass = 'gateButton default'; // 기본 스타일 (검은색 테두리)

        if (raidName.includes("하드")) {
            buttonClass = 'gateButton hard';
        } else if (raidName.includes("노말")) {
            buttonClass = 'gateButton normal';
        }

        // 선택된 경우 추가 스타일 클래스 적용
        if (isSelected) {
            buttonClass += ' selected';
        }

        return (
            <button
                className={buttonClass}
                onClick={() => selectGate(nickname, characterName, raidName, gateNumber)}
            >
                {gateNumber}
            </button>
        );
    };

    // 레이드 탭 변경
    const handleTabChange = (nickname, tab) => {
        setActiveTabsByNickname((prevTabs) => ({
            ...prevTabs,
            [nickname]: tab,
        }));
    };


    // 골드받는 레이드 활성화
    const toggleShowGoldOnlyRaids = () => {
        setShowGoldOnlyRaids(prev => !prev);
    };

    // 4관문 활성화
    const toggleFourGateChecked = () => {
        setIsFourGateChecked(prev => !prev);
    };

    // 상단 고정 상태를 로컬 스토리지에 저장하는 함수
    const savePinnedSchedules = (items) => {
        localStorage.setItem("pinnedSchedules", JSON.stringify(items));
    };

    // 상단 고정 토글 함수
    const togglePinSchedule = (nickname) => {
        console.log(nickname);
        setPinnedSchedules(prev => {
            const isPinned = prev.includes(nickname);
            const newPinned = isPinned ? prev.filter(n => n !== nickname) : [...prev, nickname];
            savePinnedSchedules(newPinned);
            return newPinned;
        });
    };

    // 레이드 초기화 함수
    const resetButton = async (nickname) => {
        try {
            // 해당 닉네임 참조를 통해 데이터를 null로 설정하여 삭제
            await set(ref(db, `/RaidCompletion/${raidScheduleId}/${nickname}`), null);


            setSelectedGates(prevSelectedGates => {
                const updatedSelectedGates = { ...prevSelectedGates };

                delete updatedSelectedGates[nickname];
                return updatedSelectedGates;
            });
        } catch (error) {
            console.error("Error removing data: ", error);
        }
    }



    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            setCopySuccess('Copied!');
        } catch (err) {
            setCopySuccess('Failed to copy!');
        }
    };


    const addCharacterInputChange = (e) => {
        setAddCharacterInput(e.target.value);
    }

    // 엔터 키를 누를 때 실행될 함수
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            addCharacterClick();
        }
    };


    const leaveGroupButton = async (createdBy) => {

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

            // 현재 사용자가 멤버 목록에서 제거됩니다.
            await set(ref(db, `/RaidSchedule/${raidScheduleId}/members/${auth.currentUser.uid}`), null);

            // 그룹에 멤버가 아무도 남지 않았다면 그룹을 삭제합니다.
            if (Object.keys(raidScheduleData.members).length === 1) {
                await remove(raidScheduleRef);
            }

        } catch (error) {
            console.error("Error removing data: ", error);
        }
    }

    return (
        <div>
            <div style={{ display: "flex", gap: '15px', marginTop: 25, marginBottom: 25, }}>
                <div style={{
                    display: "flex",
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 20,
                }}>보기</div>
                <div style={{
                    display: "flex",
                    cursor: "pointer",
                }}>
                    <div
                        className="viewsettingbutton"
                        onClick={() => toggleFourGateChecked()}
                        style={{
                            backgroundColor: isFourGateChecked ? '#15A658' : '',
                            color: isFourGateChecked ? 'white' : '',
                        }}>4관문</div>
                    <div
                        className="viewsettingbutton"
                        onClick={() => toggleShowGoldOnlyRaids()}
                        style={{
                            backgroundColor: showGoldOnlyRaids ? '#15A658' : '',
                            color: showGoldOnlyRaids ? 'white' : '',
                        }}
                    >
                        골드 받는 레이드의 관문만
                    </div>
                </div>
            </div>
            {charactersData &&
                Object.entries(charactersData)
                    .map(([nickname, data]) => {
                        const characters = Object.values(data).filter(
                            (character) =>
                                typeof character === "object" && character.CharacterName
                        );
                        return [
                            nickname,
                            characters.sort(
                                (a, b) =>
                                    parseFloat(b.ItemAvgLevel.replace(",", "")) -
                                    parseFloat(a.ItemAvgLevel.replace(",", ""))
                            ),
                            // data.timestamp,
                        ];
                    })
                    .sort((a, b) => {
                        const aIsPinned = pinnedSchedules.includes(a[0]);
                        const bIsPinned = pinnedSchedules.includes(b[0]);

                        if (aIsPinned && !bIsPinned) {
                            return -1;
                        }
                        if (!aIsPinned && bIsPinned) {
                            return 1;
                        }
                        return a[2] - b[2];
                    })
                    .map(([nickname, characters], index) => {
                        return (
                            <div>
                                <div className="raidschedule-head" >
                                    <div style={{ display: "flex" }}>
                                        <h5 style={{
                                            marginRight: '30px',
                                        }}>
                                            {nickname}
                                        </h5>
                                        <button className="raidtab"
                                            style={{
                                                fontSize: activeTabsByNickname[nickname] === 'corpsCommander' ? '16px' : '12px',
                                                marginTop: activeTabsByNickname[nickname] === 'corpsCommander' ? '1px' : '5px',
                                                color: activeTabsByNickname[nickname] === 'corpsCommander' ? '#15A658' : '#7D8395',
                                            }} onClick={() => handleTabChange(nickname, 'corpsCommander')}>
                                            군단장 레이드
                                        </button>
                                        <button className="raidtab"
                                            style={{
                                                fontSize: activeTabsByNickname[nickname] === 'abyss' ? '16px' : '12px',
                                                marginTop: activeTabsByNickname[nickname] === 'abyss' ? '1px' : '5px',
                                                color: activeTabsByNickname[nickname] === 'abyss' ? '#15A658' : '#7D8395',
                                            }} onClick={() => handleTabChange(nickname, 'abyss')}>
                                            어비스 던전
                                        </button>
                                        <button
                                            className="raidtab"
                                            style={{
                                                fontSize: activeTabsByNickname[nickname] === 'kazeros' ? '16px' : '12px',
                                                marginTop: activeTabsByNickname[nickname] === 'kazeros' ? '1px' : '5px',
                                                color: activeTabsByNickname[nickname] === 'kazeros' ? '#15A658' : '#7D8395',
                                            }}
                                            onClick={() => handleTabChange(nickname, 'kazeros')}
                                        >
                                            카제로스 레이드
                                        </button>
                                    </div>
                                </div>
                                <div key={index} className="raidschedule-body" >
                                    <div style={{ textAlign: 'left' }}>
                                        <table className="table" style={{ backgroundColor: 'white', width: "auto" }}>
                                            <thead>
                                                <tr>
                                                    {isEditModes[nickname] && <th></th>}
                                                    <th></th>

                                                    {Object.keys(
                                                        activeTabsByNickname[nickname] === 'corpsCommander' ? corpsCommanderLevel :
                                                            activeTabsByNickname[nickname] === 'abyss' ? abyssLevel :
                                                                kazerosLevel
                                                    ).map((raid, idx) => (
                                                        <th key={idx} style={{ width: "150px" }}>
                                                            {raid}
                                                        </th>
                                                    ))}
                                                    {Array.from({
                                                        length: 6 - Object.keys(
                                                            activeTabsByNickname[nickname] === 'corpsCommander' ? corpsCommanderLevel :
                                                                activeTabsByNickname[nickname] === 'abyss' ? abyssLevel :
                                                                    kazerosLevel
                                                        ).length
                                                    }, (_, innerIdx) => (
                                                        <th key={`empty-header-${nickname}-${innerIdx}`}></th>
                                                    ))}
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {characters.map((character, charIndex) => {
                                                    // 현재 활성화된 레이드 탭 가져오기
                                                    const activeTabForNickname = activeTabsByNickname[nickname] || 'corpsCommander';


                                                    // 해당 탭에 따른 레이드 정보 가져오기
                                                    let raidsInfo;
                                                    if (activeTabForNickname === 'corpsCommander') {
                                                        raidsInfo = corpsCommanderLevel;
                                                    } else if (activeTabForNickname === 'abyss') {
                                                        raidsInfo = abyssLevel;
                                                    } else if (activeTabForNickname === 'kazeros') {
                                                        raidsInfo = kazerosLevel;
                                                    }
                                                    // showGoldOnlyRaids 상태에 따라 필터링할 레이드 목록
                                                    const filteredRaids = showGoldOnlyRaids
                                                        ? getTopThreeRaids(parseFloat(character.ItemAvgLevel.replace(",", "")), activeTabForNickname)
                                                        : allRaids(parseFloat(character.ItemAvgLevel.replace(",", "")), activeTabForNickname);


                                                    return (
                                                        character.status ? (
                                                            <tr key={charIndex}>
                                                                {isEditModes[nickname] && <td><button className="minusButton" onClick={() => handleDelete(character.CharacterName, nickname)}><FaMinus /></button></td>}

                                                                <td style={{ width: "160px", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                                    {character.CharacterName}
                                                                    <div className="character-info">
                                                                        {character.CharacterClassName}/{character.ItemAvgLevel}
                                                                    </div>
                                                                </td>

                                                                {Object.entries(raidsInfo).map(([raidName, raidInfo]) => {
                                                                    const fullRaidName = filteredRaids.find(r => r.includes(raidName));
                                                                    const isTopRaid = fullRaidName !== undefined;

                                                                    return (
                                                                        <td key={raidName}>
                                                                            {isTopRaid && (
                                                                                <div className="gateButtonsContainer">
                                                                                    {Array.from({ length: raidInfo.gates }, (_, index) => {
                                                                                        const gateNumber = index + 1;
                                                                                        const isSelected = selectedGates[nickname]?.[character.CharacterName]?.[fullRaidName] >= gateNumber;
                                                                                        return <GateButton key={gateNumber} nickname={nickname} characterName={character.CharacterName} raidName={fullRaidName} gateNumber={gateNumber} isSelected={isSelected} />;
                                                                                    })}
                                                                                </div>
                                                                            )}
                                                                        </td>
                                                                    );
                                                                })}
                                                                {Array.from({
                                                                    length: 6 - Object.keys(
                                                                        activeTabsByNickname[nickname] === 'corpsCommander' ? corpsCommanderLevel :
                                                                            activeTabsByNickname[nickname] === 'abyss' ? abyssLevel :
                                                                                kazerosLevel
                                                                    ).length
                                                                }, (_, innerIdx) => (
                                                                    <th key={`empty-header-${nickname}-${innerIdx}`}></th>
                                                                ))}
                                                            </tr>
                                                        ) : null
                                                    );

                                                })}
                                            </tbody>
                                        </table>
                                        <div className="raideditor" >
                                            <div onClick={() => togglePinSchedule(nickname)} style={{ cursor: 'pointer' }}> {pinnedSchedules.includes(nickname) ? "상단고정 해제" : "상단고정"}</div>
                                            {/* <button className="custom-button2" onClick={() => togglePinSchedule(nickname)}>
                                                {pinnedSchedules.includes(nickname) ? "상단 고정 해제" : "상단 고정"}
                                            </button> */}
                                            <div style={{ display: 'flex' }}>
                                                <p><IoMdRefresh /></p>
                                                <p onClick={() => resetButton(nickname)} style={{ marginRight: 20, marginLeft: 5, cursor: 'pointer' }}>관문 초기화</p>
                                                <p onClick={() => handleModalShow(nickname)} style={{ cursor: 'pointer' }}>편집</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        );
                    })}

            <div className="centerButtonContainer">
                <div className="leavegroup-button" onClick={() => leaveGroupButton(createdBy)}>
                    그룹 나가기
                </div>
                {/* <button className="raidschedule-addbutton" onClick={handleIconClick}>
                    <FaPlus />
                </button> */}
                <div className="button-group">
                    <div onClick={() => addCharacterModalShow()}>캐릭터 추가</div>
                    <div onClick={() => isLinkVisibleModalShow()}>그룹원 초대</div>
                </div>
            </div>
            <Modal show={showModal} onHide={handleModalClose} className="my-modal4">
                <Modal.Body>
                    <div style={{
                        height: 585,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: 15,
                    }}>
                        <div style={{ fontFamily: "pretendard-bold", fontSize: 30, color: "#15A658", marginBottom: 10 }}>캐릭터 숨김 및 표시 설정</div>
                        <div style={{ fontFamily: "pretendard-regular", fontSize: 13, color: "#7D8395" }}>표시할 캐릭터와 숨길 캐릭터를 선택할 수 있습니다.<br />초기 설정값은 모든 캐릭터를 표시합니다.</div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            width: '100%',
                        }}>
                            <div onClick={() => handleRefreshNickname(characterNickname)} style={{
                                border: "none",
                                height: 35,
                                width: 160,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 50,
                                borderRadius: 50,
                                fontSize: 16,
                                cursor: "pointer",
                                background: "#7D8395",
                                fontFamily: "pretendard-regular",
                                color: "white",
                            }}>계정 정보 업데이트</div>
                        </div>
                        <div style={{
                            marginTop: 10,
                            color: "#7D8395",
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontFamily: "pretendard-semibold",
                            background: "#E3E8E5",
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '10px',
                            padding: '8px 10px 8px 10px',
                            overflowY: 'auto',
                            borderRadius: '10px',
                        }}>
                            {charactersData[characterNickname] && Object.entries(charactersData[characterNickname])
                                .map(([nickname, characterData]) => ({
                                    nickname,
                                    characterData,
                                    itemAvgLevel: parseFloat(characterData.ItemAvgLevel?.replace(',', '') || '0')
                                }))
                                .sort((a, b) => b.itemAvgLevel - a.itemAvgLevel)
                                .map(({ nickname, characterData }) => {
                                    const isSelected = selectedCharacterStatus[nickname];
                                    return (
                                        <div
                                            key={nickname}
                                            onClick={() => toggleCharacterSelection(nickname)}
                                            style={{
                                                padding: '10px',
                                                borderRadius: '10px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                background: isSelected ? '#15A658' : '#F3F3F3',
                                                color: isSelected ? 'white' : '#606574',
                                                width: 200,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <div style={{ fontSize: 16 }}>{characterData.CharacterName}</div>
                                            <div style={{ fontSize: 12, fontFamily: 'pretendard-regular' }}>{characterData.CharacterClassName} / {characterData.ItemAvgLevel}</div>

                                        </div>
                                    );
                                })}
                        </div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                            marginTop: 100,
                        }}>
                            <div style={{ display: "flex", gap: "15px" }}>
                                <div onClick={() => handleModalClose()} style={{
                                    border: "none",
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 50,
                                    fontSize: 16,
                                    width: 100,
                                    cursor: "pointer",
                                    background: "#E1E1E1",
                                    fontFamily: "pretendard-regular",
                                    color: "#727272",

                                }}>취소</div>
                                <div onClick={() => handleDeleteNickname(characterNickname)} style={{
                                    border: "none",
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 50,
                                    fontSize: 16,
                                    width: 120,
                                    cursor: "pointer",
                                    background: "#FF5252",
                                    fontFamily: "pretendard-regular",
                                    color: "white",

                                }}>계정 삭제</div>
                            </div>
                            <div onClick={() => handleCompleteSetup(characterNickname)} style={{

                                border: "1px solid #15A658",
                                height: 42,
                                width: 140,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',

                                borderRadius: 50,
                                fontSize: 16,
                                cursor: "pointer",
                                background: "#15A658",
                                fontFamily: "pretendard-regular",
                                color: "white",

                            }}   >설정 완료</div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <CustomModal showModal={isLinkVisible} handleModalClose={isLinkVisibleModalClose} title="그룹에 초대" subtitle="링크를 복사하고 공유하여 그룹원을 초대하세요" content="초대 링크" link={id} buttonName="복사" button={copyToClipboard} linkWidth={230} type={true} />
            <CustomModal showModal={addCharacter} handleModalClose={addCharacterModalClose} title="계정 추가" subtitle="레이드 현황을 확인하고 관리할 캐릭터와 계정을 불러올게요." content="" placeholder={addCharacterPlaceolder} link={addCharacterTextInput} buttonName="추가" button={addCharacterClick} linkFontSize={14} linkWidth={290} handleInputChange={addCharacterInputChange} type={false} handleKeyDown={handleKeyDown} />

        </div >
    );
}

export default RaidSchedule;
