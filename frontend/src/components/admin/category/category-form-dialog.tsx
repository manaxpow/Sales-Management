import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import type { Category } from "../../../types/category.types";

interface Props {
  open: boolean;
  initial?: Category | null;
  onClose: () => void;
  onSave: (payload: Omit<Category, "id">, idToUpdate?: number) => void;
}

const CategoryFormDialog: React.FC<Props> = ({ open, initial = null, onClose, onSave }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (initial) setName(initial.name);
    else setName("");
  }, [initial, open]);

  const handleSave = () => {
    if (name.trim() === "") return;
    if (initial) onSave({ name: name.trim() }, initial.id);
    else onSave({ name: name.trim() });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial ? "Edit Category" : "Add Category"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Category name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleSave();
            onClose();
          }}
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryFormDialog;
