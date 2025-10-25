import React from "react";
import { TablePagination } from "@mui/material";
import type { Promotion } from "../../../types/promotion.type";

interface PromotionPaginationProps {
  Promotion: Promotion[];
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

const PromotionPagination = ({
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
}: PromotionPaginationProps) => {
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = parseInt(event.target.value, 10);
    onRowsPerPageChange(newValue);
  };
  console.log(total);
  return (
    <TablePagination
      component="div"
      count={total}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[5, 10, 25, 50]}
      labelRowsPerPage="Promotion per page:"
      labelDisplayedRows={({ from, to, count }) =>
        `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
      }
      sx={{
        "& .MuiTablePagination-toolbar": {
          paddingLeft: 2,
          paddingRight: 2,
        },
        "& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
          {
            fontSize: "0.875rem",
          },
        "& .MuiTablePagination-select": {
          paddingTop: 1,
          paddingBottom: 1,
        },
      }}
    />
  );
};

export default PromotionPagination;
