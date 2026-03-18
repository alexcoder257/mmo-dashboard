import { createNavigation } from 'next-intl/navigation';
import { useTopLoader } from 'nextjs-toploader';
import React from 'react';

import { routing } from './routing';

const {
  getPathname,
  Link: OriginalLink,
  redirect,
  usePathname,
  useRouter: originalUseRouter,
} = createNavigation(routing);

const useRouter = () => {
  const router = originalUseRouter();
  const { start } = useTopLoader();

  const enhancedRouter = {
    ...router,
    push: (
      href: Parameters<typeof router.push>[0],
      options?: Parameters<typeof router.push>[1],
    ) => {
      start();
      return router.push(href, options);
    },
    replace: (
      href: Parameters<typeof router.replace>[0],
      options?: Parameters<typeof router.replace>[1],
    ) => {
      start();
      return router.replace(href, options);
    },
  };

  return enhancedRouter;
};

const Link = (props: React.ComponentProps<typeof OriginalLink>) => {
  const { start } = useTopLoader();

  const enhancedProps = {
    ...props,
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
      start();
      if (props.onClick) props.onClick(e);
    },
  };

  return React.createElement(OriginalLink, enhancedProps);
};

export { getPathname, Link, redirect, usePathname, useRouter };
