import { StyleSheet } from 'react-native';
import colorScheme from '../../../assets/themes/colorScheme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorScheme.$white,
        padding: 20,
    },
    groupDetailSection: {
        marginBottom: 20,
    },
    groupTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colorScheme.$darkGray,
        marginBottom: 10,
    },
    groupDescription: {
        fontSize: 16,
        color: colorScheme.$gray,
        marginBottom: 20,
    },
    labelStarship: {
        fontSize: 16,
        color: colorScheme.$gray,
        marginBottom: 10,
    },
    groupStarship: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colorScheme.$darkGray,
    },
    map: {
        height: 400,
        marginBottom: 20,
    },
    memberList: {
        paddingBottom: 20,
    },
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: colorScheme.$white,
        paddingVertical: 10,
        borderRadius: 10,
    },
    memberPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colorScheme.$darkGray,
    },
    memberRole: {
        fontSize: 14,
        color: colorScheme.$gray,
        marginBottom: 5,
    },
    memberLocation: {
        fontSize: 12,
        color: colorScheme.$gray,
    },
    statusMember: {
        fontSize: 12,
        color: colorScheme.$red,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        flex: 1,
        fontWeight: 'bold',
        color: colorScheme.$gray,
    },
    detailValue: {
        flex: 2,
        textAlign: 'right',
        color: colorScheme.$darkBlackBg,
    },
    joinButton: {
        backgroundColor: colorScheme.$green,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 5,
        marginVertical: 10,
        marginBottom: 20,
      },
      joinButtonText: {
        color: colorScheme.$white,
        fontWeight: 'bold',
        textAlign: 'center',
      },
});

export default styles;