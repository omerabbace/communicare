import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import "../styles/donations.css";

const Donations = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    // Fetch dummy data
    const fetchDonations = async () => {
      const data = [
        { id: 1, date: "2024-12-01", amount: "$100", donor: "John Doe" },
        { id: 2, date: "2024-12-02", amount: "$250", donor: "Jane Smith" },
        { id: 3, date: "2024-12-03", amount: "$500", donor: "Mark Lee" },
        { id: 4, date: "2024-12-04", amount: "$150", donor: "Emily Davis" },
      ];
      setDonations(data);
    };

    fetchDonations();
  }, []);

  return (
    <div className="donations-container">
      <header className="donations-header">
        <h1>Donations List</h1>
        <p>Manage and review all donations</p>
      </header>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Donor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell>{donation.date}</TableCell>
                <TableCell>{donation.amount}</TableCell>
                <TableCell>{donation.donor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Donations;
