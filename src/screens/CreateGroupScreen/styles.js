import { StyleSheet } from 'react-native';
import colorScheme from '../../../assets/themes/colorScheme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorScheme.$whiteCream,
    },
    header: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 18,
        color: colorScheme.$darkGray,
    },
    saveText: {
        color: colorScheme.$blueColor,
        fontSize: 16,
    },
    groupSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    groupImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    groupImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colorScheme.$blueColor,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    groupInitials: {
        fontSize: 32,
        color: '#fff',
    },
    cameraIcon: {
        position: 'absolute',
        right: -10,
        top: 10,
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 15,
    },
    groupLabel: {
        marginTop: 10,
        fontSize: 16,
        color: colorScheme.$darkGray,
    },
    inputSection: {
        marginBottom: 20,
    },
    inputRow: {
        backgroundColor: colorScheme.$white,
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: colorScheme.$whiteCream,
    },
    label: {
        fontSize: 16,
        color: colorScheme.$darkGray,
    },
    input: {
        textAlign: 'right',
        flex: 2,
        fontSize: 16,
        color: colorScheme.$blackBg,
    },
    inputDesc: {
        backgroundColor: colorScheme.$white,
        paddingHorizontal: 20,
        paddingVertical: 20,
        fontSize: 16,
        color: colorScheme.$blackBg,
    },
    inviteMemberRow: {
        backgroundColor: colorScheme.$white,
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: colorScheme.$whiteCream,
    },
    inviteText: {
        fontSize: 16,
        color: colorScheme.$darkGray,
    },
    memberItem: {
        paddingVertical: 20,
        backgroundColor: colorScheme.$white,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberPhoto: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 6,
    },
    memberName: {
        flex: 1,
        fontSize: 16,
        color: colorScheme.$darkGray,
    },
    form: {
        paddingBottom: 80,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        padding: 20,
        backgroundColor: colorScheme.$white,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        color: colorScheme.$gray,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    emailInput: {
        color: colorScheme.$darkBlackBg,
        width: '100%',
        padding: 15,
        borderRadius: 8,
        borderColor: colorScheme.$gray,
        borderWidth: 1,
        marginBottom: 20,
        backgroundColor: colorScheme.$white,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    inviteButton: {
        backgroundColor: colorScheme.$green,
        padding: 15,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    inviteButtonText: {
        color: colorScheme.$white,
        fontWeight: 'bold',
    },
});

export default styles;