import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import colorScheme from '../../../../assets/themes/colorScheme';

const HomeHeader = ({ activeTab, setActiveTab, tabList }) => {
    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                {tabList.map((item) => {
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.buttonContainer, activeTab === item.tabName && styles.activeButtonContainer]}
                            onPress={() => {
                                setActiveTab(item.tabName)
                            }}>
                            <Text style={[styles.tabText, activeTab === item.tabName && styles.activeTabText]}>{item.tabName}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colorScheme.$whiteCream,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colorScheme.$darkBlackBg,
        textShadowColor: colorScheme.$blackBg,
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'black'
    },
    buttonContainer: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    activeButtonContainer: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colorScheme.$darkBlackBg,
    },
    tabText: {
        color: colorScheme.$darkBlackBg,
        fontSize: 14,
        paddingHorizontal: 20,
    },
    activeTabText: {
        color: colorScheme.$darkBlackBg,
        fontWeight: 'bold',
    },
});

export default HomeHeader;
