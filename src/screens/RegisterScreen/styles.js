import { Platform, StyleSheet } from "react-native";
import colorScheme from "../../../assets/themes/colorScheme";
import { Metrics } from "../../utils/GlobalConfig";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorScheme.$whiteCream,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: colorScheme.$whiteCream,
    },
    headerTitle: {
        fontSize: 18,
        color: colorScheme.$darkGray,
    },
    saveText: {
        color: colorScheme.$blueColor,
        fontSize: 16,
    },
    form: {
        alignItems: 'center',
        paddingBottom: 80,
    },
    inputRow: {
        paddingVertical: Platform.OS === 'ios' ? 10 : 0,
        width: '100%',
        backgroundColor: colorScheme.$white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 14,
        color: colorScheme.$darkGray,
        flex: 1,
    },
    input: {
        fontSize: 14,
        flex: 2,
        textAlign: 'right',
        color: colorScheme.$darkBlackBg,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: colorScheme.$whiteCream,
    },
    gap: {
        height: 20,
        width: '100%',
    },
    imageContainer: {
        marginBottom: 40,
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    defaultImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colorScheme.$green,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        fontSize: 32,
        color: colorScheme.$white,
    },
    nameText: {
        fontSize: 16,
        color: colorScheme.$blackBg,
        marginTop: 10,
    },
    cameraIcon: {
        position: 'absolute',
        top: 10,
        right: -10,
        backgroundColor: colorScheme.$white,
        borderRadius: 20,
        padding: 4,
    },
    cameraContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    camera: {
        height: Metrics.SCREEN_WIDTH,
        width: Metrics.SCREEN_WIDTH,
    },
    takePictureButton: {
        marginTop: 80,
        width: '80%',
        paddingVertical: 10,
        backgroundColor: colorScheme.$green,
        borderRadius: 5,
        alignItems: 'center',
        zIndex: 100,
    },
    confirmButtonText: {
        color: colorScheme.$white,
        fontSize: 16,
    },
    errorText: {
        color: colorScheme.$blackBg,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: colorScheme.$white,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 16,
        color: colorScheme.$darkGray,
        marginBottom: 20,
        textAlign: 'center',
    },
    confirmButton: {
        width: '100%',
        paddingVertical: 10,
        backgroundColor: colorScheme.$green,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    skipButton: {
        width: '100%',
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: colorScheme.$blueColor,
        borderRadius: 5,
        alignItems: 'center',
    },
    skipButtonText: {
        color: colorScheme.$blueColor,
        fontSize: 16,
    },
});

export default styles;