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

export type CreateVotePayload = {
  winner_id: string;
  loser_id: string;
};

export const competitionsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getVotePair: builder.query<VotePairType, void>({
      query: () => 'competitions/votepair',
      providesTags: ['VotePair'],
    }),
    getCurrentCompetition: builder.query<
      CompetitionResponse,
      CompetitionStatus
    >({
      query: status => `competitions/current?status=${status}`,
    }),
    createVote: builder.mutation<Message, CreateVotePayload>({
      query: body => ({
        url: 'competition/vote',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['VotePair'],
    }),
  }),
});

export const {
  useGetVotePairQuery,
  useGetCurrentCompetitionQuery,
  useCreateVoteMutation,
} = competitionsApi;
