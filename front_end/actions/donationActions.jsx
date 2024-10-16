export const ADD_DONATION = 'ADD_DONATION';
export const RESET_DONATIONS = 'RESET_DONATIONS';

export const addDonation = (project, amount) => ({
  type: ADD_DONATION,
  payload: { project, amount }
});

export const resetDonations = () => ({
  type: RESET_DONATIONS
});
