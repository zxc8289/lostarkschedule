import { get, ref } from "firebase/database";
import { db } from "../firebase";

export const fetchUserApiKey = async (userId) => {
    const userRef = ref(db, `Users/${userId}`);
    try {
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        return userData ? userData.apiKey : null;
    } catch (error) {
        console.error("API 키를 불러오는 데 실패했습니다:", error);
        return null;
    }
};