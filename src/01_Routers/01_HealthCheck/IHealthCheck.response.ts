/**
 * Category: All  
 * URL: https://rhea-so.com:60001/  
 * Method: GET  
 * Description: 현재 서버가 살아있는지 확인하기 위한 용도의 라우터입니다.  
 * Author: rhea-so  
 */
export interface IHealthCheckResponse {
	status: string;
	received: any;
}