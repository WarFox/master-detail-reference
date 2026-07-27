import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { mockCustomers, type Customer } from '../mockCustomers';

const fetchCustomersAsync = async (): Promise<Customer[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800)); // 800ms API lag simulation
  return mockCustomers;
};

export const customersQueryOptions = queryOptions({
  queryKey: ['customers'],
  queryFn: fetchCustomersAsync,
});

export function useCustomers() {
  return useSuspenseQuery(customersQueryOptions);
}
