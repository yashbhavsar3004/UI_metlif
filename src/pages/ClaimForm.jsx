// File: src/components/ClaimForm.js

import React, { useState, useRef, useEffect, useCallback } from "react";
import { format } from "date-fns";

// --- MUI Core ---
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

// --- MUI Icons ---
import {
  UploadFile as UploadFileIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";

// --- MUI Date Pickers ---
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// --- Project Imports ---
import { claimFormAPI } from "../services/api"; // <-- This will now work

// ========================================================================
// Constants
// ========================================================================

const INITIAL_FORM_DATA = {
  claimNo: "",
  customerId: "",
  claimType: "",
  amount: "",
  nominee: "",
  date: null,
  bankAccountNo: "",
  nameOfClaimant: "",
  signature: null,
};

const CLAIM_TYPES = [
  "Health",
  "Life",
  "Vehicle",
  "Travel",
  "Property",
  "Other",
];

const MANUAL_FORM_FIELDS = [
  { 
    label: "Claim Number",
    name: "claimNo",
    sm: 6,
    icon: "📝",
    placeholder: "Enter claim number",
    description: "Your unique claim reference number"
  },
  { 
    label: "Customer ID",
    name: "customerId",
    sm: 6,
    icon: "🆔",
    placeholder: "Enter customer ID",
    description: "Your MetLife customer identification"
  },
  { 
    label: "Claim Amount",
    name: "amount",
    type: "number",
    sm: 6,
    icon: "💰",
    placeholder: "Enter claim amount",
    description: "Total amount being claimed"
  },
  { 
    label: "Nominee Name",
    name: "nominee",
    sm: 6,
    icon: "👥",
    placeholder: "Enter nominee name",
    description: "Name of the beneficiary"
  },
  { 
    label: "Bank Account",
    name: "bankAccountNo",
    sm: 6,
    icon: "🏦",
    placeholder: "Enter bank account number",
    description: "Account for claim settlement"
  },
  { 
    label: "Claimant Name",
    name: "nameOfClaimant",
    sm: 6,
    icon: "👤",
    placeholder: "Enter claimant name",
    description: "Name of person filing the claim"
  },
];

// ========================================================================
// ClaimForm Component
// ========================================================================

const ClaimForm = () => {
  // --- Component State ---
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [fieldErrors, setFieldErrors] = useState({});
  const [uploadMode, setUploadMode] = useState("manual"); // 'manual' or 'upload'
  const [pdfFile, setPdfFile] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // --- API State ---
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Refs ---
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // --- Theme & Responsive ---
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ========================================================================
  // Effects
  // ========================================================================

  // Set up signature canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || uploadMode === "upload") return; // Only run for manual form

    const ctx = canvas.getContext("2d");

    const setCanvasSize = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const width = Math.min(600, container.offsetWidth - 16); // 16px for padding
      canvas.width = width;
      canvas.height = 150;

      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Cleanup
    return () => window.removeEventListener("resize", setCanvasSize);
  }, [uploadMode]); // Re-run if uploadMode changes (to init canvas)

  // ========================================================================
  // Validation
  // ========================================================================

  const validateField = useCallback((field, value) => {
    let error = "";
    switch (field) {
      case "claimNo":
        if (!value.trim()) error = "Claim No is required";
        else if (value.length < 3)
          error = "Claim No must be at least 3 characters";
        break;
      case "customerId":
        if (!value.trim()) error = "Customer ID is required";
        else if (value.length < 3)
          error = "Customer ID must be at least 3 characters";
        break;
      case "claimType":
        if (!value) error = "Claim Type is required";
        break;
      case "amount":
        if (!value.toString().trim()) error = "Amount is required";
        else if (isNaN(value)) error = "Amount must be a number";
        else if (parseFloat(value) <= 0)
          error = "Amount must be greater than 0";
        break;
      case "nominee":
        if (!value.trim()) error = "Nominee is required";
        else if (!/^[a-zA-Z\s]+$/.test(value))
          error = "Nominee should contain only letters";
        break;
      case "date":
        if (!value) {
          error = "Date is required";
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
          
          if (selectedDate > today) {
            error = "Date of incident cannot be in the future";
          }
        }
        break;
      case "bankAccountNo":
        if (!value.trim()) error = "Bank Account Number is required";
        else if (!/^\d+$/.test(value))
          error = "Bank Account should contain only digits";
        else if (value.length < 8)
          error = "Bank Account must be at least 8 digits";
        break;
      case "nameOfClaimant":
        if (!value.trim()) error = "Name of Claimant is required";
        else if (!/^[a-zA-Z\s]+$/.test(value))
          error = "Name should contain only letters";
        break;
      case "signature":
        if (!value) error = "Signature is required";
        break;
      default:
        break;
    }
    return error;
  }, []);

  const validateAllFields = () => {
    const fields = Object.keys(INITIAL_FORM_DATA);
    const newErrors = {};
    fields.forEach((f) => (newErrors[f] = validateField(f, formData[f])));
    setFieldErrors(newErrors);
    return !Object.values(newErrors).some((e) => e);
  };

  // ========================================================================
  // Event Handlers
  // ========================================================================

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: validateField(field, value),
      }));
    }
  };

  const handleDateChange = (newDate) => {
    setFormData((prev) => ({ ...prev, date: newDate }));
    if (fieldErrors.date) {
      setFieldErrors((prev) => ({
        ...prev,
        date: validateField("date", newDate),
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setError(null);
    } else {
      setPdfFile(null);
      setError("Please upload a PDF file only.");
      e.target.value = "";
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setFormData((prev) => ({ ...prev, signature: null }));
    setFieldErrors((prev) => ({ ...prev, signature: "Signature is required" }));
  };

  // ========================================================================
  // Signature Canvas Handlers
  // ========================================================================

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 }; // Guard clause
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const data = canvas.toDataURL(); // Get image data
    setFormData((prev) => ({ ...prev, signature: data }));
    setFieldErrors((prev) => ({ ...prev, signature: "" })); // Clear signature error
    setIsDrawing(false);
  };

  // ========================================================================
  // Form Submission
  // ========================================================================

  const handleManualSubmit = async () => {
    const isValid = validateAllFields();
    if (!isValid) {
      setError("Please fix validation errors before submitting.");
      return;
    }

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: format(formData.date, "yyyy-MM-dd"),
        submittedAt: new Date().toISOString(),
      };

      console.log("Submitting manual payload:", payload);
      await claimFormAPI.submitClaimForm(payload);

      setSuccess(true);
      setFormData(INITIAL_FORM_DATA);
      setFieldErrors({});
      if (canvasRef.current) {
        clearSignature();
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Submission failed. Please try again.");
    }
  };

  const handleUploadSubmit = async () => {
    if (!pdfFile) {
      setError("Please upload a PDF file.");
      return;
    }

    try {
      console.log("Uploading PDF:", pdfFile.name);
      await claimFormAPI.uploadPDFForm(pdfFile);

      setSuccess(true);
      setPdfFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("PDF upload failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (uploadMode === "upload") {
      await handleUploadSubmit();
    } else {
      await handleManualSubmit();
    }

    setLoading(false);
  };

  // ========================================================================
  // Sub-Render Functions
  // ========================================================================

  const renderUploadForm = () => (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="pdf-upload"
      />
      <label htmlFor="pdf-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<UploadFileIcon />}
        >
          {pdfFile ? "Change PDF" : "Upload PDF"}
        </Button>
      </label>
      {pdfFile && (
        <Typography sx={{ mt: 2, fontStyle: "italic" }}>
          {pdfFile.name}
        </Typography>
      )}
      <Box sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!pdfFile || loading}
        >
          {loading ? "Submitting..." : "Submit PDF"}
        </Button>
      </Box>
    </>
  );

  const renderManualForm = () => (
    <Grid container spacing={3}>
      {/* --- Dynamic Input Fields in pairs --- */}
      {Array.from({ length: Math.ceil(MANUAL_FORM_FIELDS.length / 2) }).map((_, rowIndex) => (
        <Grid container item spacing={3} key={rowIndex} sx={{ width: '100%', m: 0 }}>
          {MANUAL_FORM_FIELDS.slice(rowIndex * 2, rowIndex * 2 + 2).map((field) => (
            <Grid item xs={12} sm={6} key={field.name} sx={{ flex: 1, minWidth: '50%' }}>
              <Box sx={{ mb: 0.5 }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary', 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{field.icon}</span>
                    {field.label}
                  </Box>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.disabled',
                      pl: 3
                    }}
                  >
                    {field.description}
                  </Typography>
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder={field.placeholder}
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange(field.name)}
                error={!!fieldErrors[field.name]}
                helperText={fieldErrors[field.name]}
                type={field.type || "text"}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'background.paper',
                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                    },
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      ))}

      {/* --- Claim Type and Date Row --- */}
      <Grid container item spacing={3} justifyContent="center" sx={{ mt: 2 }}>
        {/* --- Claim Type Select --- */}
        <Grid item xs={12} sm={10} md={9}>
          <Box sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>🏥</span> Claim Type
            </Typography>
          </Box>
          <FormControl 
            fullWidth 
            error={!!fieldErrors.claimType}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-focused': {
                  backgroundColor: 'background.paper',
                  boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                },
              },
            }}
          >
            <Select
              value={formData.claimType}
              displayEmpty
              onChange={handleInputChange("claimType")}
            >
              <MenuItem value="" disabled>
                <Typography sx={{ color: 'text.secondary' }}>Select claim type</Typography>
              </MenuItem>
              {CLAIM_TYPES.map((type) => (
                <MenuItem key={type} value={type.toLowerCase()}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{
                      type === 'Health' ? '🏥' :
                      type === 'Life' ? '❤️' :
                      type === 'Vehicle' ? '🚗' :
                      type === 'Travel' ? '✈️' :
                      type === 'Property' ? '🏠' :
                      '📋'
                    }</span>
                    {type}
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {fieldErrors.claimType && (
              <FormHelperText error>{fieldErrors.claimType}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* --- Date Picker --- */}
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>📅</span> Date of Incident
            </Typography>
          </Box>
          <DatePicker
            value={formData.date}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!fieldErrors.date,
                helperText: fieldErrors.date,
                placeholder: "Select date",
                sx: {
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'background.paper',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'background.paper',
                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                    },
                                    width: 158,
                maxWidth: 145,
                  },
                },
              },
            }}
          />
        </Grid>
      </Grid>

      {/* --- Signature Canvas --- */}
      <Grid container item justifyContent="center" sx={{ mt: 4 }}>
        <Grid item xs={12} md={8} lg={7} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ width: '100%', mb: 0.5 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary', 
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>✍️</span>
                Digital Signature
              </Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.disabled',
                  pl: 3
                }}
              >
                Use mouse or touch to sign in the box below
              </Typography>
            </Typography>
          </Box>
          <Box
            sx={{
              width: '100%',
              border: `2px solid ${
                fieldErrors.signature ? theme.palette.error.main : "rgba(0,0,0,0.23)"
              }`,
              borderRadius: 1,
              p: 1,
              backgroundColor: "background.paper",
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'rgba(0,0,0,0.87)',
              },
              '&:focus-within': {
                borderColor: theme.palette.primary.main,
                boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
              },
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                height: 237,
                cursor: "crosshair",
              }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {fieldErrors.signature && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {fieldErrors.signature}
              </Typography>
            )}
          </Box>
          <Button 
            variant="outlined" 
            startIcon={<span>🗑️</span>}
            sx={{ 
              mt: 1,
              color: theme.palette.error.main,
              borderColor: theme.palette.error.main,
              '&:hover': {
                backgroundColor: theme.palette.error.main + '1A',
                borderColor: theme.palette.error.main,
              }
            }} 
            onClick={clearSignature}
          >
            Clear Signature
          </Button>
        </Grid>
      </Grid>

      {/* --- Submit Button --- */}
      <Box sx={{ 
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        mt: 6,
        mb: 2
      }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? null : <span>📤</span>}
          sx={{
            backgroundColor: theme.palette.primary.main,
            py: 1.75,
            px: 6,
            fontSize: '1.1rem',
            fontWeight: 500,
            minWidth: '200px',
            maxWidth: '300px',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            '&:disabled': {
              backgroundColor: theme.palette.action.disabledBackground,
            }
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
              <span>⏳</span> Submitting...
            </Box>
          ) : (
            "Submit Claim"
          )}
        </Button>
      </Box>
    </Grid>
  );

  // ========================================================================
  // Main Render
  // ========================================================================

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: isMobile ? 2 : 4, overflow: "hidden" }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 3, fontWeight: 600, color: "#0066cc" }}
          >
            Claim Form
          </Typography>

          {/* --- Status Alerts --- */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Form submitted successfully!
            </Alert>
          )}

          {/* --- Mode Tabs --- */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={uploadMode}
              onChange={(e, v) => setUploadMode(v)}
              variant="fullWidth"
            >
              <Tab
                icon={<DescriptionIcon />}
                label="Fill Form Manually"
                value="manual"
              />
              <Tab
                icon={<UploadFileIcon />}
                label="Upload PDF Form"
                value="upload"
              />
            </Tabs>
          </Box>

          {/* --- Form Body --- */}
          <Box component="form" onSubmit={handleSubmit}>
            {uploadMode === "upload"
              ? renderUploadForm()
              : renderManualForm()}
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default ClaimForm;