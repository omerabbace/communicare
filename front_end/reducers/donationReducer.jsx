import { ADD_DONATION, RESET_DONATIONS } from '../actions/donationActions';

const initialState = {
  donations: [],
  totalAmount: 0
};

const donationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_DONATION:
      const { project, amount } = action.payload;

      const existingDonationIndex = state.donations.findIndex(donation => donation.project.id === project.id);

      let updatedDonations;
      let updatedTotalAmount;

      if (existingDonationIndex !== -1) {
        updatedDonations = state.donations.map((donation, index) =>
          index === existingDonationIndex
            ? { ...donation, amount }
            : donation
        );
        updatedTotalAmount = updatedDonations.reduce((sum, donation) => sum + donation.amount, 0);
      } else {
        updatedDonations = [...state.donations, action.payload];
        updatedTotalAmount = state.totalAmount + amount;
      }

      return {
        ...state,
        donations: updatedDonations,
        totalAmount: updatedTotalAmount
      };

    case RESET_DONATIONS:
      return initialState;

    default:
      return state;
  }
};

export default donationReducer;
