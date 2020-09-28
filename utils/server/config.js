const production = false;
// const testUrl = 'http://125.35.101.176:9001';
// const testUrl = 'http://3435k69g44.zicp.vip:47355/';
const testUrl = 'http://3435k69g44.zicp.vip';
// const testUrl = 'http://192.168.1.4:8090/';

const prdUrl = '';

export const baseUrl = production ? prdUrl : testUrl;
