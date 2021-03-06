import { useInfiniteQuery, useMutation, UseMutationResult, useQueryClient } from 'react-query';
import API from 'api/api';
import { Membership, PaginationResponse, RequestResponse } from 'types/Types';
import { MembershipType } from 'types/Enums';
import { GROUPS_QUERY_KEY } from 'api/hooks/Group';

export const MEMBERSHIP_QUERY_KEY = 'membership';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useMemberships = (groupSlug: string, filters?: any) => {
  return useInfiniteQuery<PaginationResponse<Membership>, RequestResponse>(
    [MEMBERSHIP_QUERY_KEY, groupSlug],
    ({ pageParam = 1 }) => API.getMemberships(groupSlug, { ...filters, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    },
  );
};

export const useCreateMembership = (): UseMutationResult<Membership, RequestResponse, { groupSlug: string; userId: string }, unknown> => {
  const queryClient = useQueryClient();
  return useMutation(({ groupSlug, userId }) => API.createMembership(groupSlug, userId), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([MEMBERSHIP_QUERY_KEY, data.group.slug]);
    },
  });
};

export const useDeleteMembership = (slug: string, userId: string): UseMutationResult<RequestResponse, RequestResponse, unknown, unknown> => {
  const queryClient = useQueryClient();

  return useMutation(() => API.deleteMembership(slug, userId), {
    onSuccess: () => {
      queryClient.invalidateQueries([MEMBERSHIP_QUERY_KEY, slug]);
    },
  });
};

export const useUpdateMembership = (slug: string, userId: string): UseMutationResult<Membership, RequestResponse, MembershipType, unknown> => {
  const queryClient = useQueryClient();
  return useMutation((membership_type) => API.updateMembership(slug, userId, { membership_type }), {
    onSuccess: () => {
      queryClient.invalidateQueries([GROUPS_QUERY_KEY, slug]);
      queryClient.invalidateQueries([MEMBERSHIP_QUERY_KEY, slug]);
    },
  });
};
