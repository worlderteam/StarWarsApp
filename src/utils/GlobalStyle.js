import { StyleSheet } from "react-native";
import colorScheme from "../../assets/themes/colorScheme";

const GlobalStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorScheme.$blackBg,
    }
})

export default GlobalStyle