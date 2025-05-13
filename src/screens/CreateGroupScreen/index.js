import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useIsFocused, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { ToastContext } from '../../components/CustomToast/ToastProvider';
import { SWAPI_SCREEN } from '../../constants/RootKey';
import useCustomLoader from '../../react-query/hooks/useCustomLoader';
import { fetchCurrentUserRequest, fetchInviteToGroupRequest, fetchSaveGroupRequest } from '../../react-query/states/apiServices';
import colorScheme from '../../../assets/themes/colorScheme';
import styles from './styles';

const CreateGroupScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const route = useRoute();
  const toast = useContext(ToastContext);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [starshipData, setStarshipData] = useState('');
  const [members, setMembers] = useState([]);
  const [isShowModalInvite, setIsShowModalInvite] = useState(false);
  const [invitedemail, setInvitedEmail] = useState('');

  const { data: currUserData, fetch: fetchCurrentUser } = useCustomLoader({
    fetchFunction: fetchCurrentUserRequest,
    isFetchOnLoad: false,
  });

  const { data: inviteData, error: inviteDataError, errorMessage: inviteDataErrorMessage, fetch: fetchInvite } = useCustomLoader({
    fetchFunction: fetchInviteToGroupRequest,
    isFetchOnLoad: false,
  });

  const { data: saveGroupData, fetch: fetchSaveGroupData } = useCustomLoader({
    fetchFunction: fetchSaveGroupRequest,
    isFetchOnLoad: false,
  });

  useEffect(() => {
    if (isFocused && !route.params?.selectedSwapi) {
      fetchCurrentUser({ date: moment.now() });
    }
  }, [isFocused]);

  useEffect(() => {
    if (currUserData) {
      setMembers([currUserData]);
    }
  }, [currUserData]);

  useEffect(() => {
    if (inviteData) {
      setMembers([...members, inviteData]);
      setIsShowModalInvite(false);
      setInvitedEmail('');
    }
    if (inviteDataError) {
      toast.current.ShowToastFunction('error', inviteDataErrorMessage);
    }
  }, [inviteData, inviteDataError]);

  useEffect(() => {
    if (saveGroupData) {
      toast.current.ShowToastFunction('success', t('createGroup.savedSuccess'));
      navigation.goBack();
    }
  }, [saveGroupData]);

  useEffect(() => {
    if (route.params?.selectedSwapi) {
      const selectedSwapi = route.params.selectedSwapi;
      setStarshipData(selectedSwapi);
    }
  }, [route.params?.selectedSwapi]);

  const handleInvite = () => {
    let checkMembers = members.find(user => user.email.trim().toLowerCase() === invitedemail.trim().toLowerCase());
    if (checkMembers) {
      Keyboard.dismiss()
      return toast.current.ShowToastFunction('error', t('createGroup.alreadyInvited'));
    }
    fetchInvite({ invitedemail: invitedemail, date: moment.now() });
  };

  const handleSaveGroup = () => {
    if (!groupName.trim()) {
      toast.current.ShowToastFunction('error', t('createGroup.nameRequired'));
      return;
    }
    if (!starshipData.name) {
      toast.current.ShowToastFunction('error', t('createGroup.selectStarship'));
      return;
    }
    fetchSaveGroupData({ groupName, groupDescription, starshipData, members, date: moment.now() });
  };

  const handleRemoveMember = (name) => {
    setMembers(members.filter(member => member.name !== name));
  };

  const generateInitials = () => {
    if (!groupName || groupName.trim() === '') return 'GM';
    const words = groupName.trim().split(' ').filter(word => word);
    return words.map(word => word.charAt(0).toUpperCase()).join('').slice(0, 4);
  };

  const renderMemberItem = ({ item }) => (
    <View style={styles.memberItem}>
      <Image source={{ uri: `data:image/jpeg;base64,${item.photo}` }} style={styles.memberPhoto} />
      <Text style={styles.memberName}>{item.name}</Text>
      {!item.isMainMember &&
        <TouchableOpacity onPress={() => handleRemoveMember(item.name)}>
          <Ionicons name="trash-outline" size={20} color={colorScheme.$gray} />
        </TouchableOpacity>
      }
    </View>
  );

  const ListHeader = useMemo(() => (
    <View>
      <View style={styles.groupSection}>
        <TouchableOpacity style={styles.groupImageContainer}>
          <View style={styles.groupImage}>
            <Text style={styles.groupInitials}>{generateInitials()}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.groupLabel}>{t('createGroup.groupName')}</Text>
      </View>

      <View style={styles.inputSection}>
        <View style={[styles.inputRow]}>
          <Text style={styles.label}>{t('createGroup.groupName')}</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor={colorScheme.$gray}
            placeholder={t('createGroup.enterGroupName')}
            value={groupName}
            onChangeText={setGroupName}
          />
          <Ionicons name="chevron-forward" size={20} color={colorScheme.$gray} />
        </View>
        <TouchableOpacity
          onPress={() => navigation.push(SWAPI_SCREEN, { dataType: 'starship' })}
          style={[styles.inputRow, { paddingVertical: 20 }]}>
          <Text style={[styles.label, { flex: 1 }]}>{t('createGroup.starship')}</Text>
          <Text style={{ color: starshipData.name ? 'black' : colorScheme.$gray, textAlign: 'right', fontSize: 16 }}>
            {starshipData.name || t('createGroup.selectStarshipPlaceholder')}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colorScheme.$gray} />
        </TouchableOpacity>
        <View style={[styles.inputRow, { paddingVertical: 20 }]}>
          <Text style={styles.label}>{t('createGroup.description')}</Text>
          <Ionicons name="chevron-forward" size={20} color={colorScheme.$gray} />
        </View>
        <TextInput
          style={styles.inputDesc}
          placeholder={t('createGroup.enterDescription')}
          placeholderTextColor={colorScheme.$gray}
          value={groupDescription}
          onChangeText={setGroupDescription}
          multiline
        />
      </View>

      <TouchableOpacity style={styles.inviteMemberRow} onPress={() => setIsShowModalInvite(true)}>
        <Text style={styles.inviteText}>{t('createGroup.inviteMember')}</Text>
        <Ionicons name="chevron-forward" size={20} color={colorScheme.$gray} />
      </TouchableOpacity>
    </View>
  ), [groupName, groupDescription, starshipData]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colorScheme.$darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('createGroup.createGroup')}</Text>
        <TouchableOpacity onPress={handleSaveGroup}>
          <Text style={styles.saveText}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        contentContainerStyle={{ paddingBottom: 20 }}
        data={members}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.email}
        ListHeaderComponent={ListHeader}
      />

      <Modal
        visible={isShowModalInvite}
        animationType="slide"
        transparent
        onRequestClose={() => setIsShowModalInvite(false)}>
        <TouchableWithoutFeedback onPress={() => setIsShowModalInvite(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('createGroup.enterInviteEmail')}</Text>

              <TextInput
                style={styles.emailInput}
                placeholder={t('createGroup.emailPlaceholder')}
                placeholderTextColor="#ccc"
                value={invitedemail}
                onChangeText={setInvitedEmail}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.inviteButton} onPress={handleInvite}>
                  <Text style={styles.inviteButtonText}>{t('createGroup.invite')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default CreateGroupScreen;