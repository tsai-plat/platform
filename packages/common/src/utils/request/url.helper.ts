export function buildSDKApiUrl<T = string>(
  baseUrl: string,
  sdkPath: T,
  queryParams?: Record<string, any>,
) {
  const apiPath: string = sdkPath.toString().startsWith('/')
    ? sdkPath.toString().slice(1)
    : sdkPath.toString();

  let url = baseUrl.endsWith('/')
    ? `${baseUrl}${apiPath}`
    : `${baseUrl}/${apiPath}`;

  if (queryParams && Object.keys(queryParams).length) {
    const params = [];
    Object.keys(queryParams).forEach((k: string) => {
      params.push(
        `${k}=${queryParams[k]?.toString ? queryParams[k].toString() : queryParams[k]}`,
      );
    });
    const hasQuery = url.indexOf('?') > 0;

    url = hasQuery
      ? `${url}&${params.join('&')}`
      : `${url}?${params.join('&')}`;
  }
  return url;
}
