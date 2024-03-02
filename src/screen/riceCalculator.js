
// import axios from 'axios';
// import { token } from "../const/token";
// import { Card, ListGroup } from 'react-bootstrap';
// import { FaSync } from "react-icons/fa";
// import { useEffect, useState } from 'react';

// function RiceCalculator() {
//     const [items, setItems] = useState([]);  // 아이템 데이터를 저장할 상태 변수
//     const [items2, setItems2] = useState("");


//     const fetchData = async (setItems) => {
//         try {
//             const fetchedItems = [];
//             // 페이지 1부터 3까지 순회하며 데이터를 가져옵니다.
//             for (let i = 1; i <= 3; i++) {
//                 const payload = {
//                     CategoryCode: 90000,
//                     Sort: "GRADE",
//                     SortCondition: "ASC",
//                     ItemTier: 0,
//                     ItemGrade: "",
//                     CharacterClass: "",
//                     ItemName: "",
//                     PageNo: i
//                 };

//                 const response = await axios.post(
//                     `https://developer-lostark.game.onstove.com/markets/items`,
//                     payload,
//                     {
//                         headers: {
//                             accept: "application/json",
//                             authorization: token,
//                         },
//                     }
//                 );

//                 if (response.data && response.data.Items) {
//                     fetchedItems.push(...response.data.Items);

//                 } else {
//                     throw new Error("Invalid response.");
//                 }
//             }

//             setItems(fetchedItems);  // 모든 페이지의 데이터를 상태 변수에 저장합니다.
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };

//     const fetchData2 = async (setItems2) => {
//         try {

//             const payload = {
//                 CategoryCode: 50000,
//                 Sort: "GRADE",
//                 SortCondition: "ASC",
//                 ItemTier: 0,
//                 ItemGrade: "",
//                 CharacterClass: "",
//                 ItemName: "최상급 오레하 융화 재료",
//                 PageNo: 1
//             };

//             const response = await axios.post(
//                 `https://developer-lostark.game.onstove.com/markets/items`,
//                 payload,
//                 {
//                     headers: {
//                         accept: "application/json",
//                         authorization: token,
//                     },
//                 }
//             );

//             if (response.data) {
//                 setItems2(response.data.Items[0]);

//             } else {
//                 throw new Error("Invalid response.");
//             }

//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };

//     useEffect(() => {
//         fetchData(setItems);
//         fetchData2(setItems2);
//     }, []);

//     function calculateTotalCost(desiredItems) {
//         let totalCost = 0;
//         items.forEach(item => {
//             if (desiredItems.includes(item.Name)) {
//                 const perItemPrice = item.RecentPrice / item.BundleCount;
//                 let quantity = 0;
//                 switch (item.Name) {
//                     case "오레하 유물":
//                         quantity = 52;
//                         break;
//                     case "희귀한 유물":
//                         quantity = 51;
//                         break;
//                     case "고대 유물":
//                         quantity = 107;
//                         break;
//                     case "오레하 두툼한 생고기":
//                         quantity = 52;
//                         break;
//                     case "질긴 가죽":
//                         quantity = 69;
//                         break;
//                     case "두툼한 생고기":
//                         quantity = 142;
//                         break;
//                     case "오레하 태양 잉어":
//                         quantity = 52;
//                         break;
//                     case "자연산 진주":
//                         quantity = 69;
//                         break;
//                     case "생선":
//                         quantity = 142;
//                         break;
//                     default:
//                         quantity = 0;  // 다른 아이템의 경우, 기본 수량은 1로 가정
//                         break;
//                 }
//                 totalCost += perItemPrice * quantity;
//             }
//         });
//         return totalCost + 300;
//     }

//     return (
//         <div className="container mt-3 custom-container">
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "10px" }}>

//                 <div style={{ display: 'flex', alignItems: 'center' }}>

//                     <button
//                         onClick={() => {
//                             fetchData(setItems);
//                             fetchData2(setItems2);
//                         }}
//                         className="reloadButton"
//                     >
//                         <FaSync />
//                     </button>
//                     {/* <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                         <div style={{ marginBottom: '2px', fontSize: 15 }}>
//                             <b>영지 수수료 연구</b>
//                         </div>
//                         <Toggle

//                         />
//                     </div> */}


//                 </div>


//                 <div style={{ display: 'flex', alignItems: 'center' }}>
//                     <img src={items2.Icon} style={{ width: '35px', height: 'auto' }} />
//                     <h5 style={{ display: 'inline-block', margin: 0 }}>
//                         &nbsp;최상급 오레하 융화 재료: {items2.RecentPrice} 골드
//                     </h5>
//                 </div>
//             </div>

//             <div className="row">
//                 {["제작 공방(수렵)", "제작 공방(낚시)", "제작 공방(고고학)"].map((title, index) => {
//                     const desiredItemsList = [
//                         ["오레하 두툼한 생고기", "질긴 가죽", "두툼한 생고기"],
//                         ["오레하 태양 잉어", "자연산 진주", "생선"],
//                         ["오레하 유물", "희귀한 유물", "고대 유물"]
//                     ];
//                     const totalCost = parseFloat(calculateTotalCost(desiredItemsList[index]).toFixed(2));

//                     return (
//                         <div className="col-md-4" key={index}>

//                             <Card>
//                                 <Card.Header className="text-center d-flex align-items-center" style={{ height: "50px" }}>
//                                     <h5 className="mx-auto mb-0">{title}</h5>
//                                 </Card.Header>

//                                 <ListGroup variant="flush">
//                                     {items.map((item, itemIndex) => {
//                                         // 원하는 아이템 이름을 검사합니다.
//                                         if (desiredItemsList[index].includes(item.Name)) {
//                                             return (
//                                                 <ListGroup.Item key={itemIndex}>
//                                                     <div style={{
//                                                         display: 'flex',
//                                                         justifyContent: 'space-between',
//                                                         alignItems: 'center', // 가로축 중앙 정렬

//                                                     }}>
//                                                         <img src={item.Icon} alt={item.Name} style={{ width: '40px', height: 'auto' }} />
//                                                         <p style={{ margin: '0' }}>{item.Name}</p>
//                                                         <p style={{ margin: '0' }}>
//                                                             {item.RecentPrice} {' '}

//                                                         </p>

//                                                     </div>
//                                                 </ListGroup.Item>
//                                             );
//                                         }
//                                         return null;
//                                     })}
//                                 </ListGroup>

//                                 <Card.Footer className="text-center align-items-center" style={{ height: "125px" }}>
//                                     <ListGroup.Item>
//                                         <p>제작 총 비용: {totalCost.toFixed(2)} 골드</p>
//                                         <p>오레하 15개 가격: {(items2.RecentPrice * 15).toFixed(2)} 골드</p>
//                                         <p>이윤: <b>{(items2.RecentPrice * 15 - totalCost).toFixed(2)}</b> 골드</p>
//                                     </ListGroup.Item>
//                                 </Card.Footer>


//                             </Card>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }

// export default RiceCalculator;
