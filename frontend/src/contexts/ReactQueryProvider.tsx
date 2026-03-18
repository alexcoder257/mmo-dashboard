'use client';
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

interface IProps {
  children: React.ReactNode;
}

let browserQueryClient: QueryClient | undefined = undefined;

export const ReactQueryProvider: React.FC<IProps> = ({ children }) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const getQueryClient = () => {
  if (isServer) return makeQueryClient();

  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
};

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
};
