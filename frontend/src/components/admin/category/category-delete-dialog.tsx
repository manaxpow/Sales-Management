import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  name?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const CategoryDeleteDialog: React.FC<Props> = ({ open, name, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete category</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the category{" "}
          <strong>{name ?? "this item"}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={() => { onConfirm(); onClose(); }} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDeleteDialog;
