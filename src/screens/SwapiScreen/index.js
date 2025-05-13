import React, { useEffect, useState } from 'react';
import { Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import useCustomLoader from '../../react-query/hooks/useCustomLoader';
import { fetchSwapiPeople, fetchSwapiStarship } from '../../react-query/states/apiServices';
import colorScheme from '../../../assets/themes/colorScheme';
import { CREATE_GROUP_SCREEN, REGISTER_SCREEN } from '../../constants/RootKey';

const SwapiScreen = ({ navigation }) => {
  const route = useRoute();
  const { t } = useTranslation();
  const isDataTypePeople = route.params.dataType === 'people';
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [listSwapiData, setListSwapiData] = useState([]);
  const { data, loading, fetch } = useCustomLoader({
    fetchFunction: isDataTypePeople ? fetchSwapiPeople : fetchSwapiStarship,
    isFetchOnLoad: false,
  });

  useEffect(() => {
    fetch({ page, search: searchQuery, date: moment.now() });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  useEffect(() => {
    if (data && data.length > 0) {
      setListSwapiData((prevList) => [...prevList, ...data]);
    }
  }, [data]);

  const handleSearch = (val) => {
    setSearchQuery(val);
    setPage(1);
    setListSwapiData([]);
  };

  const handleLoadMore = () => {
    if (!loading && data?.next) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSelectSwapiPerson = (selectedSwapi) => {
    navigation.navigate({
      name: isDataTypePeople ? REGISTER_SCREEN : CREATE_GROUP_SCREEN,
      params: { selectedSwapi },
      merge: true,
    });
  };

  console.log("listSwapiData", listSwapiData)

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: colorScheme.$whiteCream }}>
      <TextInput
        style={{
          height: 40,
          borderColor: colorScheme.$gray,
          borderWidth: 1,
          marginBottom: 20,
          paddingLeft: 10,
          backgroundColor: colorScheme.$white,
          color: colorScheme.$darkBlackBg,
        }}
        placeholderTextColor={colorScheme.$gray}
        placeholder={t('swapi.searchPlaceholder')}
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        data={listSwapiData || []}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: colorScheme.$white,
              paddingHorizontal: 10,
              paddingVertical: 20,
              marginBottom: 8,
            }}
            key={item.name}
            onPress={() => handleSelectSwapiPerson(item)}
          >
            <Text style={{ color: colorScheme.$darkBlackBg }}>{item.name}</Text>
          </TouchableOpacity>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <Text style={{ color: colorScheme.$darkBlackBg }}>{t('swapi.loading')}</Text> : null}
      />
    </SafeAreaView>
  );
};

export default SwapiScreen;