import { IconButton, Toolbar } from "@mui/material";
import { ArrowLeftIcon, SearchIcon } from "lucide-react";

import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/ui/admin/search";
import UserDropDown from "../../components/auth/userDropDown";
import { useSideBarStore } from "../../store/sidebar.store";
import AppBar from "../../components/ui/admin/AppBar";

const Header = () => {
  const { toggleSidebar, isExpanded } = useSideBarStore();
  return (
    <>
      <AppBar
        position="sticky"
        open={isExpanded}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer,
        }}
      >
        <Toolbar className="flex justify-between bg-white">
          {/* nav menu */}
          <IconButton onClick={() => toggleSidebar(isExpanded)}>
            <ArrowLeftIcon />
          </IconButton>
          {/* search bar */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <UserDropDown />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
