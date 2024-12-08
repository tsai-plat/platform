export type APIResponse<T = any> = {
  code: number;
  message: string;
  result?: T;
  error?: string | string[] | object | undefined;
  [o: string]: any;
};

export type QueryPageBase = {
  readonly page?: number;
  readonly pageSize?: number;
};

export type QueryPageParams = QueryPageBase & {
  keywords?: string;
  [k: string]: any;
};

export type PaginationDataType<T = any> = {
  page: number;
  pageSize: number;
  total: number;
  list: T[];
};

/**
 * UI selections
 */
export type SelectorOptionsType<T=string|number>= {
  label: string;
  value: T;
  disabled?: boolean;
  actived?: boolean;
  icon?: string;
  extra?: {
    id:number;
    orgno?:string;
    [k:string]:any
  };
}
