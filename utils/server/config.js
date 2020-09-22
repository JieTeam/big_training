const production = false;
const testUrl = 'http://125.35.101.176:9001';
const prdUrl = '';

export const baseUrl = production ? prdUrl : testUrl;
