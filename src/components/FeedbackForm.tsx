import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Rating,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";

interface FeedbackFormData {
  satisfaction: number; // Must be a number for Rating
  foodQuality: number; // Must be a number for Rating
  deliveryExperience: number; // Must be a number for Rating
  orderAccuracy: boolean;
  suggestions?: string;
  compliments?: string;
  contactConsent: boolean;
  contactInfo?: string;
}

const FeedbackFormModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors },
    reset,
  } = useForm<FeedbackFormData>({
    defaultValues: {
      satisfaction: 0,
      foodQuality: 0,
      deliveryExperience: 0,
      orderAccuracy: false,
      contactConsent: false,
    },
  });

  const onSubmit = (data: FeedbackFormData) => {
    console.log("Feedback submitted:", data);
    reset(); // Reset the form after submission
    onClose(); // Close the modal
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "50%" },
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color="primary">
            Feedback Form
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Satisfaction Rating */}
          <Typography variant="body1" gutterBottom>
            Overall Satisfaction
          </Typography>
          <Controller
            name="satisfaction"
            control={control}
            render={({ field }) => (
              <Rating
                {...field}
                value={field.value || 0} // Ensure value is a number
                onChange={(_, value) => field.onChange(value || 0)}
                size="large"
                precision={0.5}
              />
            )}
          />
          {errors.satisfaction && (
            <Typography color="error" variant="caption">
              {errors.satisfaction.message}
            </Typography>
          )}

          {/* Food Quality */}
          <Typography variant="body1" gutterBottom sx={{ marginTop: 3 }}>
            Food Quality
          </Typography>
          <Controller
            name="foodQuality"
            control={control}
            render={({ field }) => (
              <Rating
                {...field}
                value={field.value || 0}
                onChange={(_, value) => field.onChange(value || 0)}
                size="large"
                precision={0.5}
              />
            )}
          />
          {errors.foodQuality && (
            <Typography color="error" variant="caption">
              {errors.foodQuality.message}
            </Typography>
          )}

          {/* Delivery Experience */}
          <Typography variant="body1" gutterBottom sx={{ marginTop: 3 }}>
            Delivery Experience
          </Typography>
          <Controller
            name="deliveryExperience"
            control={control}
            render={({ field }) => (
              <Rating
                {...field}
                value={field.value || 0}
                onChange={(_, value) => field.onChange(value || 0)}
                size="large"
                precision={0.5}
              />
            )}
          />
          {errors.deliveryExperience && (
            <Typography color="error" variant="caption">
              {errors.deliveryExperience.message}
            </Typography>
          )}

          {/* Order Accuracy */}
          <Box mt={3}>
            <FormControlLabel
              control={
                <Controller
                  name="orderAccuracy"
                  control={control}
                  render={({ field }) => (
                    <Checkbox {...field} checked={field.value} />
                  )}
                />
              }
              label="Was your order accurate?"
            />
          </Box>

          {/* Suggestions */}
          <TextField
            label="Suggestions for Improvement"
            multiline
            rows={3}
            fullWidth
            margin="normal"
            {...register("suggestions")}
          />

          {/* Compliments */}
          <TextField
            label="Compliments (Optional)"
            multiline
            rows={3}
            fullWidth
            margin="normal"
            {...register("compliments")}
          />

          {/* Contact Information */}
          <FormControlLabel
            control={
              <Controller
                name="contactConsent"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value} />
                )}
              />
            }
            label="Can we contact you for follow-up?"
          />
          {watch("contactConsent") && (
            <TextField
              label="Contact Information"
              fullWidth
              margin="normal"
              {...register("contactInfo")}
            />
          )}

          {/* Submit and Cancel Buttons */}
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="error"
              onClick={onClose}
              sx={{ flex: 1, marginRight: 1 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ flex: 1 }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default FeedbackFormModal;