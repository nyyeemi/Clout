import {apiSlice} from '../apiSlice';

import {Message} from '../../../types/types';

export type PostMinimal = {
  id: string;
  post: {image_url: string};
};

type VotePairType = {
  entry_1: PostMinimal;
  entry_2: PostMinimal;
};

type CompetitionStatus = 'pending' | 'capturing' | 'voting' | 'finished';

export type CompetitionResponse = {
  category: string;
  description: string;
  created_at: string;
  start_time: string;
  vote_start_time: string;
  end_time: string;
  competition_number: number;
  status: string;
};

export type CompetitionStatsResponse = {
  competition: CompetitionResponse;
  user_votes_count: number;
  all_votes_count: number;
  competitors_count: number;
};

export type CreateVotePayload = {
  winner_id: string;
  loser_id: string;
};

type CompetitionBase = {
  category: string;
  description: string;
  start_time: string;
  end_time: string;
  competition_number: number;
};

export type CompetitionType = CompetitionBase & {
  vote_start_time: string;
  status: CompetitionStatus;
  id: string;
};

type CompetitionsType = {
  data: CompetitionType[];
  count: number;
};

export type LeaderboardEntryType = {
  username: string;
  image_url: string;
};

export type LeaderboardType = {
  competition: CompetitionBase;
  leaderboard: LeaderboardEntryType[];
  participant_count: number;
  current_user_rank: number | null;
};

export const competitionsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getVotePair: builder.query<VotePairType, void>({
      query: () => 'competitions/votepair',
      providesTags: ['VotePair'],
    }),
    getCurrentCompetition: builder.query<
      CompetitionStatsResponse,
      CompetitionStatus
    >({
      query: status => `competitions/current?status=${status}`,
      providesTags: ['Stats'],
    }),
    createVote: builder.mutation<Message, CreateVotePayload>({
      query: body => ({
        url: 'competitions/vote',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['VotePair', 'Stats'],
    }),
    getFinishedCompetitions: builder.query<CompetitionsType, void>({
      query: () => `competitions/`,
      providesTags: ['Competitions'],
    }),
    getLeaderboard: builder.query<LeaderboardType, string>({
      query: competition_id => `competitions/${competition_id}/leaderboard`,
      providesTags: ['Leaderboard'],
    }),
  }),
});

export const {
  useGetVotePairQuery,
  useGetCurrentCompetitionQuery,
  useCreateVoteMutation,
  useGetLeaderboardQuery,
  useGetFinishedCompetitionsQuery,
} = competitionsApi;
