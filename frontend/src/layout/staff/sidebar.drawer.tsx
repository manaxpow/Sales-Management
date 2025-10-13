import { useTheme } from "@mui/material/styles";
import { Box, CssBaseline, Divider, useMediaQuery } from "@mui/material";

import { DrawerDesktop } from "../../components/ui/admin/Drawer";
import MuiDrawer from "@mui/material/Drawer";
import NavbarList from "../../components/admin/navbar/navbar.list";
import { useSideBarStore } from "../../store/sidebar.store";
import DrawerHeader from "../../components/ui/admin/DrawerHeader";

const drawerWidth = 300;
export default function SideBarDrawer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { toggleSidebar, isExpanded } = useSideBarStore();

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
          <NavbarList role="staff" open={isExpanded}></NavbarList>
        </MuiDrawer>
      ) : (
        // Desktop => mini variant drawer
        <DrawerDesktop variant="permanent" open={isExpanded}>
          <DrawerHeader />
          <Divider />
          <NavbarList role="staff" open={isExpanded}></NavbarList>
        </DrawerDesktop>
      )}
    </Box>
  );
}
