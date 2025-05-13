import { StorageKey } from "../../utils/GlobalConfig";
import { apiCaller } from "../utils/apiCallers";
import Storage from '../../utils/Storages';
import { Keyboard } from "react-native";

export const loginRequest = async (params) => {
    try {
        const api = apiCaller();
        const response = await api.post(`/login`, {
            email: params?.email,
            password: params?.password,
        });

        if (response.statusCode === 200) {
            return Promise.resolve(response.responseContent);
        } else {
            return Promise.reject(response.errorMessage);
        }
    } catch (error) {
        let registeredUsers = await Storage.getItem(StorageKey.LIST_USER);
        registeredUsers = registeredUsers || [];
        const user = registeredUsers.find(
            (user) =>
                user.email === params.email.trim().toLowerCase() &&
                user.password === params.password
        );

        if (user) {
            return Promise.resolve(user);
        } else {
            return Promise.reject({ errorMessage: 'Invalid email or password' });
        }
    }
};

export const registerRequest = async (params) => {
    const dummyResponse = {
        statusCode: 200,
        responseContent: {
            email: params?.email,
            firstName: params?.firstName,
            lastName: params?.lastName,
            password: params?.password,
            confirmPassword: params?.confirmPassword,
            userRole: params?.userRole,
            roleDetail: params?.roleDetail,
            photo: params?.photo,
            groups: [],
            notifications: []
        },
        message: 'Registration successful!',
    };
    try {
        const api = apiCaller();
        const response = await api.post(`/register`, {
            email: params?.email,
            firstName: params?.firstName,
            lastName: params?.lastName,
            password: params?.password,
            confirmPassword: params?.confirmPassword,
            userRole: params?.userRole,
            userRole: params?.userRole,
            roleDetail: params?.roleDetail,
            photo: params?.photo,
        });

        if (response.statusCode === 200 || dummyResponse.statusCode === 200) {
            return Promise.resolve(dummyResponse.responseContent);
        } else {
            return Promise.resolve(dummyResponse.responseContent);
        }
    } catch (error) {
        return Promise.resolve(dummyResponse.responseContent);
    }
};

export const fetchSaveGroupRequest = async (params) => {
    const existingGroups = await Storage.getItem(StorageKey.GROUPS) || [];
    const registeredUsers = await Storage.getItem(StorageKey.LIST_USER) || [];

    const newGroup = {
        groupId: `group-${Date.now()}`,
        groupName: params.groupName.trim(),
        description: params.groupDescription.trim(),
        starship: params.starshipData,
        members: params.members.map(member => ({
            email: member.email,
            userRole: member.userRole,
            photo: member.photo,
            isJoined: member.isMainMember ? true : false,
        }))
    };

    const updatedGroups = [...existingGroups, newGroup];
    await Storage.setItem(StorageKey.GROUPS, updatedGroups);

    const updatedUsers = registeredUsers.map(user => {
        const isMember = params.members.find(member => member.email === user.email);
        const isMainMember = isMember && isMember.isMainMember;

        if (isMember && !isMainMember) {
            const updatedGroupsForUser = user.groups ? [...user.groups, newGroup.groupId] : [newGroup.groupId];

            const newNotification = {
                type: 'group_invitation',
                message: `You have been invited to ${params.groupName.trim()}`,
                groupId: newGroup.groupId,
                isRead: false,
            };
            const updatedNotifications = user.notifications ? [...user.notifications, newNotification] : [newNotification];

            return {
                ...user,
                groups: updatedGroupsForUser,
                notifications: updatedNotifications,
            };
        }
        return user;
    });

    await Storage.setItem(StorageKey.LIST_USER, updatedUsers);

    // Simulate API response for group creation
    const dummyResponse = {
        statusCode: 200,
        responseContent: { group: newGroup, message: 'Group saved successfully' },
    };

    try {
        const api = apiCaller();
        const response = await api.post('/saveGroup', { groupData: newGroup });

        if (response.statusCode === 200 || dummyResponse.statusCode === 200) {
            return Promise.resolve(dummyResponse.responseContent);
        } else {
            return Promise.resolve(dummyResponse.responseContent);
        }
    } catch (error) {
        return Promise.resolve(dummyResponse.responseContent);
    }
};


export const fetchSwapiPeople = async ({ page = 1, search = '' }) => {
    try {
        const url = search
            ? `/people/?search=${search}`
            : `/people/?page=${page}`;

        const api = apiCaller(true);
        const response = await api.get(url);

        if (response.statusCode === 200) {
            return Promise.resolve(response.responseContent);
        } else {
            return Promise.reject(response.errorMessage || 'Failed to fetch SWAPI data');
        }
    } catch (error) {
        console.error('Error fetching SWAPI people:', error);
        return Promise.reject('An error occurred while fetching data');
    }
};

