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
import { UploadFile as UploadFileIcon, Description as DescriptionIcon } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

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

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [uploadMode, setUploadMode] = useState("manual"); // "manual" or "upload"
  const [pdfFile, setPdfFile] = useState(null);
  const fileInputRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const claimTypes = [
    "Health Insurance",
    "Life Insurance",
    "Vehicle Insurance",
    "Travel Insurance",
    "Property Insurance",
    "Other",
  ];

  // Initialize canvas context and handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      // Set canvas size based on container
      const setCanvasSize = () => {
        const container = canvas.parentElement;
        if (container) {
          const maxWidth = Math.min(600, container.offsetWidth - 16);
          canvas.width = maxWidth;
          canvas.height = Math.max(150, maxWidth * 0.33);
          
          // Reinitialize context after resize
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
        }
      };
      
      setCanvasSize();
      window.addEventListener("resize", setCanvasSize);
      
      return () => {
        window.removeEventListener("resize", setCanvasSize);
      };
    }
  }, []);

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleDateChange = (newDate) => {
    setFormData({
      ...formData,
      date: newDate,
    });
  };

  const useTodayDate = () => {
    setFormData({
      ...formData,
      date: new Date(),
    });
  };

  // Get coordinates from event (supports both mouse and touch)
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (e.touches && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Signature Canvas Handlers
  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const coords = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const coords = getCoordinates(e);
    
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (e) e.preventDefault();
    if (isDrawing) {
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL();
      setFormData({
        ...formData,
        signature: dataURL,
      });
    }
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFormData({
      ...formData,
      signature: null,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        setPdfFile(file);
      } else {
        alert("Please upload a PDF file only.");
        e.target.value = "";
      }
    }
  };

  const handleRemoveFile = () => {
    setPdfFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (uploadMode === "upload") {
      if (!pdfFile) {
        alert("Please upload a PDF file.");
        return;
      }
      console.log("PDF File:", pdfFile);
      // Handle PDF upload submission here
      alert("PDF form submitted successfully!");
    } else {
      console.log("Form Data:", formData);
      // Handle form submission here
      alert("Claim form submitted successfully!");
    }
  };

  const handleTabChange = (event, newValue) => {
    setUploadMode(newValue);
    setPdfFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container 
        maxWidth="md" 
        sx={{ 
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1, sm: 2 },
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: { xs: 1, sm: 2 },
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ 
              mb: { xs: 2, sm: 3 },
              color: "#0066cc",
              fontWeight: 600,
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Claim Form
          </Typography>

          {/* Mode Selection Tabs */}
          <Box 
            sx={{ 
              borderBottom: 1, 
              borderColor: "divider", 
              mb: { xs: 2, sm: 3 },
              overflowX: "auto",
            }}
          >
            <Tabs
              value={uploadMode}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  minWidth: { xs: 120, sm: 160 },
                  px: { xs: 1, sm: 2 },
                },
              }}
            >
              <Tab 
                label="Fill Form Manually" 
                value="manual" 
                icon={<DescriptionIcon />} 
                iconPosition="start"
                sx={{ flexDirection: { xs: "column", sm: "row" }, gap: { xs: 0.5, sm: 1 } }}
              />
              <Tab 
                label="Upload PDF Form" 
                value="upload" 
                icon={<UploadFileIcon />} 
                iconPosition="start"
                sx={{ flexDirection: { xs: "column", sm: "row" }, gap: { xs: 0.5, sm: 1 } }}
              />
            </Tabs>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            {uploadMode === "upload" ? (
              // PDF Upload Section
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12}>
                  <Alert 
                    severity="info" 
                    sx={{ 
                      mb: { xs: 2, sm: 3 },
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    Please upload a PDF file containing your claim form with the following fields: Claim No, Customer ID, Claim Type, Amount, Nominee, Date, Bank Account No, and Name of Claimant.
                  </Alert>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      border: "2px dashed #ccc",
                      borderRadius: { xs: 1, sm: 2 },
                      p: { xs: 2, sm: 3, md: 4 },
                      textAlign: "center",
                      backgroundColor: "#fafafa",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#0066cc",
                        backgroundColor: "#f5f8ff",
                      },
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      id="pdf-upload-input"
                    />
                    <label htmlFor="pdf-upload-input">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<UploadFileIcon />}
                        fullWidth={false}
                        sx={{
                          mb: { xs: 1.5, sm: 2 },
                          py: { xs: 1, sm: 1.5 },
                          px: { xs: 2, sm: 3 },
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                        }}
                      >
                        {pdfFile ? "Change PDF File" : "Choose PDF File"}
                      </Button>
                    </label>
                    {pdfFile && (
                      <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
                        <Typography 
                          variant="body1" 
                          color="text.secondary"
                          sx={{
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                            wordBreak: "break-word",
                          }}
                        >
                          Selected file: <strong>{pdfFile.name}</strong>
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ 
                            display: "block", 
                            mt: 1,
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          }}
                        >
                          File size: {(pdfFile.size / 1024).toFixed(2)} KB
                        </Typography>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={handleRemoveFile}
                          sx={{ 
                            mt: { xs: 1.5, sm: 2 },
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          }}
                        >
                          Remove File
                        </Button>
                      </Box>
                    )}
                    {!pdfFile && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mt: { xs: 1.5, sm: 2 },
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        Click the button above to select a PDF file
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box 
                    sx={{ 
                      display: "flex", 
                      justifyContent: { xs: "center", sm: "flex-end" }, 
                      gap: { xs: 1.5, sm: 2 }, 
                      mt: { xs: 1, sm: 2 },
                      flexDirection: { xs: "column-reverse", sm: "row" },
                    }}
                  >
                    <Button 
                      variant="outlined" 
                      onClick={handleRemoveFile}
                      fullWidth={isMobile}
                      sx={{
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!pdfFile}
                      fullWidth={isMobile}
                      sx={{
                        backgroundColor: "#0066cc",
                        "&:hover": {
                          backgroundColor: "#0052a3",
                        },
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      Submit PDF
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              // Manual Form Section
              <Grid container spacing={{ xs: 2, sm: 3 }}>
              {/* Claim No */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Claim No"
                  required
                  value={formData.claimNo}
                  onChange={handleInputChange("claimNo")}
                  variant="outlined"
                />
              </Grid>

              {/* Customer ID */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Customer ID"
                  required
                  value={formData.customerId}
                  onChange={handleInputChange("customerId")}
                  variant="outlined"
                />
              </Grid>

              {/* Claim Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Claim Type</InputLabel>
                  <Select
                    value={formData.claimType}
                    onChange={handleInputChange("claimType")}
                    label="Claim Type"
                  >
                    {claimTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Amount */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  required
                  value={formData.amount}
                  onChange={handleInputChange("amount")}
                  variant="outlined"
                  inputProps={{ min: 0, step: "0.01" }}
                />
              </Grid>

              {/* Nominee */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nominee"
                  required
                  value={formData.nominee}
                  onChange={handleInputChange("nominee")}
                  variant="outlined"
                />
              </Grid>

              {/* Date */}
              <Grid item xs={12} md={6}>
                <Box 
                  sx={{ 
                    display: "flex", 
                    gap: { xs: 1, sm: 1.5 }, 
                    alignItems: "flex-start",
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Box sx={{ flex: 1, width: "100%" }}>
                    <DatePicker
                      label="Date"
                      value={formData.date}
                      onChange={handleDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          size: "medium",
                        },
                      }}
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={useTodayDate}
                    sx={{ 
                      mt: { xs: 1, sm: 0.5 },
                      whiteSpace: "nowrap",
                      width: { xs: "100%", sm: "auto" },
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    Use Today
                  </Button>
                </Box>
              </Grid>

              {/* Bank Account No */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Bank Account No"
                  required
                  value={formData.bankAccountNo}
                  onChange={handleInputChange("bankAccountNo")}
                  variant="outlined"
                  inputProps={{ pattern: "[0-9]*" }}
                />
              </Grid>

              {/* Name of Claimant */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name of Claimant"
                  required
                  value={formData.nameOfClaimant}
                  onChange={handleInputChange("nameOfClaimant")}
                  variant="outlined"
                />
              </Grid>

              {/* Signature */}
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle1" 
                  gutterBottom 
                  sx={{ 
                    mb: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "1rem", sm: "1.125rem" },
                    fontWeight: 500,
                  }}
                >
                  Signature <span style={{ color: "red" }}>*</span>
                </Typography>
                <Box
                  sx={{
                    border: "2px solid #ccc",
                    borderRadius: { xs: 1, sm: 2 },
                    p: { xs: 0.5, sm: 1 },
                    backgroundColor: "#fff",
                    overflow: "hidden",
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    style={{
                      border: "1px solid #ddd",
                      cursor: "crosshair",
                      display: "block",
                      width: "100%",
                      maxWidth: "100%",
                      height: "auto",
                      touchAction: "none",
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
                <Box 
                  sx={{ 
                    mt: { xs: 1, sm: 1.5 },
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: { xs: 1, sm: 2 },
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={clearSignature}
                    sx={{ 
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    Clear Signature
                  </Button>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    Please sign above using your mouse, touchpad, or touchscreen
                  </Typography>
                </Box>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    display: "flex", 
                    justifyContent: { xs: "center", sm: "flex-end" }, 
                    gap: { xs: 1.5, sm: 2 }, 
                    mt: { xs: 1, sm: 2 },
                    flexDirection: { xs: "column-reverse", sm: "row" },
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => {
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
                      clearSignature();
                    }}
                    fullWidth={isMobile}
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth={isMobile}
                    sx={{
                      backgroundColor: "#0066cc",
                      "&:hover": {
                        backgroundColor: "#0052a3",
                      },
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  >
                    Submit Claim
                  </Button>
                </Box>
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

