import React, { useEffect, useState } from "react";
import { Box, Container, CircularProgress, Snackbar, Alert } from "@mui/material";
import type { Category } from "../../types/category.types";
import CategoryTable from "../../components/admin/category/category-table";
import CategoryFormDialog from "../../components/admin/category/category-form-dialog";
import CategoryDeleteDialog from "../../components/admin/category/category-delete-dialog";
import { CategoryService } from "../../services/category.service";

const ManageCategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState<Category | null>(null);

  // 🟢 Snackbar thông báo
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  // 🟢 Lấy danh sách danh mục
  useEffect(() => {
    (async () => {
      try {
        const res = await CategoryService.getAll();
        if (res.success && res.data) {
          setCategories(res.data);
        } else {
          console.error("❌ Lỗi khi lấy danh mục:", res.message);
          setSnackbar({ open: true, message: res.message ?? "Lỗi khi lấy danh mục", severity: "error" });
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh mục:", err);
        setSnackbar({ open: true, message: "Không thể tải danh mục", severity: "error" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🟢 Xử lý tạo hoặc cập nhật danh mục
  const handleSave = async (payload: Omit<Category, "id">, idToUpdate?: number) => {
    try {
      if (idToUpdate) {
        const res = await CategoryService.update(idToUpdate, payload);
        if (res.success && res.data) {
          setCategories((prev) =>
            prev.map((c) => (c.id === idToUpdate ? res.data! : c))
          );
          setSnackbar({ open: true, message: "Cập nhật danh mục thành công", severity: "success" });
        } else {
          const message =
            res.message?.includes("already exists")
              ? "Tên danh mục đã tồn tại"
              : res.message ?? "Lỗi khi cập nhật danh mục";
          setSnackbar({ open: true, message, severity: "error" });
        }
      } else {
        const res = await CategoryService.create(payload);
        if (res.success && res.data) {
          setCategories((prev) => [...prev, res.data!]);
          setSnackbar({ open: true, message: "Tạo danh mục thành công", severity: "success" });
        } else {
          const message =
            res.message?.includes("already exists")
              ? "Tên danh mục đã tồn tại"
              : res.message ?? "Lỗi khi tạo danh mục";
          setSnackbar({ open: true, message, severity: "error" });
        }
      }
    } catch (err) {
      console.error("❌ Lỗi khi lưu danh mục:", err);
      setSnackbar({ open: true, message: "Lỗi không xác định", severity: "error" });
    } finally {
      setOpenForm(false);
      setEditing(null);
    }
  };

  // 🟢 Xác nhận xoá
  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      const res = await CategoryService.delete(deleting.id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== deleting.id));
        setSnackbar({ open: true, message: "Xoá danh mục thành công", severity: "success" });
      } else {
        setSnackbar({ open: true, message: res.message ?? "Lỗi khi xoá danh mục", severity: "error" });
      }
    } catch (err) {
      console.error("❌ Lỗi khi xoá danh mục:", err);
      setSnackbar({ open: true, message: "Không thể xoá danh mục", severity: "error" });
    } finally {
      setDeleting(null);
      setOpenDelete(false);
    }
  };

  // 🟢 Loading UI
  if (loading)
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Box>
        <CategoryTable
          categories={categories}
          onAdd={() => {
            setEditing(null);
            setOpenForm(true);
          }}
          onEdit={(c) => {
            setEditing(c);
            setOpenForm(true);
          }}
          onDelete={(c) => {
            setDeleting(c);
            setOpenDelete(true);
          }}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />

        <CategoryFormDialog
          open={openForm}
          initial={editing}
          onClose={() => setOpenForm(false)}
          onSave={handleSave}
        />

        <CategoryDeleteDialog
          open={openDelete}
          name={deleting?.name}
          onClose={() => setOpenDelete(false)}
          onConfirm={confirmDelete}
        />

        {/* 🟢 Snackbar thông báo */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ManageCategoryPage;
