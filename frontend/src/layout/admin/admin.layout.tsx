import { Outlet } from "react-router-dom";
import Header from "./header";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import AdminFooter from "./footer";
import SideBarDrawer from "./sidebar.drawer";
import { useSideBarStore } from "../../store/sidebar.store";

const AdminLayout = () => {
  const { isExpanded } = useSideBarStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box className="w-full relative min-h-screen">
      {/* header */}
      <Header />
      {/* sidebar */}
      <SideBarDrawer />
      {/* main content */}
      <main>
        {/* if device is mobile not padding */}

        <Box
          sx={{
            overflow: "hidden",
            ml: isMobile ? "0px" : isExpanded ? `300px` : `57px`,
            transition: "margin-left 0.3s ease",
            padding: isExpanded ? "0rem" : "0.5rem",
            background: "#fcf9f9",
          }}
        >
          <Box
            sx={{
              minHeight: "calc(90vh - 50px)",
              paddingX: 3,
            }}
          >
            <Outlet />
          </Box>

          {/* footer */}
          <footer>
            <AdminFooter />
          </footer>
        </Box>
      </main>
    </Box>
  );
};

export default AdminLayout;
