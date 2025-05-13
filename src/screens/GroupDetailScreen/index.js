import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
// import MapView, { Marker } from 'react-native-maps';
import colorScheme from '../../../assets/themes/colorScheme';
import styles from './styles';
import useCustomLoader from '../../react-query/hooks/useCustomLoader';
import { fetchGroupDetailDataRequest } from '../../react-query/states/apiServices';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import Storage from '../../utils/Storages';
import { StorageKey } from '../../utils/GlobalConfig';
import { ToastContext } from '../../components/CustomToast/ToastProvider';

const GroupDetailScreen = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const toast = useContext(ToastContext);
  const { groupData: groupDataRoute, activeTab } = route.params;
  const { t } = useTranslation();
  const [selectedMember, setSelectedMember] = useState(null);

  const { data: dataGroupDetail, fetch: fetchGroupDetailData } = useCustomLoader({
    fetchFunction: fetchGroupDetailDataRequest,
    isFetchOnLoad: false,
  });

  const groupData = useMemo(() => dataGroupDetail ?? [], [dataGroupDetail]);

  const starshipDetails = useMemo(() => [
    { label: t('groupDetail.name'), value: dataGroupDetail?.starship?.name },
    { label: t('groupDetail.model'), value: dataGroupDetail?.starship?.model },
    { label: t('groupDetail.manufacturer'), value: dataGroupDetail?.starship?.manufacturer },
    { label: t('groupDetail.cost'), value: dataGroupDetail?.starship?.cost_in_credits },
    { label: t('groupDetail.length'), value: dataGroupDetail?.starship?.length },
    { label: t('groupDetail.maxSpeed'), value: dataGroupDetail?.starship?.max_atmosphering_speed },
    { label: t('groupDetail.crew'), value: dataGroupDetail?.starship?.crew },
    { label: t('groupDetail.passengers'), value: dataGroupDetail?.starship?.passengers },
    { label: t('groupDetail.cargoCapacity'), value: dataGroupDetail?.starship?.cargo_capacity },
  ], [dataGroupDetail]);

  useEffect(() => {
    if (isFocused) fetchGroupDetailData({ groupData: groupDataRoute, date: moment.now() });
  }, [isFocused]);

  const handleJoinGroup = async () => {
    const currUserLogIn = await Storage.getItem(StorageKey.CURR_USER_LOGIN_DATA);
    const updatedGroupData = {
      ...groupData,
      members: groupData.members.map(member =>
        member.email === currUserLogIn.email ? { ...member, isJoined: true } : member
      ),
    };

    const allGroups = await Storage.getItem(StorageKey.GROUPS) || [];

    const updatedGroups = allGroups.map(group =>
      group.groupId === updatedGroupData.groupId ? updatedGroupData : group
    );

    await Storage.setItem(StorageKey.GROUPS, updatedGroups);
    toast.current.ShowToastFunction('success', t('groupDetail.joinSuccess'));
    navigation.goBack();
  };

  const handleSelectMember = (member) => {
    setSelectedMember(member);
  };

  const renderMemberItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectMember(item)}>
      <View style={[styles.memberItem, !item.isJoined && { opacity: 0.8 }]}>
        <Image source={{ uri: `data:image/jpeg;base64,${item.photo}` }} style={styles.memberPhoto} />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.email}</Text>
          <Text style={styles.memberRole}>{item.userRole}</Text>
          {item.lastLocation.latitude ? (
            <Text style={styles.memberLocation}>
              {t('groupDetail.lastLocation')}: {item.lastLocation.latitude}, {item.lastLocation.longitude}
            </Text>
          ) : (
            <Text style={styles.memberLocation}>{t('groupDetail.noLocation')}</Text>
          )}
          {!item.isJoined && (
            <Text style={styles.statusMember}>{t('groupDetail.unjoined')}</Text>
          )}
        </View>

        {selectedMember && selectedMember.email === item.email && (
          <Ionicons name="location" size={24} color={colorScheme.$blueColor} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.groupDetailSection}>
        <Text style={styles.groupTitle}>{groupData?.groupName}</Text>
        <Text style={styles.groupDescription}>{groupData?.description}</Text>
        <Text style={styles.labelStarship}>{t('groupDetail.starshipDetails')}:</Text>
        {starshipDetails.map((detail, index) => (
          <View key={index} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{detail.label}:</Text>
            <Text style={styles.detailValue}>{detail.value || 'N/A'}</Text>
          </View>
        ))}
      </View>

      {/* Paid Account API Key needed */}
      {/* {selectedMember && selectedMember.lastLocation && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: selectedMember.lastLocation.latitude || 0,
            longitude: selectedMember.lastLocation.longitude || 0,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{
              latitude: selectedMember.lastLocation.latitude || 0,
              longitude: selectedMember.lastLocation.longitude || 0,
            }}
            title={selectedMember.name}
            description={`Last known location of ${selectedMember.name}`}
          />
        </MapView>
      )} */}

      {activeTab === t('groupDetail.unjoinedTab') && (
        <TouchableOpacity
          style={styles.joinButton}
          onPress={handleJoinGroup}>
          <Text style={styles.joinButtonText}>{t('groupDetail.joinGroup')}</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={groupData.members}
        keyExtractor={(item) => item.email}
        renderItem={renderMemberItem}
        contentContainerStyle={styles.memberList}
      />
    </SafeAreaView>
  );
};

export default GroupDetailScreen;