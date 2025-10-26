import { useTheme } from "@mui/material/styles";
import { Box, CssBaseline, Divider, useMediaQuery } from "@mui/material";

import { DrawerDesktop } from "../../components/ui/admin/Drawer";
import MuiDrawer from "@mui/material/Drawer";
import NavbarList from "../../components/admin/navbar/navbar.list";
import { useSideBarStore } from "../../store/sidebar.store";
import DrawerHeader from "../../components/ui/admin/DrawerHeader";
import { useLocation } from "react-router-dom";

const drawerWidth = 300;
export default function SideBarDrawer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { toggleSidebar, isExpanded } = useSideBarStore();
  const location = useLocation();
  const role = location.pathname.split("/");
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Drawer */}
      {isMobile ? (
        // Mobile => temporary drawer
        <MuiDrawer
          variant="temporary"
          open={isExpanded}
          onClose={() => toggleSidebar(isExpanded)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          <DrawerHeader />
          <Divider />
          <NavbarList role={role[1]} open={isExpanded}></NavbarList>
        </MuiDrawer>
      ) : (
        // Desktop => mini variant drawer
        <DrawerDesktop variant="permanent" open={isExpanded}>
          <DrawerHeader />
          <Divider />
          <NavbarList role={role[1]} open={isExpanded}></NavbarList>
        </DrawerDesktop>
      )}
    </Box>
  );
}
