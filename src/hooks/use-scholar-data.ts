import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MOCK_PAPERS, MOCK_USERS, MOCK_REVIEWS, CURRENT_USER, Paper, Review } from "@/lib/mockData";

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      await delay(300);
      return CURRENT_USER;
    }
  });
}

export function usePapers(filter?: Partial<Paper>) {
  return useQuery({
    queryKey: ['papers', filter],
    queryFn: async () => {
      await delay(500);
      let results = [...MOCK_PAPERS];
      if (filter?.status) {
        results = results.filter(p => p.status === filter.status);
      }
      if (filter?.domain) {
        results = results.filter(p => p.domain === filter.domain);
      }
      return results;
    }
  });
}

export function usePaper(id: string) {
  return useQuery({
    queryKey: ['paper', id],
    queryFn: async () => {
      await delay(400);
      const paper = MOCK_PAPERS.find(p => p.id === id);
      if (!paper) throw new Error("Paper not found");
      return paper;
    }
  });
}

export function useReviews(paperId?: string) {
  return useQuery({
    queryKey: ['reviews', paperId],
    queryFn: async () => {
      await delay(400);
      if (paperId) return MOCK_REVIEWS.filter(r => r.paperId === paperId);
      return MOCK_REVIEWS;
    }
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: Partial<Review>) => {
      await delay(1200);
      // Mock successful submission
      return { ...review, id: Math.random().toString(), date: new Date().toISOString() };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.paperId] });
      queryClient.invalidateQueries({ queryKey: ['current-user'] }); // To trigger XP update
    }
  });
}

export function useSubmitPaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (paper: Partial<Paper>) => {
      await delay(2000);
      return { ...paper, id: Math.random().toString(), status: 'Submitted', submittedAt: new Date().toISOString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papers'] });
    }
  });
}
