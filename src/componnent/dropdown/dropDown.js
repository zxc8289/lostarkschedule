import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import './dropDown.css';


function DropDown() {
    const dropDownRef = useRef(null);

    return (
        <div className="dropDown">
            <ul
                ref={dropDownRef}
                className="dropDown"
            >
                <li>
                    <Link to="/mypage">마이페이지</Link>
                </li>
                {/* 메뉴 리스트들 */}
            </ul>
        </div>
    );
};

export default DropDown;
