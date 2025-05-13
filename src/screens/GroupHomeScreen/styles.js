import { StyleSheet } from 'react-native';
import { Metrics } from '../../utils/GlobalConfig';
import colorScheme from '../../../assets/themes/colorScheme';

const styles = StyleSheet.create({
    containerSafeArea: {
        flex: 1,
        backgroundColor: colorScheme.$whiteCream,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colorScheme.$whiteCream,
    },
    groupCard: {
        backgroundColor: colorScheme.$white,
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
    },
    groupHeader: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 10,
    },
    groupIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colorScheme.$blueColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    groupInitials: {
        color: colorScheme.$white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colorScheme.$darkBlackBg,
    },
    memberCount: {
        textAlign: 'left',
        color: colorScheme.$darkGray,
        marginBottom: 10,
    },
    memberList: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    memberAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 5,
    },
    roleLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    roleText: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    emptyStateContainer: {
        flex: 1,
        paddingTop: Metrics.SCREEN_WIDTH / 2,
        alignItems: 'center',
    },
    emptyStateTitle: {
        fontSize: 24,
        color: colorScheme.$darkBlackBg,
        fontWeight: '600',
        marginTop: 20,
    },
    emptyStateSubtitle: {
        fontSize: 16,
        color: colorScheme.$darkGray,
        textAlign: 'center',
        paddingHorizontal: 30,
        marginTop: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    leftColumn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 20,
    },
    rightColumn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 20,
    },
    pieChartContainer: {
        paddingBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default styles;