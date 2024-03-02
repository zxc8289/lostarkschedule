
import React, { useState } from 'react';
import './apiKeyForm.css';
import { FaUnderline } from 'react-icons/fa';

function ApiKeyForm({ onSave }) {
    const [apiKey, setApiKey] = useState('');

    const handleSave = () => {
        if (apiKey.trim() !== '') {
            onSave(apiKey);
        } else {
            alert('API 키를 입력해주세요.');
        }
    };
    return (
        <div className="api-key-form-container">
            <div className="api-key-form">
                <div style={{
                    color: "#15A658",
                    fontFamily: "pretendard-black",
                    fontSize: 100,
                    textAlign: 'center',
                    textShadow: '9px 9px 5px rgba(21,166,88,0.15)'
                }}>
                    !
                </div>
                <div style={{
                    color: "#15A658",
                    borderRadius: 50,
                    fontFamily: "pretendard-black",
                    fontSize: 30,
                    textAlign: 'center',
                    marginBottom: 10,
                }}>API KEY를 등록해주세요.</div>
                <div style={{
                    color: "#727272",
                    borderRadius: 50,
                    fontFamily: "pretendard-regular",
                    fontSize: 12,
                    textAlign: 'center',
                    marginBottom: 45,
                }}>캐릭터 및 계정의 정보를 불러오기 위해서는 API KEY가 필요해요.</div>
                <div style={{ display: 'flex', marginBottom: 100 }}>
                    <input
                        type="text"
                        placeholder="발급 받은 API KEY를 이 곳에 입력해주세요."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        style={{
                            marginRight: 20,
                            border: "1px solid #B4B4B4",
                            background: "#EDEDED",
                            color: "#727272",
                            height: '37px',
                            borderRadius: 50,
                            fontFamily: "pretendard-regular",
                            paddingLeft: 10,
                            paddingRight: 10,
                            width: 310,
                            fontSize: 14,
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
                        width: 85,
                        fontSize: 16,
                        cursor: "pointer",
                        background: "#15A658",
                        fontFamily: "pretendard-regular",
                        color: "white",
                    }} onClick={handleSave}>입력</div>
                </div>
                <a href="https://canfactory.tistory.com/1081" target="_blank" rel="noopener noreferrer" style={{
                    textDecoration: 'none',
                    border: "1px solid #606574",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingRight: 23,
                    paddingLeft: 23,
                    borderRadius: 50,
                    width: 330,
                    fontSize: 16,
                    height: 42,
                    cursor: "pointer",
                    fontFamily: "pretendard-semibold",
                    color: "#606574",
                    marginBottom: 8,
                }}>
                    API KEY 발급 받는 방법 보러가기
                </a>
                <div style={{
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "pretendard-regular",
                    color: "#727272",
                    textDecoration: "underline" // 여기에 밑줄 스타일을 추가합니다.
                }}>
                    API KEY가 무엇인가요?
                </div>

            </div>
        </div>
    );
}

export default ApiKeyForm;
