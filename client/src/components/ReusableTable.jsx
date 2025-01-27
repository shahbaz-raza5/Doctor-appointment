import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Empty from "./Empty";

const ReusableTable = ({ headers = [], data = [], renderActions }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead className="bg-gradient-to-r from-teal-400 to-blue-400">
          <TableRow>
            {headers.map((header, index) => (
              <TableCell
                key={index}
                style={{ color: "white", fontWeight: "bold" }}
              >
                {header.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <TableCell key={colIndex}>
                    {header.key === "actions"
                      ? renderActions
                        ? renderActions(row)
                        : null
                      : row[header.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length} align="center">
                <Empty />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReusableTable;
