import copy from './copy.js';
// Before the cut-off: "Shubh Deepavali." After it: "Shukriya." The date lives only in the data and is never printed.
export const signoffLines = () => {
  const cut = new Date(copy.site.signoffSwitchAfter + 'T23:59:59');
  return new Date() > cut ? copy.closure.signoff.after : copy.closure.signoff.before;
};
