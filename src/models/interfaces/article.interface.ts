export interface IArticleItem {
  authorName: string;
  createdAt: string;
  image: string;
  name: string;
  postContent: string;
  postId: number;
  publishDate: string;
  shortDescription: string;
  updatedAt: string;
  viewTraffic: number;
}

export interface IArticleQueryParams {
  currentPage: number;
  pageSize: number;
}

export interface IArticleResponse {
  items: IArticleItem[];
  pageInfo: {
    currentPage: number;
    endPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    pageSize: number;
    startPage: number;
  };
  totalCount: number;
}

export interface ICmsBlock {
  content: string;
  identifier: string;
  title: string;
}

export interface ICmsBlockGraphQLResponse {
  data: {
    cmsBlocks: {
      items: ICmsBlock[];
    };
  };
}

export interface IParsedArticleContent {
  banner: string;
  content: string;
  createdAt: string;
  description: string;
  language: string;
  title: string;
}

export interface IParsedCmsBlock extends ICmsBlock {
  parsedContent?: IParsedArticleContent;
}

export interface IParsedCmsBlockGraphQLResponse {
  data: {
    cmsBlocks: {
      items: IParsedCmsBlock[];
    };
  };
}
