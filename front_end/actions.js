import { ADD_DONATION, RESET_DONATIONS } from './actionTypes';

export const addDonation = (project, amount) => ({
  type: ADD_DONATION,
  payload: { project, amount },
});

export const resetDonations = () => ({
  type: RESET_DONATIONS,
});
