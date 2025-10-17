import React, { useState, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Typography,
    Toolbar,
    TablePagination,
    TextField,
    Box,
} from "@mui/material";
import { Edit, Trash, Plus } from "lucide-react"; 
import type { Category } from "../../../types/category.types";

interface Props {
    categories: Category[];
    onEdit: (c: Category) => void;
    onDelete: (c: Category) => void;
    onAdd: () => void;
    page: number;
    setPage: (page: number) => void;
    rowsPerPage: number;
    setRowsPerPage: (n: number) => void;
}

const CategoryTable: React.FC<Props> = ({
    categories,
    onEdit,
    onDelete,
    onAdd,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
}) => {
    const [filterText, setFilterText] = useState("");

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filtered = useMemo(() => {
        return categories.filter((c) =>
            c.name.toLowerCase().includes(filterText.toLowerCase())
        );
    }, [categories, filterText]);

    const paginated = useMemo(() => {
        const start = page * rowsPerPage;
        return filtered.slice(start, start + rowsPerPage);
    }, [filtered, page, rowsPerPage]);

    return (
        <Paper>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                    Quản lý danh mục
                </Typography>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                    <TextField
                        size="small"
                        label="Tìm kiếm theo tên"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                    <Button
                        startIcon={<Plus size={18} />}
                        variant="contained"
                        onClick={onAdd}
                    >
                        Thêm danh mục
                    </Button>
                </Box>
            </Toolbar>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}> 
                            <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Tên</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }} align="right">
                                Hành động
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginated.map((c) => (
                            <TableRow key={c.id}>
                                <TableCell>{c.id}</TableCell>
                                <TableCell>{c.name}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => onEdit(c)} title="Sửa" sx={{ color: "blue" }}>
                                        <Edit size={18} />
                                    </IconButton>
                                    <IconButton onClick={() => onDelete(c)} title="Xoá" sx={{ color: "red" }}>
                                        <Trash size={18} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {paginated.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    Không có danh mục nào
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 20, 50]}
                labelRowsPerPage="Số dòng mỗi trang"
            />
        </Paper>
    );
};

export default CategoryTable;
