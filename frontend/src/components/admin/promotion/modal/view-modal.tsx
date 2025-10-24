import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import { X, Eye } from "lucide-react";
import type { Promotion } from "../../../../types/promotion.type";

// Simplified Promotion interface matching database structure

interface ViewPromotionModalProps {
  Promotion: Promotion | null;
  open: boolean;
  onClose: () => void;
}

export const ViewPromotionModal = ({
  Promotion,
  open,
  onClose,
}: ViewPromotionModalProps) => {
  if (!Promotion) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <Typography
          variant="h6"
          component="div"
          className="flex items-center gap-2"
        >
          <Eye className="w-5 h-5" />
          Promotion Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X className="w-4 h-4" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box className="space-y-4">
          <Box className="flex items-center gap-4">
            <Box>
              <Typography variant="h6" className="font-semibold">
                {Promotion.promotionCode}
              </Typography>
            </Box>
          </Box>
          <Box className="space-y-3">
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                className="mb-1"
              >
                Promotion ID
              </Typography>
              <Typography variant="body2">
                {" "}
                Promotion-{Promotion.promotionId}
              </Typography>
            </Box>

            {/* description */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                className="mb-1"
              >
                Promotion description
              </Typography>
              <Typography variant="body2">{Promotion.description}</Typography>
            </Box>
            {/* discount  type */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                className="mb-1"
              >
                Discount type
              </Typography>
              <Typography variant="body2">
                {Promotion.discountType == 1 ? "percent" : "fixed"}
              </Typography>
            </Box>

            {/* discount value */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                className="mb-1"
              >
                Discount value
              </Typography>
              <Typography variant="body2">
                {Promotion.discountValue}
                {Promotion.discountType == 1 ? "%" : ""}
              </Typography>
            </Box>

            {/* time  */}
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                className="mb-1"
              >
                Time range
              </Typography>
              <Typography variant="body2">
                {Promotion.startDate} - {Promotion.endDate}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                className="mb-1"
              >
                Promotion min order amount
              </Typography>
              <Typography variant="body2">
                {Promotion.minOrderAmount}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                className="mb-1"
              >
                Usage limit
              </Typography>
              <Typography variant="body2">{Promotion.usagelimit}</Typography>
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                className="mb-1"
              >
                Status
              </Typography>
              <Chip
                label={Promotion.status === 1 ? "active" : "inactive"}
                color={Promotion.status === 1 ? "success" : "error"}
                size="small"
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
