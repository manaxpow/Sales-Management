import React from "react";
import { TablePagination } from "@mui/material";
import type { Supplier } from "../../../types/supplier.types";

interface SupplierPaginationProps {
  suppliers: Supplier[];
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

const SupplierPagination: React.FC<SupplierPaginationProps> = ({
  suppliers,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <TablePagination
      component="div"
      count={suppliers.length}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[5, 10, 25, 50]}
      labelRowsPerPage="Số hàng mỗi trang:"
      labelDisplayedRows={({ from, to, count }) =>
        `${from} - ${to} trên tổng ${count !== -1 ? count : `hơn ${to}`}`
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

export default SupplierPagination;