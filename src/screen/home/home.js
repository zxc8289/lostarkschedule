import React, { useEffect, useState } from 'react';
import './home.css';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home-flex-container">
            <div className="home-flex">
                <div style={{ color: "#727272", fontFamily: "pretendard-regular", fontSize: 20, marginBottom: 10 }}>LOST ARK 레이드 현황 공유 서비스, <span style={{ fontFamily: "pretendard-black", }}>로아숙제</span></div>
                <div style={{ color: "#15A658", fontFamily: "pretendard-black", fontSize: 40, marginBottom: 80 }}>공대원의 숙제를 확인하고 <br />로스트아크를 함께 즐겨보세요!</div>
                <Link to='/raidschedulecreator' style={{
                    border: "1px solid #15A658",
                    width: 300,
                    height: 40,
                    paddingRight: 23,
                    paddingLeft: 23,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    fontSize: 16,
                    cursor: "pointer",
                    background: "#15A658",
                    fontFamily: "pretendard-regular",
                    color: "white",
                    textDecoration: 'none',
                }}>레이드 숙제로 이동</Link>
            </div>
        </div>
    );
}

export default Home;
