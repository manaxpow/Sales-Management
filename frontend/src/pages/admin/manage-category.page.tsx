import React, { useEffect, useState } from "react";
import { Box, Container, CircularProgress } from "@mui/material";
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

  useEffect(() => {
    (async () => {
      try {
        const data = await CategoryService.getAll();
        setCategories(data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách danh mục:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (payload: Omit<Category, "id">, idToUpdate?: number) => {
    try {
      if (idToUpdate) {
        const updated = await CategoryService.update(idToUpdate, payload);
        setCategories((prev) =>
          prev.map((c) => (c.id === idToUpdate ? updated : c))
        );
      } else {
        const created = await CategoryService.create(payload);
        setCategories((prev) => [...prev, created]);
      }
    } catch (err) {
      console.error("Lỗi khi lưu danh mục:", err);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await CategoryService.delete(deleting.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleting.id));
    } catch (err) {
      console.error("Lỗi khi xoá danh mục:", err);
    } finally {
      setDeleting(null);
    }
  };

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
      </Box>
    </Container>
  );
};

export default ManageCategoryPage;
