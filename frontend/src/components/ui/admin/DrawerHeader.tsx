import { Box, IconButton, styled } from "@mui/material";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useSideBarStore } from "../../../store/sidebar.store";

const DrawerHeaderStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const DrawerHeader = () => {
  const { toggleSidebar, isExpanded } = useSideBarStore();

  return (
    <>
      <DrawerHeaderStyle>
        <Box
          display={"flex"}
          flexDirection={isExpanded ? "row" : "column"}
          p={1}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <img
            src={isExpanded ? "/logo.png" : "/logo-mini.png"}
            width={isExpanded ? "50%" : "100%"}
          ></img>
          <IconButton onClick={() => toggleSidebar(isExpanded)}>
            {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
      </DrawerHeaderStyle>
    </>
  );
};

export default DrawerHeader;