export const fetchSwapiStarship = async ({ page = 1, search = '' }) => {
    try {
        const url = search
            ? `/starships/?search=${search}`
            : `/starships/?page=${page}`;

        const api = apiCaller(true);
        const response = await api.get(url);

        if (response.statusCode === 200) {
            return Promise.resolve(response.responseContent);
        } else {
            return Promise.reject(response.errorMessage || 'Failed to fetch SWAPI data');
        }
    } catch (error) {
        console.error('Error fetching SWAPI people:', error);
        return Promise.reject('An error occurred while fetching data');
    }
};

export const fetchGroupDataRequest = async (params) => {
    const allGroups = await Storage.getItem(StorageKey.GROUPS);

    if (!allGroups) {
        return Promise.resolve({
            joinedGroups: [],
            unjoinedGroups: [],
        });
    }

    const joinedGroups = allGroups.filter(group =>
        group.members.some(member => member.email.toLowerCase() === params?.email.toLowerCase() && member.isJoined)
    );

    const unjoinedGroups = allGroups.filter(group =>
        group.members.some(member => member.email.toLowerCase() === params?.email.toLowerCase() && !member.isJoined)
    );

    const dummyResponse = {
        statusCode: 200,
        responseContent: {
            joinedGroups,
            unjoinedGroups,
            message: 'Group data fetched successfully!',
        },
    };

    try {
        const api = apiCaller();
        const response = await api.post(`/getGroup`, {
            email: params?.email,
        });

        if (response.statusCode === 200 || dummyResponse.statusCode === 200) {
            return Promise.resolve(dummyResponse.responseContent);
        } else {
            return Promise.resolve(dummyResponse.responseContent);
        }
    } catch (error) {
        return Promise.resolve(dummyResponse.responseContent);
    }
};


export const fetchGroupDetailDataRequest = async (params) => {
    const { members, groupName, description, starship, groupId } = params.groupData;
    const users = await Storage.getItem(StorageKey.LIST_USER);
    const updatedMembers = members.map((member) => {
        const userFromStorage = users.find((user) => user.email === member.email);
        if (userFromStorage) {
            return {
                ...member,
                lastLocation: { latitude: userFromStorage.latitude, longitude: userFromStorage.longitude },
            };
        }
        return member;
    });

    const dummyResponse = {
        statusCode: 200,
        responseContent: {
            groupId: groupId,
            groupName: groupName,
            description: description,
            starship: starship,
            members: updatedMembers,
        },
    };

    try {
        const api = apiCaller();
        const response = await api.post(`/getGroup`, {
            groupId: groupId,
            groupName: groupName,
            description: description,
            starship: starship,
            members: updatedMembers,
        });

        if (response.statusCode === 200 || dummyResponse.statusCode === 200) {
            return Promise.resolve(dummyResponse.responseContent);
        } else {
            return Promise.resolve(dummyResponse.responseContent);
        }
    } catch (error) {
        return Promise.resolve(dummyResponse.responseContent);
    }
};

export const fetchCurrentUserRequest = async (params) => {
    const currentUserData = await Storage.getItem(StorageKey.CURR_USER_LOGIN_DATA);
    const registeredUsers = await Storage.getItem(StorageKey.LIST_USER);

    if (!registeredUsers || !currentUserData) {
        return Promise.reject("No user data found");
    }

    const currentUser = registeredUsers.find(
        user =>
            user.email.trim().toLowerCase() === currentUserData.email.trim().toLowerCase() &&
            user.password === currentUserData.password
    );

    const dummyResponse = {
        statusCode: 200,
        responseContent: {
            ...currentUser,
            name: `${currentUser.firstName} ${currentUser.lastName}`,
            isMainMember: true,
        },
        message: 'User data fetched successfully!',
    };
    try {
        const api = apiCaller();
        const response = await api.post('/getCurrentUser', { email: email });

        if (response.statusCode === 200 || dummyResponse.statusCode === 200) {
            return Promise.resolve(dummyResponse.responseContent);
        } else {
            return Promise.resolve(dummyResponse.responseContent);
        }
    } catch (error) {
        return Promise.resolve(dummyResponse.responseContent);
    }
};

export const fetchInviteToGroupRequest = async (params) => {
    Keyboard.dismiss();

    const registeredUsers = await Storage.getItem(StorageKey.LIST_USER);

    if (!registeredUsers) {
        return Promise.reject({ errorMessage: "No users found in the system" });
    }

    let foundUser = registeredUsers.find(user => user.email.trim().toLowerCase() === params.invitedemail.trim().toLowerCase());

    const dummyResponse = {
        statusCode: 200,
        responseContent: foundUser
            ? {
                ...foundUser,
                name: `${foundUser.firstName} ${foundUser.lastName}`,
            }
            : null,
    };
    try {
        const api = apiCaller();
        const response = await api.post('/inviteToGroup', {
            email: params.invitedemail,
        });

        if (response.statusCode === 200 || dummyResponse.statusCode === 200) {
            return Promise.resolve(dummyResponse.responseContent);
        } else {
            return Promise.resolve(dummyResponse.responseContent);
        }
    } catch (error) {
        if (foundUser) {
            return Promise.resolve(dummyResponse.responseContent);
        }
        else {
            return Promise.reject({ errorMessage: "No users found in the system" });
        }
    }
};
