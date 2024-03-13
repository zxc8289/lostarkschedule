import React, { useState, useEffect, useRef } from 'react';
import { auth, signOut, db } from '../../firebase';
import { onAuthStateChanged } from "firebase/auth";
import './navbar.css';
import { useNavigate, Link } from "react-router-dom"; // useNavigate와 Link를 가져옵니다.
import { FiMoreVertical } from 'react-icons/fi';
import { Button, Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { ref, set, push, child, onValue, update } from "firebase/database";
import useOutsideAlerter from '../../hoook/useOutsideAlerter';


function NavBar() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useOutsideAlerter(dropdownRef, setShowDropdown);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          photoURL: currentUser.photoURL,
          displayName: currentUser.displayName,
        });
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      navigate('/');
    }).catch((error) => {
      console.error('Logout Error:', error);
    });
  };

  const saveApiKey = (apiKey) => {
    if (apiKey.trim() !== '') {
      const userRef = ref(db, `Users/${auth.currentUser.uid}`);

      update(userRef, { apiKey: apiKey })
        .then(() => {
          alert('API 키가 성공적으로 저장되었습니다.');
        })
        .catch((error) => {
          console.error('API 키 저장 실패:', error);
          alert('API 키 저장에 실패했습니다.');
        });
    } else {
      alert('API 키를 입력해주세요.');
    }
  };


  return (
    <div>
      <Navbar expand="lg" className="custom-navbar" fixed='top'>
        <div className="nav-container">
          <div className="brand-section">
            <Link to="/" className="navbar-brand">
              <img src="/img/로아숙제2.png" width="150" height="27" alt="로아숙제" />
            </Link>
          </div>
          <div className="nav-links">
            <Link to={user ? "/weeklygroupcreator" : "/login"}>주간숙제</Link>
            {/* <Link to="/ricecalculator">쌀계산기</Link>
            <Link to="/추가예정">컨닝페이퍼</Link> */}
            <Link to={user ? "/schedulegroupcreator" : "/login"}>고정 파티</Link>
            <Link to="/patchlog">패치로그</Link>
          </div>
          <div className="user-section">
            {user ? (
              <div className="user-dropdown">
                <img src={user.photoURL} width="30" height="30" className="rounded-circle" alt="Profile" />
                <span>{user.displayName}</span>
                <button onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }} style={{ color: "#D9D9D9" }}>
                  <FiMoreVertical />
                </button>
                {showDropdown && (
                  <div className="profile-dropdown-menu" ref={dropdownRef}>
                    <Link to="/myinfo" style={{ marginBottom: 10, color: "black" }}>내 정보</Link> {/* 예시 URL */}
                    <Link to="/apikeyupdate" style={{ marginBottom: 10, color: "black" }}>API KEY 수정</Link>
                    <div style={{ border: "1px solid #E6E8EC", marginLeft: 8, marginRight: 8, marginBottom: 10 }}></div>
                    <a onClick={handleLogout} style={{ color: "#FF5252" }}>로그아웃</a>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-link">로그인</Link>
            )}
          </div>
        </div>
      </Navbar>
    </div>
  );
}

export default NavBar;
