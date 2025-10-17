import React from "react";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { IconButton, Box, Toolbar, Button, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type { Category } from "../../../types/category.types";

interface Props {
    categories: Category[];
    onEdit: (c: Category) => void;
    onDelete: (c: Category) => void;
    onAdd: () => void;
    pageSize?: number;
    setPageSize?: (n: number) => void;
}

const CategoryTable: React.FC<Props> = ({
    categories,
    onEdit,
    onDelete,
    onAdd,
    pageSize = 10,
    setPageSize,
}) => {
    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "name", headerName: "Name", flex: 1, minWidth: 200 },
        {
            field: "actions",
            headerName: "Actions",
            width: 120,
            sortable: false,
            filterable: false,
            disableExport: true,
            renderCell: (params: GridRenderCellParams) => {
                const row = params.row as Category;
                return (
                    <>
                        <IconButton size="small" onClick={() => onEdit(row)} title="Edit">
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => onDelete(row)} title="Delete">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    return (
        <Box sx={{ height: 520, width: "100%" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 0 }}>
                <Typography variant="h6">Categories</Typography>
                <Button startIcon={<AddIcon />} variant="contained" onClick={onAdd}>
                    Add Category
                </Button>
            </Toolbar>

            <DataGrid
                rows={categories}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: pageSize || 5, page: 0 }
                    }
                }}
                pageSizeOptions={[5, 10, 20, 50]}
                onPaginationModelChange={(model) => setPageSize && setPageSize(model.pageSize)}
                pagination
                disableRowSelectionOnClick
                sx={{
                    ".MuiDataGrid-columnHeader": {
                        backgroundColor: "rgba(0,0,0,0.03)",
                    },
                }}
            />
        </Box>
    );

};

export default CategoryTable;
