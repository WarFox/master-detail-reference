import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { mockItems, type WorkItem } from '../mockData';

const fetchWorkItemsAsync = async (): Promise<WorkItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800)); // 800ms API lag simulation
  return mockItems;
};

export const workItemsQueryOptions = queryOptions({
  queryKey: ['workItems'],
  queryFn: fetchWorkItemsAsync,
});

export function useWorkItems() {
  return useSuspenseQuery(workItemsQueryOptions);
}
