import Promise from 'bluebird';

export const sleep = ms => new Promise(resolve => setInterval(resolve, ms));
export default sleep;
