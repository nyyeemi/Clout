import {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {faClock} from '@fortawesome/free-regular-svg-icons';
import {
  faFire,
  faRankingStar,
  faScaleUnbalanced,
} from '@fortawesome/free-solid-svg-icons';

import {useGetCurrentCompetitionQuery} from '../../redux/api/endpoints/competitions';
import {InfoBox} from './InfoBox';

export const CompetitionInfoScreen = () => {
  const {data: competitionData} = useGetCurrentCompetitionQuery('voting');

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date();
    const midnightUTC = new Date(now);
    midnightUTC.setUTCHours(24, 0, 0, 0);

    const diff = midnightUTC.getTime() - now.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* <View style={[styles.upperBox]}>
          <Title1Text variant="heavy">
            {competitionData?.competition.category}
          </Title1Text>
        </View> */}

        <View style={styles.statsContainer}>
          <View style={styles.mainInfo}>
            <InfoBox
              title={'Competition description'}
              mainInfo={competitionData?.competition.description}
              footerText={'Sponsored by Clout'}
              aspectRatio={3 / 2}
              size="body"
              category={competitionData?.competition.category}
            />
          </View>
          <View style={styles.statsRow}>
            <InfoBox
              title={'Your votes'}
              icon={faScaleUnbalanced}
              mainInfo={'50'}
              footerText={`All votes: ${competitionData?.all_votes_count}`}
              aspectRatio={1}
              hasIcon
            />
            <InfoBox
              title={'Day streak'}
              icon={faFire}
              mainInfo={'50'}
              footerText={'You have 145 days streak of voting'}
              aspectRatio={1}
              hasIcon
            />
          </View>
          <View style={styles.statsRow}>
            <InfoBox
              title={'Time left'}
              icon={faClock}
              mainInfo={timeLeft}
              footerText={'Time left for this competition'}
              aspectRatio={1}
              hasIcon
            />
            <InfoBox
              title={'Current position'}
              icon={faRankingStar}
              mainInfo={9}
              footerText={'Your current position in this competition'}
              aspectRatio={1}
              hasIcon
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {gap: 15, flex: 1, marginHorizontal: 5, marginVertical: 10},
  upperBox: {
    borderRadius: 5,
    justifyContent: 'center',
  },
  statsContainer: {flex: 1, gap: 15},
  mainInfo: {flex: 1},
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
});
