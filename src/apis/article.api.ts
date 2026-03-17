import stringTemplate from 'string-template';

import { GRAPHQL_ENDPOINT, NEWS_API } from '@/constants/route-apis.const';
import { get, post } from '@/libs/fetch/utils';
import {
  IArticleItem,
  IArticleResponse,
} from '@/models/interfaces/article.interface';

export const fetchArticlesApi = async (
  pageSize: number = 5,
  currentPage: number = 1,
): Promise<IArticleResponse> => {
  const query = `query {
	mpBlogPosts(action: "get_post_list", pageSize: ${pageSize}, currentPage: ${currentPage}) {
		total_count
		pageInfo {
		  currentPage
		  endPage
		  hasNextPage
		  hasPreviousPage
		  pageSize
		  startPage
		}
		items {
		  allow_comment
		  author_id
		  author_name
		  author_url
		  author_url_key
		  created_at
		  enabled
		  image
		  import_source
		  in_rss
		  layout
		  meta_description
		  meta_keywords
		  meta_robots
		  meta_title
		  name
		  post_content
		  post_id
		  publish_date
		  short_description
		  store_ids
		  updated_at
		  url_key
		  view_traffic
		} 
	}
}`;

  try {
    const response = await post<{
      data: {
        mpBlogPosts: IArticleResponse;
      };
    }>(
      GRAPHQL_ENDPOINT,
      { query },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    const mpBlogPosts = response.data.data.mpBlogPosts;
    return {
      items: mpBlogPosts.items,
      pageInfo: mpBlogPosts.pageInfo,
      totalCount: mpBlogPosts.totalCount,
    };
  } catch (_error) {
    return {
      items: [],
      pageInfo: {
        currentPage: 1,
        endPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        pageSize: 5,
        startPage: 1,
      },
      totalCount: 0,
    };
  }
};

export const fetchArticleDetailApi = async (postId: number) => {
  const url = stringTemplate(NEWS_API.DETAIL, { postId });
  const response = await get<IArticleItem>(url);
  return response;
};
