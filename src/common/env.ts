const STAGE = process.env.SLS_STAGE || 'local';
const IS_LOCAL = STAGE === 'local';
const IS_PROD = STAGE === 'prod';

export { IS_LOCAL, IS_PROD };
export default STAGE;
