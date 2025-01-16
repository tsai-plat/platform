export enum WechatSDKApiPath {
  //接口获取到openid
  getAccessToken = '/sns/oauth2/access_token',
  refreshAccessToken = 'sns/oauth2/refresh_token',
  getUserInfo = '/sns/userinfo',
  getSvrAccessToken = '/cgi-bin/token',
  getJSApiTicket = '/cgi-bin/ticket/getticket',
}
