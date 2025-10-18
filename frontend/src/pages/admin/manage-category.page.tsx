import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import type { Category } from "../../types/category.types";
import CategoryTable from "../../components/admin/category/category-table";
import CategoryFormDialog from "../../components/admin/category/category-form-dialog";
import CategoryDeleteDialog from "../../components/admin/category/category-delete-dialog";

const initialMock: Category[] = [
  { id: 1, name: "Đồ uống" },
  { id: 2, name: "Bánh kẹo" },
  { id: 3, name: "Gia vị" },
  { id: 4, name: "Đồ gia dụng" },
  { id: 5, name: "Mỹ phẩm" },
];

const ManageCategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(initialMock);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const handleAddClick = () => {
    setEditing(null);
    setOpenForm(true);
  };

  const handleEdit = (c: Category) => {
    setEditing(c);
    setOpenForm(true);
  };

  const handleDelete = (c: Category) => {
    setDeleting(c);
    setOpenDelete(true);
  };

  const handleSave = (payload: Omit<Category, "id">, idToUpdate?: number) => {
    if (typeof idToUpdate === "number") {
      setCategories((prev) =>
        prev.map((p) => (p.id === idToUpdate ? { ...p, name: payload.name } : p))
      );
    } else {
      const newId = Math.max(0, ...categories.map((c) => c.id)) + 1;
      setCategories((prev) => [...prev, { id: newId, name: payload.name }]);
    }
  };

  const confirmDelete = () => {
    if (!deleting) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleting.id));
    setDeleting(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Box>
        <CategoryTable
          categories={categories}
          onAdd={handleAddClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />

        <CategoryFormDialog
          open={openForm}
          initial={editing}
          onClose={() => setOpenForm(false)}
          onSave={(payload, id) => {
            handleSave(payload, id ?? undefined);
            setOpenForm(false);
          }}
        />

        <CategoryDeleteDialog
          open={openDelete}
          name={deleting?.name}
          onClose={() => setOpenDelete(false)}
          onConfirm={() => {
            confirmDelete();
            setOpenDelete(false);
          }}
        />
      </Box>
    </Container>
  );
};

export default ManageCategoryPage;
