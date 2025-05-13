import { Alert } from "react-native";
import Storage from '../utils/Storages';
import { StorageKey } from '../utils/GlobalConfig';
import { LOGIN_SCREEN } from "../constants/RootKey";

export const emailValidation = email => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/;
    if (reg.test(email) === false) {
        return false;
    } else {
        return true;
    }
};

export const getRandomColor = (() => {
    const colors = ['#36a34f', '#00fc3b', '#164d23', '#72c285', '#9cb5a2', '#999999'];
    let currentIndex = 0;

    return () => {
        if (currentIndex >= colors.length || currentIndex < 0) {
            currentIndex = 0;
        }
        const color = colors[currentIndex];
        currentIndex = (currentIndex + 1) % colors.length;
        return color;
    };
})();

export const handleLogout = async (navigation) => {
    Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                onPress: async () => {
                    await Storage.removeItem(StorageKey.CURR_USER_LOGIN_DATA);
                    navigation.replace(LOGIN_SCREEN);
                },
            },
        ]
    );
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
};
