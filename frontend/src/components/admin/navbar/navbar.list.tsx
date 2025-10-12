import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { adminMenuItems } from "../../../common/constants/index.constant";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
interface navbarListProps {
  open: boolean;
  role: string;
}
const NavbarList = ({ role }: navbarListProps) => {
  //  render list item by role
  console.log(role);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const navigate = useNavigate();

  // catch event navigate to active item
  useEffect(() => {
    const currentIndex = adminMenuItems.findIndex((item) => {
      const itemPath = item.path.startsWith("/")
        ? item.path
        : `/admin/${item.path}`;
      return location.pathname === itemPath;
    });
    if (currentIndex !== -1) setSelectedIndex(currentIndex + 1);
  }, [location.pathname]);
  // event click nav item
  const handleListItemClick = (index: number, path: string) => {
    setSelectedIndex(index + 1);
    navigate(path);
  };
  const hoverItemStyle = {
    "&:hover": {
      color: "#0DD6B8",
    },
    "& .MuiListItemIcon-root": {
      color: "inherit",
    },
    "&.Mui-selected": {
      color: "#0DD6B8",
      backgroundColor: "white",
      "& .MuiListItemIcon-root": {
        color: "#0DD6B8",
      },
    },
  };
  return (
    <>
      <List>
        {adminMenuItems.map((Item, index) => (
          <ListItem key={Item.label} disablePadding>
            <ListItemButton
              sx={hoverItemStyle}
              selected={selectedIndex === index + 1}
              onClick={() => {
                handleListItemClick(index, Item.path);
              }}
            >
              <ListItemIcon>
                <Item.icon />
              </ListItemIcon>
              <ListItemText primary={Item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default NavbarList;
