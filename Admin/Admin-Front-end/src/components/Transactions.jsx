import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import "../styles/transactions.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch dummy data
    const fetchTransactions = async () => {
      const data = [
        { id: 1, date: "2024-12-01", amount: "$100", status: "Completed" },
        { id: 2, date: "2024-12-02", amount: "$250", status: "Pending" },
        { id: 3, date: "2024-12-03", amount: "$500", status: "Completed" },
        { id: 4, date: "2024-12-04", amount: "$150", status: "Canceled" },
      ];
      setTransactions(data);
    };

    fetchTransactions();
  }, []);

  return (
    <div className="transactions-container">
      <header className="transactions-header">
        <h1>Transaction List</h1>
        <p>Manage and review all transactions</p>
      </header>
      
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Transactions;
