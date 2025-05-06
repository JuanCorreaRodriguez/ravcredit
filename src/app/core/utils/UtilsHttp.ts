export class UtilsHttp {

  public static CreateHeadersApi(token: string) {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Authorization': `Bearer ${token}`
    }
  }
}
