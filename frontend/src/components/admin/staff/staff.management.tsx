import { useState, useEffect, useMemo } from 'react';
import { Users, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import StaffFilter from './staff.filter';
import StaffPagination from './staff.pagination';
import { ViewStaffModal } from './modal/view-modal';
import { EditStaffModal } from './modal/update.modals';
import { DeleteStaffModal } from './modal/delete-modal';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Simplified Staff interface matching database structure
interface SimpleStaff {
  id: string;
  username: string;
  fullName: string;
  status: 'active' | 'inactive';
}

// Simplified form data
interface SimpleStaffFormData {
  fullName: string;
  username: string;
}

// Simplified filters
interface SimpleStaffFilters {
  search: string;
  status: 'all' | 'active' | 'inactive';
}

// Generate simplified mock data
const generateSimpleMockStaffs = (): SimpleStaff[] => {
  const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Lisa', 'James', 'Jennifer', 'William', 'Amanda', 'Richard', 'Michelle', 'Charles', 'Laura', 'Joseph', 'Sarah', 'Thomas', 'Karen'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson'];
  
  const staffs: SimpleStaff[] = [];
  
  for (let i = 1; i <= 50; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`;
    const status = Math.random() > 0.2 ? 'active' : 'inactive';
    
    staffs.push({
      id: `STAFF-${String(i).padStart(3, '0')}`,
      username,
      fullName,
      status,
    });
  }
  
  return staffs.sort((a, b) => a.fullName.localeCompare(b.fullName));
};

const mockSimpleStaffs = generateSimpleMockStaffs();

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<SimpleStaff[]>(mockSimpleStaffs);
  const [filteredStaff, setFilteredStaff] = useState<SimpleStaff[]>(mockSimpleStaffs);
  const [filters, setFilters] = useState<SimpleStaffFilters>({
    search: '',
    status: 'all',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<SimpleStaff | null>(null);

  // UI states
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Filter and search logic
  useEffect(() => {
    const filtered = staff.filter((employee) => {
      const matchesSearch =
        filters.search === '' ||
        employee.username.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.fullName.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus =
        filters.status === 'all' || employee.status === filters.status;

      return matchesSearch && matchesStatus;
    });

    setFilteredStaff(filtered);
    setPage(0); // Reset to first page when filters change
  }, [staff, filters]);

  // Pagination logic
  const paginatedStaff = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredStaff.slice(startIndex, endIndex);
  }, [filteredStaff, page, rowsPerPage]);

  // Event handlers
  const handleFiltersChange = (newFilters: SimpleStaffFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleViewStaff = (staffMember: SimpleStaff) => {
    setSelectedStaff(staffMember);
    setViewModalOpen(true);
  };

  const handleEditStaff = (staffMember: SimpleStaff) => {
    setSelectedStaff(staffMember);
    setEditModalOpen(true);
  };

  const handleDeleteStaff = (staffMember: SimpleStaff) => {
    setSelectedStaff(staffMember);
    setDeleteModalOpen(true);
  };

  const handleSaveStaff = (data: SimpleStaffFormData) => {
    if (selectedStaff) {
      setStaff(prev =>
        prev.map(emp =>
          emp.id === selectedStaff.id
            ? { ...emp, ...data }
            : emp
        )
      );
      setSnackbar({
        open: true,
        message: `Staff ${data.fullName} updated successfully`,
        severity: 'success',
      });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedStaff) {
      setStaff(prev => prev.filter(emp => emp.id !== selectedStaff.id));
      setSnackbar({
        open: true,
        message: `Staff ${selectedStaff.fullName} deleted successfully`,
        severity: 'success',
      });
      setDeleteModalOpen(false);
      setSelectedStaff(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getStatusChip = (status: 'active' | 'inactive') => {
    return (
      <Chip
        label={status}
        color={status === 'active' ? 'success' : 'error'}
        size="small"
        variant="filled"
      />
    );
  };

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Box className="max-w-7xl mx-auto">
        {/* Header */}
        <Box className="mb-6">
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <Box>
                <Typography variant="h4" component="h1" className="text-2xl font-bold text-gray-900" gutterBottom={false}>
                  Staff Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your team members
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<Plus className="w-4 h-4" />}
              className="normal-case"
              onClick={() => navigate('/admin/staff/create')}
            >
              Add New Staff
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <StaffFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {/* Staff Table */}
        <Paper className="mb-6" elevation={1}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                <TableRow>
                  <TableCell>
                    Staff Member
                  </TableCell>
                  <TableCell>
                    Status
                  </TableCell>
                  <TableCell align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedStaff.length > 0 ? (
                  paginatedStaff.map((staffMember) => (
                    <TableRow
                      key={staffMember.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f9fafb',
                        },
                      }}
                    >
                      <TableCell>
                        <Box className="flex items-center">
                          <Avatar
                            className="mr-3"
                          >
                            {staffMember.fullName.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" className="font-medium text-gray-900">
                              {staffMember.fullName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              @{staffMember.username}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(staffMember.status)}
                      </TableCell>
                      <TableCell align="right">
                        <Box className="flex items-center justify-end gap-1">
                          <Tooltip title="View Details" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleViewStaff(staffMember)}
                              
                            >
                              <Eye className="w-4 h-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Staff" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleEditStaff(staffMember)}
                              
                            >
                              <Edit className="w-4 h-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Staff" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteStaff(staffMember)}
                              
                            >
                              <Trash2 className="w-4 h-4" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                      <Box className="flex flex-col items-center">
                        <Users className="w-12 h-12 text-gray-300 mb-4" />
                        <Typography variant="h6" className="text-lg font-medium text-gray-900 mb-2">
                          No staff found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {filters.search || filters.status !== 'all'
                            ? 'Try adjusting your filters to see more results.'
                            : 'Get started by adding your first staff member.'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Pagination */}
        {filteredStaff.length > 0 && (
          <StaffPagination
            staff={filteredStaff}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}

        {/* Modals */}
        <ViewStaffModal
          staff={selectedStaff}
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedStaff(null);
          }}
        />

        <EditStaffModal
          staff={selectedStaff}
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedStaff(null);
          }}
          onSave={handleSaveStaff}
        />

        <DeleteStaffModal
          staff={selectedStaff}
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedStaff(null);
          }}
          onConfirm={handleConfirmDelete}
        />

        {/* Success/Error Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default StaffManagement;
