import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  UploadFile as UploadFileIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { claimFormAPI } from "../services/api"; // <-- your API service
import { exportClaimsToExcel } from "../utility/exportClaims";

const ClaimForm = () => {
  const [formData, setFormData] = useState({
    claimNo: "",
    customerId: "",
    claimType: "",
    amount: "",
    nominee: "",
    date: null,
    bankAccountNo: "",
    nameOfClaimant: "",
    signature: null,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [uploadMode, setUploadMode] = useState("manual");
  const [pdfFile, setPdfFile] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Set up signature canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const setCanvasSize = () => {
      const container = canvas.parentElement;
      const width = Math.min(600, container.offsetWidth - 16);
      canvas.width = width;
      canvas.height = 150;
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);
    return () => window.removeEventListener("resize", setCanvasSize);
  }, []);

  // Field validation logic
  const validateField = (field, value) => {
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
        if (!value.trim()) error = "Amount is required";
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
        if (!value) error = "Date is required";
        else if (new Date(value) > new Date())
          error = "Date cannot be in the future";
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
  };

  // Validate all fields
  const validateAllFields = () => {
    const fields = Object.keys(formData);
    const newErrors = {};
    fields.forEach((f) => (newErrors[f] = validateField(f, formData[f])));
    setFieldErrors(newErrors);
    return !Object.values(newErrors).some((e) => e);
  };

  // Handle text inputs
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

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFormData((prev) => ({ ...prev, signature: null }));
    setFieldErrors((prev) => ({ ...prev, signature: "Signature is required" }));
  };

  // Canvas drawing handlers
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
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
    const data = canvas.toDataURL();
    setFormData((prev) => ({ ...prev, signature: data }));
    setFieldErrors((prev) => ({ ...prev, signature: "" }));
    setIsDrawing(false);
  };

  // PDF Upload Handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please upload a PDF file only.");
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (uploadMode === "upload") {
      if (!pdfFile) {
        setError("Please upload a PDF file.");
        setLoading(false);
        return;
      }

      try {
        await claimFormAPI.uploadPDFForm(pdfFile);
        setSuccess(true);
      } catch (err) {
        setError("PDF upload failed.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Manual form mode
    const isValid = validateAllFields();
    if (!isValid) {
      setError("Please fix validation errors before submitting.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: format(formData.date, "yyyy-MM-dd"),
        submittedAt: new Date().toISOString(),
      };

      console.log("Submitting payload:", payload);
      await claimFormAPI.submitClaimForm(payload);

      setSuccess(true);

      setFormData({
        claimNo: "",
        customerId: "",
        claimType: "",
        amount: "",
        nominee: "",
        date: null,
        bankAccountNo: "",
        nameOfClaimant: "",
        signature: null,
      });
      setFieldErrors({});
      clearSignature();
    } catch (err) {
      console.error("API Error:", err);
      setError("Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography
            variant="h4"
            sx={{ mb: 3, fontWeight: 600, color: "#0066cc" }}
          >
            Claim Form
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {success && (
            <Alert severity="success">Form submitted successfully!</Alert>
          )}

          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={uploadMode} onChange={(e, v) => setUploadMode(v)}>
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

          <Box component="form" onSubmit={handleSubmit}>
            {uploadMode === "upload" ? (
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
                  <Typography sx={{ mt: 2 }}>{pdfFile.name}</Typography>
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
            ) : (
              <Grid container spacing={2}>
                {/* --- Input Fields --- */}
                {[
                  { label: "Claim No", name: "claimNo" },
                  { label: "Customer ID", name: "customerId" },
                  { label: "Amount", name: "amount", type: "number" },
                  { label: "Nominee", name: "nominee" },
                  { label: "Bank Account No", name: "bankAccountNo" },
                  { label: "Name of Claimant", name: "nameOfClaimant" },
                ].map((f) => (
                  <Grid item xs={12} sm={6} key={f.name}>
                    <TextField
                      fullWidth
                      label={f.label}
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleInputChange(f.name)}
                      error={!!fieldErrors[f.name]}
                      helperText={fieldErrors[f.name]}
                      type={f.type || "text"}
                    />
                  </Grid>
                ))}

                {/* Claim Type */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!fieldErrors.claimType}>
                    <InputLabel>Claim Type</InputLabel>
                    <Select
                      value={formData.claimType}
                      onChange={(e) => handleInputChange("claimType")(e)}
                    >
                      {["Health", "Life", "Accidental"].map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.claimType && (
                      <Typography variant="caption" color="error">
                        {fieldErrors.claimType}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                {/* Date */}
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Date"
                    value={formData.date}
                    onChange={handleDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!fieldErrors.date,
                        helperText: fieldErrors.date,
                      },
                    }}
                  />
                </Grid>

                {/* Signature */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Signature <span style={{ color: "red" }}>*</span>
                  </Typography>
                  {fieldErrors.signature && (
                    <Typography variant="caption" color="error">
                      {fieldErrors.signature}
                    </Typography>
                  )}
                  <Box
                    sx={{
                      border: "2px solid #ccc",
                      borderRadius: 1,
                      p: 1,
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <canvas
                      ref={canvasRef}
                      style={{
                        width: "100%",
                        height: 150,
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
                  </Box>
                  <Button
                    variant="outlined"
                    sx={{ mt: 1 }}
                    onClick={clearSignature}
                  >
                    Clear Signature
                  </Button>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12} sx={{ textAlign: "right" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ backgroundColor: "#0066cc" }}
                  >
                    {loading ? "Submitting..." : "Submit Claim"}
                  </Button>
                </Grid>
              </Grid>
            )}
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default ClaimForm;
