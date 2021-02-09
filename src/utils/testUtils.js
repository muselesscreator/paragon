/* eslint-disable import/prefer-default-export */

// Helper function returns a promise that resolves after all other promise mocks,
// even if they are chained like Promise.resolve().then(...)
export const tick = () => new Promise(resolve => {
  setTimeout(resolve, 0);
});
