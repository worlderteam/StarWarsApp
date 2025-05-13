import { Dimensions } from "react-native"

export const Colors = {
    RED_DARK: "#5e0003",
    RED: '#910005',
    GREEN: '#3A8048',
    BLACK: '#000000',
    GRAY: '#a7a9ab',
    GRAY_LIGHT: '#efefef',
    WHITE: '#ffffff',
    BLUE : '#0691ce',
    YELLOW: '#eed202'
}

export const Metrics = Object.freeze({
    SAFE_AREA: 16,
    SCREEN_WIDTH: Dimensions.get('window').width,
    SCREEN_HEIGHT: Dimensions.get('window').height,
    NAVBAR_HEIGHT: 56
})

export const StorageKey = {
    LIST_USER: 'LIST_USER',
    CURR_USER_LOGIN_DATA: 'CURR_USER_LOGIN_DATA',
    GROUPS: 'GROUPS'
}

export const ArrayOfLanguage = [
    {
        languageName: 'Bahasa Indonesia',
        code: 'ID'
    },
    {
        languageName: 'English',
        code: 'EN'
    },
]