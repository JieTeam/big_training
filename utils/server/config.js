const production = true;
// const testUrl = 'http://10.134.62.106:8080';
// const testUrl = 'http://3435k69g44.zicp.vip';
// const testUrl = 'http://10.134.53.153:8080';

const testUrl = 'http://3435k69g44.zicp.vip:47355';
// const prdUrl = 'http://125.35.101.176:8090';
const prdUrl = 'https://dlb.591hb.net';


export const baseUrl = production ? prdUrl : testUrl;
// export const filePath = 'http://blog.8bjl.cn/upload/book/knowledge/'
export const filePath = `${baseUrl}/knowledge/`



