import { Box, Typography } from "@mui/material";

const StaffFooter = () => {
  return (
    <footer>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        width={"full"}
        bgcolor={"white"}
        mt={5}
        p={2}
      >
        <Box display={"flex"} alignItems={"center"} gap={2} fontWeight={"bold"}>
          <Typography variant="body2">Điều khoản</Typography>
          <Typography variant="body2">Quyền riêng tư</Typography>
        </Box>
        <Box fontWeight={"bold"}>© 2025 Booksto with By Nhom 2.</Box>
      </Box>
    </footer>
  );
};

export default StaffFooter;
