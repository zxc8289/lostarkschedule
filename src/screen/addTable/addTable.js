import React, { useEffect, useState } from "react";
import axios from "axios";
import { db, ref, set } from "../../firebase";
import { FaPlus, FaMinus, FaCoins } from "react-icons/fa";

import { get, onValue, remove, update } from "firebase/database";
import { raidLevels } from "../../const/raidLevels";
import Toggle from 'react-toggle'
import "react-toggle/style.css"

function AddTable() {
  // const [characterName, setCharacterName] = useState("");
  // const [charactersData, setCharactersData] = useState("");

  // const [completedRaids, setCompletedRaids] = useState({});

  // // 편집 모드 상태
  // const [isEditModes, setEditModes] = useState({});

  // // 4관문 체크 상태
  // const [isFourGateChecked, setIsFourGateChecked] = useState({});


  // const handleIconClick = async () => {
  //   const enteredNickname = prompt("캐릭터명을 입력하세요.") || "";
  //   setCharacterName(enteredNickname);

  //   try {
  //     const response = await axios.get(
  //       `https://developer-lostark.game.onstove.com/characters/${enteredNickname}/siblings`,
  //       {
  //         headers: {
  //           accept: "application/json",
  //           authorization: token,
  //         },
  //       }
  //     );

  //     // API 호출이 성공했을 경우에만 Firebase에 데이터 저장
  //     if (response.data) {
  //       await set(ref(db, `/LostArkData/${enteredNickname}`), {
  //         ...response.data,
  //         timestamp: Date.now(),
  //       });
  //     } else {
  //       throw new Error("Invalid nickname."); // 예외를 생성하고 발생시킵니다.
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     alert("없는 닉네임입니다."); // 여기에서 알림 메시지를 보여줍니다.
  //   }
  // };

  // const handleDeleteNickname = async (nicknameToDelete) => {
  //   // 편집 모드 상태 초기화
  //   setEditModes((prevModes) => ({
  //     ...prevModes,
  //     [nicknameToDelete]: false,
  //   }));
  //   try {
  //     // 해당 닉네임 참조를 통해 데이터를 null로 설정하여 삭제
  //     await set(ref(db, `/LostArkData/${nicknameToDelete}`), null);
  //     await set(ref(db, `/RaidCompletion/${nicknameToDelete}`), null);
  //     console.log("Document successfully deleted!");
  //   } catch (error) {
  //     console.error("Error removing data: ", error);
  //   }
  // };

  // const handleRefreshNickname = async (nicknameToRefresh) => {
  //   setEditModes((prevModes) => ({
  //     ...prevModes,
  //     [nicknameToRefresh]: false,
  //   }));

  //   // 타임스탬프 값을 유지
  //   const timestamp = charactersData[nicknameToRefresh].timestamp;

  //   try {
  //     const response = await axios.get(
  //       `https://developer-lostark.game.onstove.com/characters/${nicknameToRefresh}/siblings`,
  //       {
  //         headers: {
  //           accept: "application/json",
  //           authorization: token,
  //         },
  //       }
  //     );

  //     // API 호출이 성공했을 경우에만 Firebase에 데이터 업데이트
  //     if (response.data) {
  //       await set(ref(db, `/LostArkData/${nicknameToRefresh}`), {
  //         ...response.data,
  //         timestamp: timestamp,
  //       });
  //     } else {
  //       throw new Error("Invalid nickname."); // 예외를 생성하고 발생시킵니다.
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // // 캐릭터 편집 행 삭제
  // const toggleRaidCompletion = (characterName, raidKey, nickname) => {
  //   setCompletedRaids((prev) => {
  //     const charRaidStatus = prev[characterName] || {};
  //     const newStatus = charRaidStatus[raidKey] === "완료" ? "" : "완료";

  //     // Firebase에 상태 업데이트
  //     const updatedStatus = {
  //       ...prev,
  //       [characterName]: {
  //         ...charRaidStatus,
  //         [raidKey]: newStatus,
  //       },
  //     };
  //     set(
  //       ref(db, `/RaidCompletion/${nickname}/${characterName}`),
  //       updatedStatus[characterName]
  //     );
  //     return updatedStatus;
  //   });
  // };

  // // useEffect 훅을 사용하여 컴포넌트가 마운트되었을 때 수행될 로직 정의
  // useEffect(() => {
  //   // Firebase 데이터베이스의 "LostArkData" 레퍼런스를 참조
  //   const characterDataRef = ref(db, "LostArkData");
  //   // onValue 메서드는 지정된 레퍼런스의 값이 변경될 때마다 callback 함수를 호출
  //   // 이를 통해 실시간으로 데이터베이스의 변경사항을 반영할 수 있다.
  //   onValue(characterDataRef, (snapshot) => {
  //     // snapshot.val() 메서드를 사용하여 데이터베이스의 현재 값을 가져옴
  //     const rawData = snapshot.val();
  //     // rawData가 존재하면 rawData를, 존재하지 않으면 빈 객체를 charactersData 상태에 설정
  //     setCharactersData(rawData || {});
  //   });
  //   // useEffect의 dependency 배열이 빈 배열이므로
  //   // 이 로직은 컴포넌트가 처음 마운트될 때 단 한 번만 실행된다.
  // }, []);

  // useEffect(() => {
  //   const raidCompletionRef = ref(db, "/RaidCompletion");
  //   onValue(raidCompletionRef, (snapshot) => {
  //     const raidCompletionData = snapshot.val();

  //     if (raidCompletionData) {
  //       let allData = {};
  //       for (let nickname in raidCompletionData) {
  //         const charactersData = raidCompletionData[nickname];
  //         for (let characterName in charactersData) {
  //           allData[characterName] = charactersData[characterName];
  //         }
  //       }
  //       setCompletedRaids(allData);
  //     } else {
  //       setCompletedRaids({});
  //     }
  //   });
  // }, []);

  // // 편집 모드 토글 함수 수정
  // const toggleEditMode = (nickname) => {
  //   setEditModes((prevModes) => ({
  //     ...prevModes,
  //     [nickname]: !prevModes[nickname],
  //   }));
  // };

  // const toggleEditFourGateCheckedMode = async (nickname) => {
  //   // 파이어베이스에서 현재의 isChecked 값을 불러옵니다.
  //   const currentRef = ref(db, `/RaidCompletion/${nickname}`);
  //   const snapshot = await get(currentRef);
  //   let currentIsChecked = false;

  //   if (snapshot.exists() && snapshot.val().isChecked !== undefined) {
  //     currentIsChecked = snapshot.val().isChecked;
  //   }

  //   // 현재 값의 반대로 업데이트 합니다.
  //   await update(currentRef, { isChecked: !currentIsChecked });


  // };


  // const handleDelete = async (characterNameToDelete, nickname) => {
  //   // 캐릭터 정보만 배열로 가져옴
  //   const characters = Object.values(charactersData[nickname]).filter(
  //     (character) => typeof character === "object" && character.CharacterName
  //   );

  //   // 해당 캐릭터 삭제
  //   const updatedCharacters = characters.filter(
  //     (character) => character.CharacterName !== characterNameToDelete
  //   );

  //   // 배열을 다시 객체 형태로 변환
  //   const updatedCharacterObject = updatedCharacters.reduce(
  //     (acc, character, index) => {
  //       acc[index] = character;
  //       return acc;
  //     },
  //     {}
  //   );

  //   // 타임스탬프 값을 유지
  //   const timestamp = charactersData[nickname].timestamp;

  //   try {
  //     // Firebase에 업데이트된 데이터와 타임스탬프 저장
  //     await set(ref(db, `/LostArkData/${nickname}`), {
  //       ...updatedCharacterObject,
  //       timestamp: timestamp,
  //     });
  //     // 상태 업데이트
  //     setCharactersData({
  //       ...charactersData,
  //       [nickname]: {
  //         ...updatedCharacterObject,
  //         timestamp: timestamp,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error deleting character:", error);
  //   }
  // };

  // const getTopThreeRaids = (itemLevel, nickname) => {
  //   // isChecked 값에 따라 아브(노말)과 아브(하드)의 골드 값을 변경합니다.
  //   if (isFourGateChecked[nickname]) {
  //     raidLevels["아브(노말)"].gold = 7000;
  //     raidLevels["아브(하드)"].gold = 9000;
  //   } else {
  //     raidLevels["아브(노말)"].gold = 4500;
  //     raidLevels["아브(하드)"].gold = 6000;
  //   }

  //   const eligibleRaids = Object.entries(raidLevels).filter(
  //     ([raid, data]) => data.level <= itemLevel
  //   );

  //   const dedupedRaids = [];

  //   eligibleRaids.forEach(([raid, data]) => {
  //     const normalHardMatch = raid.match(/(.+)\((노말|하드)\)/);
  //     if (normalHardMatch) {
  //       const baseRaidName = normalHardMatch[1].trim();
  //       const type = normalHardMatch[2];
  //       const counterpartType = type === "노말" ? "하드" : "노말";
  //       const counterpartRaid = `${baseRaidName}(${counterpartType})`;
  //       if (
  //         type === "노말" &&
  //         eligibleRaids.some(([r, d]) => r === counterpartRaid)
  //       ) {
  //         return;
  //       }
  //     }
  //     dedupedRaids.push([raid, data]);
  //   });

  //   return dedupedRaids
  //     .sort((a, b) => b[1].gold - a[1].gold)
  //     .slice(0, 3)
  //     .map(([raid]) => raid);
  // };




  // function isScheduledTime() {
  //   const currentDate = new Date();
  //   const dayOfWeek = currentDate.getDay();  // 0 (일요일) ~ 6 (토요일)
  //   const hour = currentDate.getHours();     // 0 ~ 23
  //   const minute = currentDate.getMinutes();  // 0 ~ 59

  //   if (dayOfWeek === 3 && hour === 1 && minute === 0) {
  //     return true;
  //   }


  //   return false;
  // }


  // // 스케줄 데이터 삭제
  // function resetFirebaseValue() {
  //   const reference = ref(db, "/RaidCompletion");  // 삭제하려는 데이터의 경로

  //   if (isScheduledTime()) {
  //     remove(reference);
  //   }
  // }

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     resetFirebaseValue();
  //   }, 3600000);  // 1시간마다 
  //   return () => clearInterval(interval); // 컴포넌트 언마운트시 인터벌 제거
  // }, []);

  // useEffect(() => {
  //   const raidCompletionRef = ref(db, "/RaidCompletion");
  //   onValue(raidCompletionRef, (snapshot) => {
  //     const raidData = snapshot.val();
  //     let checkedData = {};
  //     for (let nickname in raidData) {
  //       if (raidData[nickname].isChecked !== undefined) {
  //         checkedData[nickname] = raidData[nickname].isChecked;
  //       }
  //     }
  //     setIsFourGateChecked(checkedData);
  //   });
  // }, []);





  return (
    <div className="container mt-4 custom-container">
      {/* {charactersData &&
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
              data.timestamp, // 타임스탬프도 함께 반환합니다.
            ];
          })
          .sort((a, b) => a[2] - b[2]) // 타임스탬프를 기준으로 역순 정렬합니다.
          .map(([nickname, characters], index) => (
            <div key={index} className="mt-4">
              <div className="headerContainer">
                <h4>{nickname}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '2px', fontSize: 15 }}>
                      4관문
                    </div>
                    <Toggle
                      checked={isFourGateChecked[nickname]}
                      onChange={() => toggleEditFourGateCheckedMode(nickname)}
                    />
                  </div>

                  {isEditModes[nickname] && (
                    <span>
                      <button
                        className="custom-button2"
                        onClick={() => handleRefreshNickname(nickname)}
                      >
                        초기값
                      </button>{" "}
                      <button
                        className="custom-button2"
                        onClick={() => handleDeleteNickname(nickname)}
                      >
                        전체삭제
                      </button>
                    </span>
                  )}{" "}
                  <button
                    className="custom-button2"
                    onClick={() => toggleEditMode(nickname)}
                  >
                    {isEditModes[nickname] ? "확인" : "편집"}
                  </button>
                </div>

              </div>
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    {isEditModes[nickname] && <th></th>}
                    <th>캐릭터</th>
                    {Object.keys(raidLevels).map((raid, idx) => (
                      <th key={idx} style={{ width: "150px" }}>
                        {raid}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {characters.map((character, charIndex) => {
                    const topThreeRaids = getTopThreeRaids(
                      parseFloat(character.ItemAvgLevel.replace(",", "")),
                      nickname
                    );

                    return (
                      <tr key={charIndex}>
                        {isEditModes[nickname] && (
                          <td>
                            <button
                              className="minusButton"
                              onClick={() =>
                                handleDelete(
                                  character.CharacterName,
                                  nickname
                                )
                              }
                            >
                              <FaMinus />
                            </button>
                          </td>
                        )}
                        <td
                          style={{
                            width: "160px",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {character.CharacterName} (
                          {character.ItemAvgLevel})
                        </td>
                        {Object.keys(raidLevels).map(
                          (raidName, subIndex) => (
                            <td
                              key={subIndex}
                              onClick={() =>
                                toggleRaidCompletion(
                                  character.CharacterName,
                                  raidName,
                                  nickname
                                )
                              }
                              style={
                                completedRaids[character.CharacterName] &&
                                  completedRaids[character.CharacterName][
                                  raidName
                                  ] === "완료"
                                  ? {
                                    backgroundColor: "#A0A0A0",
                                    color: "white",
                                  }
                                  : {}
                              }
                            >
                              {completedRaids[character.CharacterName] &&
                                completedRaids[character.CharacterName][
                                raidName
                                ] === "완료" ? (
                                "완료"
                              ) : topThreeRaids.includes(raidName) ? (
                                <FaCoins
                                  className="icon"
                                  size="13"
                                  color="gold"
                                />
                              ) : (
                                ""
                              )}
                            </td>
                          )
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
      <div className="centerButtonContainer">
        <button className="addButton" onClick={handleIconClick}>
          <FaPlus />
        </button>
      </div> */}

    </div>
  );
}

export default AddTable;
