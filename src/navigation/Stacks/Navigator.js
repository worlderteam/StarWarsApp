import { createNavigationContainerRef, DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { CREATE_GROUP_SCREEN, LOGIN_SCREEN, REGISTER_SCREEN, GROUP_HOME_SCREEN, SWAPI_SCREEN, SPLASH_SCREEN, BOTTOM_TAB_BAR, PROFILE_SCREEN, GROUP_DETAIL_SCREEN } from '../../constants/RootKey';

import LoginScreen from '../../screens/LoginScreen';
import RegisterScreen from '../../screens/RegisterScreen';
import CreateGroupScreen from '../../screens/CreateGroupScreen';
import GroupHomeScreen from '../../screens/GroupHomeScreen';
import SplashScreen from '../../screens/SplashScreen';
import SwapiScreen from '../../screens/SwapiScreen';
import colorScheme from '../../../assets/themes/colorScheme';
import { Metrics } from '../../utils/GlobalConfig';
import ProfileScreen from '../../screens/ProfileScreen';
import GroupDetailScreen from '../../screens/GroupDetailScreen';

export const navigationRef = createNavigationContainerRef()

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabBar = ({ navigation }) => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === GROUP_HOME_SCREEN) {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === CREATE_GROUP_SCREEN) {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    } else if (route.name === PROFILE_SCREEN) {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007aff',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarStyle: {
                    paddingBottom: 16,
                    alignItems: 'center',
                    height: Metrics.SCREEN_HEIGHT * 0.1,
                    backgroundColor: colorScheme.$white,
                },
            })}
        >
            <Tab.Screen name={GROUP_HOME_SCREEN} component={GroupHomeScreen} />
            <Tab.Screen
                name={CREATE_GROUP_SCREEN}
                component={CreateGroupScreen}
                listeners={{
                    tabPress: e => {
                        e.preventDefault();
                        navigation.navigate(CREATE_GROUP_SCREEN);
                    },
                }}
            />
            <Tab.Screen name={PROFILE_SCREEN} component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const Navigator = () => {
    return (
        <>
            <NavigationContainer ref={navigationRef} theme={DarkTheme}>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        animation: 'none',
                    }}
                    initialRouteName={SPLASH_SCREEN}>
                    <Stack.Screen name={SPLASH_SCREEN} component={SplashScreen} />
                    <Stack.Screen name={LOGIN_SCREEN} component={LoginScreen} />
                    <Stack.Screen name={REGISTER_SCREEN} component={RegisterScreen} />
                    <Stack.Screen name={SWAPI_SCREEN} component={SwapiScreen} />
                    <Stack.Screen name={BOTTOM_TAB_BAR} component={BottomTabBar} />
                    <Stack.Screen name={CREATE_GROUP_SCREEN} component={CreateGroupScreen} />
                    <Stack.Screen name={GROUP_DETAIL_SCREEN} component={GroupDetailScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
};

export default Navigator;
