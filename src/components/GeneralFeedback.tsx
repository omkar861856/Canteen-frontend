import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Rating,
    Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch } from '../store/hooks/hooks';
import { sendFeedback } from '../store/slices/generaFeedbackSlice';
import { useUser } from '@clerk/clerk-react';

interface FeedbackFormValues {
    feedback: string;
    rating: number;
    fullName: string | null | undefined;
}

interface GeneralFeedbackModalProps {
    open: boolean;
    onClose: () => void;
}

const GeneralFeedbackModal: React.FC<GeneralFeedbackModalProps> = ({ open, onClose }) => {

    const dispatch = useAppDispatch();

    const user = useUser()    

    const { handleSubmit, control, reset } = useForm<FeedbackFormValues>({
        defaultValues: {
            feedback: '',
            rating: 3,
            fullName: "Guest",
        },
    });

    const handleFormSubmit = (data: FeedbackFormValues) => {
        const updated = {...data, fullName: user?.user?.fullName}
        dispatch(sendFeedback(updated))
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant="h6" component="span" align="center">
                    We Value Your Feedback!
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    width="100%"
                    maxWidth="500px" // Optional: Limit the maximum width
                    sx={{
                        boxSizing: 'border-box',
                    }}
                >  {/* Feedback Rating */}
                    <Controller
                        name="rating"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Typography variant="subtitle1">Rate Your Experience:</Typography>
                                <Rating
                                    {...field}
                                    size="large"
                                    value={Number(field.value)} // Ensuring the value is a number
                                    onChange={(_, newValue) => field.onChange(newValue)} // Update value correctly
                                />
                            </>
                        )}
                    />

                    {/* Feedback Text Field */}
                    <Controller
                        name="feedback"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Your Feedback"
                                multiline
                                rows={4}
                                variant="outlined"
                                fullWidth
                                placeholder="Share your thoughts about the app"
                                InputProps={{
                                    style: {
                                        padding: '10px', // Adds consistent padding for text
                                        lineHeight: '1.5', // Ensures proper spacing between lines
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true, // Ensures label stays in correct position
                                    style: {
                                        top: '-6px', // Adjust placeholder label position
                                    },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        alignItems: 'flex-start', // Ensures proper alignment for multiline
                                        borderRadius: '8px', // Makes the input aesthetically clean
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        wordWrap: 'break-word', // Prevents text overflow
                                        overflow: 'hidden',
                                    },
                                }}
                            />
                        )}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit(handleFormSubmit)}
                    variant="contained"
                    color="primary"
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GeneralFeedbackModal;