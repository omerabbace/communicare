// store/donationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const donationSlice = createSlice({
  name: 'donation',
  initialState: {
    donations: [],
    totalAmount: 0,
  },
  reducers: {
    addDonation: (state, action) => {
      const { project, amount } = action.payload;
      // Find if project already exists
      const existingDonation = state.donations.find(d => d.project.id === project.id);
      if (existingDonation) {
        existingDonation.amount += amount;
      } else {
        state.donations.push({ project, amount });
      }
      state.totalAmount += amount;
    },
    resetDonations: (state) => {
      state.donations = [];
      state.totalAmount = 0;
    },
  },
});

export const { addDonation, resetDonations } = donationSlice.actions;
export default donationSlice.reducer;
