import React, { useEffect, useState } from 'react';
import { auth, signInWithGoogle, db, ref, set } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import './login.css';
import { update } from 'firebase/database';

function Login() {
    const [loading, setLoading] = useState(true); // 로딩 상태
    const navigate = useNavigate(); // 네비게이트 함수

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // 사용자가 로그인한 경우
                console.log("Logged in user:", user);

                // 사용자 정보를 데이터베이스에 저장
                const userRef = ref(db, `Users/${user.uid}`);
                update(userRef, {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    lastLogin: new Date().toISOString()
                });


                setLoading(false); // 로딩 상태 해제
                navigate('/'); // 홈 페이지로 이동
            } else {
                // 로그인 프로세스 시작
                signInWithGoogle();
            }
        });

        return () => unsubscribe();
    }, [navigate]); // useEffect 의존성 배열에 navigate 추가
    if (loading) {
        // 로딩 중 로딩 인디케이터 표시
        return <div className="text-center">
            <div className="spinner-border" style={{ width: "3rem", height: "3rem", borderWidth: "0.3rem", color: "#15A658" }}>
                <span className="sr-only"></span>
            </div>
        </div>
    }

    // 로딩 페이지 표시 (실제로는 이 부분이 렌더링되지 않음)
    return <div>Login Page</div>;
}

export default Login;
