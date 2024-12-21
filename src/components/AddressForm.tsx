import React, { useState, useRef } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import ReplayIcon from "@mui/icons-material/Replay";
import { useAppDispatch } from "../store/hooks/hooks";
import { setAddressDetails } from "../store/slices/ordersSlice";

const ModalFormWithVoiceNote = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const dispatch = useAppDispatch()

  const formDataRef = useRef({
    cabinName: "",
    extraInfo: "",
    specialInstructions: "",
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    formDataRef.current = { ...formDataRef.current, [field]: value };
  };

  const serializeBlob = async (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Convert Blob to Base64
    });
  };

  const handleFormSubmit = async () => {

    // let audioBlobBase64;

    // if (audioBlob) {

    //   audioBlobBase64 = await serializeBlob(audioBlob); // Serialize the blob

    // }
    // const finalFormData = {
    //   ...formDataRef.current,
    //   audioBlob: audioBlobBase64 || null,
    // };
    dispatch(setAddressDetails(formDataRef.current)); // Store address details in Redux
    onClose();
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
            Cabin Details Form
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <form>
          <TextField
            label="Cabin Name/Number"
            required
            fullWidth
            margin="normal"
            onChange={(e) => handleInputChange("cabinName", e.target.value)}
          />
          <TextField
            label="Extra Info about destination (Optional)"
            fullWidth
            margin="normal"
            onChange={(e) => handleInputChange("extraInfo", e.target.value)}
          />
          <TextField
            label="Special Instructions regarding food (Optional)"
            fullWidth
            margin="normal"
            onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
          />

          {/* <Box mt={2}>
            <Typography variant="body2" mb={1}>
              Voice Note (Optional)
            </Typography>
            <Box>
              {!isRecording ? (
                <Button
                  variant="outlined"
                  startIcon={<MicIcon />}
                  onClick={startRecording}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                >
                  Start Recording
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<StopIcon />}
                  onClick={stopRecording}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                >
                  Stop Recording
                </Button>
              )}
              {audioUrl && (
                <Button
                  variant="outlined"
                  startIcon={<ReplayIcon />}
                  onClick={playRecording}
                  fullWidth
                >
                  Play Recording
                </Button>
              )}
            </Box>
          </Box> */}

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="error"
              onClick={onClose}
              sx={{ flex: 1, marginRight: 1 }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleFormSubmit}
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

export default ModalFormWithVoiceNote;