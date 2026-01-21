import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {skipToken} from '@reduxjs/toolkit/query';
import {FlashList} from '@shopify/flash-list';

import globalStyle from '../../assets/styles/globalStyle';
import {Spinner} from '../../components/Spinner/Spinner';
import {ThemedSafeAreaView} from '../../components/ui/themed-view';
import {
  BodyText,
  FootnoteText,
  HeadlineText,
  LargeTitleText,
  Title3Text,
} from '../../components/ui/typography';
import {useTheme} from '../../hooks/useTheme';
import {LeaderboardStackParamList, Routes} from '../../navigation/Routes';
import {
  CompetitionType,
  LeaderboardEntryType,
  useGetFinishedCompetitionsQuery,
  useGetLeaderboardQuery,
} from '../../redux/api/endpoints/competitions';
import {CompetitionBar} from './CompetitionBar';
import {LeaderboardItem} from './LeaderboardItem';
import {LeaderboardModal} from './LeaderboardModal';
import {PodiumView} from './PodiumView';

const LEADERBOARD_OFFSET = 4; // on which index lb starts

export const LeaderboardScreen = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(
    null,
  );

  const navigation =
    useNavigation<StackNavigationProp<LeaderboardStackParamList>>();

  const {
    data: finishedCompetitions,
    isLoading: isLoadingComps,
    isError: isErrorComps,
    refetch: refetchCompetitions,
  } = useGetFinishedCompetitionsQuery();

  const activeCompetitionId =
    selectedCompetition ?? finishedCompetitions?.data?.[0]?.id;

  const {
    data: leaderboard,
    isLoading: isLoadingLeaderboard,
    isError: isErrorLeaderboard,
    error: leaderboardError,
    refetch: refetchLeaderboard,
  } = useGetLeaderboardQuery(activeCompetitionId ?? skipToken);

  if (isLoadingComps || (activeCompetitionId && isLoadingLeaderboard)) {
    return <Spinner />;
  }

  if (isErrorComps || isErrorLeaderboard) {
    return (
      <View>
        <Title3Text>Error loading data. Please try again.</Title3Text>
      </View>
    );
  }

  if (!finishedCompetitions?.data || finishedCompetitions.data.length === 0) {
    return (
      <View>
        <Title3Text>No competitions found.</Title3Text>
      </View>
    );
  }

  if (!leaderboard) {
    return (
      <View>
        <Title3Text>Leaderboard currently unavailable.</Title3Text>
      </View>
    );
  }

  const leaderboardData =
    leaderboard.leaderboard.slice(LEADERBOARD_OFFSET - 1) ?? [];

  const renderItem = ({
    item,
    index,
  }: {
    item: LeaderboardEntryType;
    index: number;
  }) => {
    return (
      <LeaderboardItem
        data={item}
        index={index + LEADERBOARD_OFFSET}
        onImagePress={url => setSelectedImage(url)}
        handleNavigate={handleNavigate}
      />
    );
  };

  const podiumData = leaderboard?.leaderboard.slice(0, 3) ?? [];

  const handleNavigate = (username: string) => {
    navigation.navigate(Routes.ProfileStack, {
      screen: Routes.Profile,
      params: {username: username},
    });
  };

  const refresh = () => {
    refetchCompetitions();
    refetchLeaderboard();
  };

  return (
    <ThemedSafeAreaView style={{flex: 1}}>
      <LargeTitleText style={{padding: 8}} variant="heavy">
        Leaderboard
      </LargeTitleText>
      <CompetitionBar
        selectedId={activeCompetitionId ?? ''}
        competitions={finishedCompetitions.data}
        onPress={id => setSelectedCompetition(id)}
      />
      {leaderboardData.length !== 0 ? (
        <>
          <FlashList
            data={leaderboardData}
            ListHeaderComponent={
              <PodiumView
                podiumData={podiumData}
                handleNavigate={handleNavigate}
                onImagePress={url => setSelectedImage(url)}
              />
            }
            refreshing={isLoadingComps || isLoadingLeaderboard}
            onRefresh={refresh}
            renderItem={renderItem}
          />

          <LeaderboardModal
            onRequestClose={() => setSelectedImage(null)}
            selectedImage={selectedImage}
          />
        </>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <HeadlineText>
            No leaderboard available. Try again later.
          </HeadlineText>
        </View>
      )}
    </ThemedSafeAreaView>
  );
};
