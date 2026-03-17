import React from 'react';

import { MEDIA_BASE_URL } from '@/constants/shared.const';
import { DEFAULT_THEME } from '@/constants/theme-colors.const';
import { useHtmlRender } from '@/hooks/shared/use-html-render';
import { replaceMagentoMediaUrls } from '@/utils/magento.util';

import BackButton from '../news/BackButton';

interface DetailNewArticleProps {
  article: {
    content: string;
    description: string;
    id: string;
    image: string;
    timeAgo: string;
    title: string;
  };
}

export const DetailNewArticle: React.FC<DetailNewArticleProps> = ({
  article,
}) => {
  const htmlWithFixedUrls = replaceMagentoMediaUrls(
    article.content,
    MEDIA_BASE_URL,
  );
  const content = useHtmlRender(htmlWithFixedUrls);

  return (
    <div className="flex flex-col items-center self-stretch gap-6 bg-white rounded-2xl">
      <div className="flex items-center self-stretch gap-4">
        <BackButton />
        <h1 className=" font-semibold text-[28px] leading-[1.3] text-black flex-1">
          {'Tin tức mới'}
        </h1>
      </div>
      <div className="flex flex-col items-center self-stretch gap-4">
        <div className="flex flex-col self-stretch gap-6">
          <div className="flex flex-col self-stretch gap-2">
            <h2
              className={`font-semibold text-[44px] leading-[1.3] text-[${DEFAULT_THEME.NEUTRAL_950}] self-stretch`}
            >
              {article.title}
            </h2>
          </div>
          <div className="flex self-stretch gap-6">
            <span className=" font-medium text-[12px] leading-[1.3] text-[#7C7C7C]">
              {'Admin'}
            </span>
            <span className=" font-medium text-[12px] leading-[1.3] text-[#7C7C7C]">
              {article.timeAgo}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center self-stretch gap-10 sm:px-[185px]">
        <div className="font-medium text-[16px] leading-[1.3] text-[#464646] self-stretch prose prose-lg max-w-none">
          {content}
        </div>
      </div>
    </div>
  );
};
