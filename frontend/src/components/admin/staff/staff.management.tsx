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
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StaffService } from '../../../services/staff.service';
import type { Staff } from '../../../types/staff.types';

interface SimpleStaffFilters {
  search: string;
}

const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [filters, setFilters] = useState<SimpleStaffFilters>({ search: '' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // Loading
  const [loading, setLoading] = useState(true);

  // --- Fetch staff from API ---
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      const res = await StaffService.getAll();
      if (res.success && res.data) {
        // ✅ Chỉ lấy những người có role === 'staff'
        const staffOnly = res.data.filter((emp) => emp.role === 'staff');
        setStaff(staffOnly);
      } else {
        setSnackbar({
          open: true,
          message: res.message || 'Không thể tải danh sách nhân viên',
          severity: 'error',
        });
      }
      setLoading(false);
    };
    fetchStaff();
  }, []);

  // --- Filtering logic ---
  useEffect(() => {
    const filtered = staff.filter((employee) => {
      const matchesSearch =
        filters.search === '' ||
        employee.username.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.fullName.toLowerCase().includes(filters.search.toLowerCase());
      return matchesSearch;
    });

    setFilteredStaff(filtered);
    setPage(0);
  }, [staff, filters]);

  // --- Pagination logic ---
  const paginatedStaff = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredStaff.slice(startIndex, endIndex);
  }, [filteredStaff, page, rowsPerPage]);

  // --- Handlers ---
  const handleFiltersChange = (newFilters: SimpleStaffFilters) => setFilters(newFilters);
  const handleClearFilters = () => setFilters({ search: '' });

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleViewStaff = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setViewModalOpen(true);
  };

  const handleEditStaff = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setEditModalOpen(true);
  };

  const handleDeleteStaff = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setDeleteModalOpen(true);
  };

  const handleSaveStaff = async (data: { id: number; fullName: string; username: string; role: 'admin' | 'staff' }) => {
    const res = await StaffService.update(data.id, {
      fullName: data.fullName,
      username: data.username,
      role: data.role,
    });

    if (res.success && res.data) {
      setStaff((prev) =>
        prev.map((emp) => (emp.id === data.id ? res.data! : emp))
      );
      setSnackbar({
        open: true,
        message: `Nhân viên ${data.fullName} đã được cập nhật`,
        severity: 'success',
      });
    } else {
      setSnackbar({
        open: true,
        message: res.message ?? 'Lỗi khi cập nhật nhân viên',
        severity: 'error',
      });
    }
    setEditModalOpen(false);
    setSelectedStaff(null);
  };

  // ✅ Delete staff
  const handleConfirmDelete = async () => {
    if (selectedStaff) {
      const res = await StaffService.delete(selectedStaff.id);
      if (res.success) {
        setStaff((prev) => prev.filter((emp) => emp.id !== selectedStaff.id));
        setSnackbar({
          open: true,
          message: `Đã xoá nhân viên ${selectedStaff.fullName}`,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: res.message ?? 'Lỗi khi xoá nhân viên',
          severity: 'error',
        });
      }
      setDeleteModalOpen(false);
      setSelectedStaff(null);
    }
  };

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  // --- Render ---
  if (loading) {
    return (
      <Box className="flex items-center justify-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Box className="max-w-7xl mx-auto">
        {/* Header */}
        <Box className="mb-6">
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <Box>
                <Typography variant="h4" className="text-2xl font-bold text-gray-900" gutterBottom={false}>
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
        <StaffFilter filters={filters} onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} />

        {/* Table */}
        <Paper className="mb-6" elevation={1}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                <TableRow>
                  <TableCell>Staff Member</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedStaff.length > 0 ? (
                  paginatedStaff.map((staffMember, index) => (
                    <TableRow
                      key={staffMember.id ?? `${staffMember.username}-${index}`}
                      sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}
                    >
                      <TableCell>
                        <Box className="flex items-center">
                          <Avatar className="mr-3">
                            {staffMember.fullName
                              ? staffMember.fullName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                              : '?'}
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

                      <TableCell align="right">
                        <Box className="flex items-center justify-end gap-1">
                          <Tooltip title="View Details" arrow>
                            <IconButton size="small" onClick={() => handleViewStaff(staffMember)}>
                              <Eye className="w-4 h-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Staff" arrow>
                            <IconButton size="small" onClick={() => handleEditStaff(staffMember)}>
                              <Edit className="w-4 h-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Staff" arrow>
                            <IconButton size="small" onClick={() => handleDeleteStaff(staffMember)}>
                              <Trash2 className="w-4 h-4" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 6 }}>
                      <Box className="flex flex-col items-center">
                        <Users className="w-12 h-12 text-gray-300 mb-4" />
                        <Typography variant="h6" className="text-lg font-medium text-gray-900 mb-2">
                          No staff found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {filters.search
                            ? 'Try adjusting your search to see more results.'
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

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default StaffManagement;
