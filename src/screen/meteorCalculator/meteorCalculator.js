import '../css/meteorCalculator.css';
import React, { useEffect, useState } from 'react';

function MeteorCalculator() {
    const [timerTiles, setTimerTiles] = useState([
        [false, false, false],
        [false, false, false],
        [false, false, false]
    ]);

    const [tiles, setTiles] = useState([
        [3, 3, 3],
        [3, 14, 3],
        [3, 3, 3]
    ]);

    const [blueMeteorTimers, setBlueMeteorTimers] = useState(new Set());
    const [isYellowMeteorActiveTop, setIsYellowMeteorActiveTop] = useState(false);
    const [isYellowMeteorActiveBottom, setIsYellowMeteorActiveBottom] = useState(false);


    const blueMeteor = (row, col) => {
        const newTiles = [...tiles];
        const newTimerTiles = [...timerTiles];
        newTiles[row][col] -= 1;

        if (newTiles[row][col] === 0) {
            newTiles[row][col] = 100;
            newTimerTiles[row][col] = true; // 타이머 동작 시작

            const timerIndex = row * 3 + col;
            blueMeteorTimers.add(timerIndex);
            setBlueMeteorTimers(new Set(blueMeteorTimers));

            const timer = setInterval(() => {
                if (newTiles[row][col] > 1) {
                    newTiles[row][col] -= 1;
                    setTiles([...newTiles]);
                } else {
                    newTiles[row][col] = 3;
                    newTimerTiles[row][col] = false; // 타이머 동작 종료
                    blueMeteorTimers.delete(timerIndex);
                    setBlueMeteorTimers(new Set(blueMeteorTimers));
                    setTiles([...newTiles]);
                    setTimerTiles([...newTimerTiles]);
                    clearInterval(timer);
                }
            }, 1000);
        }
        setTiles(newTiles);
        setTimerTiles(newTimerTiles);
    };
    const yellowMeteor_top = () => {
        setIsYellowMeteorActiveTop(true);
        const newTiles = [...tiles];
        const newTimerTiles = [...timerTiles];

        const tilesToChange = [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 1, col: 0 },
        ];

        tilesToChange.forEach(tile => {
            const timerIndex = tile.row * 3 + tile.col;

            if (!blueMeteorTimers.has(timerIndex)) {
                newTiles[tile.row][tile.col] = 100;
                newTimerTiles[tile.row][tile.col] = true;
            }
        });

        // [2][1] 위치의 타일의 체력을 -3 시킵니다.
        newTiles[1][1] -= 3;

        const timer = setInterval(() => {
            let allDone = true;
            tilesToChange.forEach(tile => {
                const timerIndex = tile.row * 3 + tile.col;

                if (!blueMeteorTimers.has(timerIndex)) {
                    if (newTiles[tile.row][tile.col] > 1) {
                        newTiles[tile.row][tile.col] -= 1;
                        allDone = false;
                    } else {
                        newTiles[tile.row][tile.col] = 3;
                        newTimerTiles[tile.row][tile.col] = false; // 타이머 동작 종료
                    }
                }
            });

            setTiles([...newTiles]);

            if (allDone) {
                setIsYellowMeteorActiveTop(false);
                clearInterval(timer);
            }

        }, 1000);
    };



    const yellowMeteor_bottom = () => {
        setIsYellowMeteorActiveBottom(true);
        const newTiles = [...tiles];
        const newTimerTiles = [...timerTiles];

        const tilesToChange = [
            { row: 1, col: 2 },
            { row: 2, col: 1 },
            { row: 2, col: 2 },
        ];

        tilesToChange.forEach(tile => {
            const timerIndex = tile.row * 3 + tile.col;

            if (!blueMeteorTimers.has(timerIndex)) {
                newTiles[tile.row][tile.col] = 100;
                newTimerTiles[tile.row][tile.col] = true;
            }
        });

        newTiles[1][1] -= 3;

        const timer = setInterval(() => {
            let allDone = true;
            tilesToChange.forEach(tile => {
                const timerIndex = tile.row * 3 + tile.col;

                if (!blueMeteorTimers.has(timerIndex)) {
                    if (newTiles[tile.row][tile.col] > 1) {
                        newTiles[tile.row][tile.col] -= 1;
                        allDone = false;
                    } else {
                        newTiles[tile.row][tile.col] = 3;
                        newTimerTiles[tile.row][tile.col] = false; // 타이머 동작 종료
                    }
                }
            });

            setTiles([...newTiles]);

            if (allDone) {
                setIsYellowMeteorActiveBottom(false);
                clearInterval(timer);
            }

        }, 1000);
    };


    return (
        <div className="container mt-4 custom-container">
            <div id="div_main_body" class="div_body">
                <div className="div_check_time">
                    <button
                        className="btn_check"
                        onClick={yellowMeteor_top}
                        disabled={isYellowMeteorActiveTop} // 버튼 비활성화 로직
                    >
                        노메
                    </button>
                </div>
                <table id="tbl_main" className="tbl_main">
                    {tiles.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((tile, colIndex) => (
                                <td
                                    key={colIndex}
                                    onClick={() => {
                                        if (!timerTiles[rowIndex][colIndex]) {
                                            blueMeteor(rowIndex, colIndex);
                                        }
                                    }}
                                    style={{ backgroundColor: timerTiles[rowIndex][colIndex] ? '#A0A0A0' : '' }}
                                >


                                    <div>
                                        {timerTiles[rowIndex][colIndex] ? `${Math.floor(tile / 60)}:${tile % 60 < 10 ? '0' : ''}${tile % 60}` : tile}
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </table>

                <div className="div_check_time" style={{ marginTop: 90 }}>
                    <button
                        className="btn_check"
                        onClick={yellowMeteor_bottom}
                        disabled={isYellowMeteorActiveBottom} // 버튼 비활성화 로직
                    >
                        노메
                    </button></div>
            </div>
        </div>
    );
}

export default MeteorCalculator;
