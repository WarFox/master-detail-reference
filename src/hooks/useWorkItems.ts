import { useQuery } from '@tanstack/react-query';
import { mockItems, type WorkItem } from '../mockData';

const fetchWorkItemsAsync = async (): Promise<WorkItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800)); // 800ms API lag simulation
  return mockItems;
};

export function useWorkItems() {
  return useQuery({
    queryKey: ['workItems'],
    queryFn: fetchWorkItemsAsync,
  });
}
