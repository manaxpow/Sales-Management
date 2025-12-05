import React from 'react';
import { TablePagination } from '@mui/material';

interface SimpleStaff {
  id: number;
  username: string;
  fullName: string;
  role: 'admin' | 'staff';
}

interface StaffPaginationProps {
  staff: SimpleStaff[];
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

const StaffPagination = ({
  staff,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: StaffPaginationProps) => {
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  return (
    <TablePagination
      component="div"
      count={staff.length}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[5, 10, 25, 50]}
      labelRowsPerPage="Staff per page:"
      labelDisplayedRows={({ from, to, count }) => 
        `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
      }
      sx={{
        '& .MuiTablePagination-toolbar': {
          paddingLeft: 2,
          paddingRight: 2,
        },
        '& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
          fontSize: '0.875rem',
        },
        '& .MuiTablePagination-select': {
          paddingTop: 1,
          paddingBottom: 1,
        },
      }}
    />
  );
};

export default StaffPagination;
