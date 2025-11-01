import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { claimFormAPI } from "../services/api";
import { format } from "date-fns";

const AdminDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0 for all, 1 for manual, 2 for PDFs

  // Fetch claims data (in a real app, this would come from an API)
  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real application, you would fetch from API
      // const response = await claimFormAPI.getAllClaims();
      // setClaims(response.data);

      // For now, using localStorage to get submitted forms
      const savedClaims = JSON.parse(
        localStorage.getItem("submittedClaims") || "[]"
      );
      const savedPDFs = JSON.parse(
        localStorage.getItem("submittedPDFs") || "[]"
      );

      const allClaims = [
        ...savedClaims.map((claim) => ({ ...claim, type: "manual" })),
        ...savedPDFs.map((pdf) => ({ ...pdf, type: "pdf" })),
      ];

      setClaims(
        allClaims.sort(
          (a, b) =>
            new Date(b.submittedAt || b.uploadedAt) -
            new Date(a.submittedAt || a.uploadedAt)
        )
      );
    } catch (err) {
      setError("Failed to fetch claims. Please try again.");
      console.error("Error fetching claims:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (claim) => {
    setSelectedClaim(claim);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClaim(null);
  };

  const handleDownloadPDF = (claim) => {
    if (claim.type === "pdf" && claim.fileUrl) {
      window.open(claim.fileUrl, "_blank");
    } else {
      alert("PDF download feature requires file storage integration.");
    }
  };

  const filteredClaims = claims.filter((claim) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      claim.claimNo?.toLowerCase().includes(searchLower) ||
      claim.customerId?.toLowerCase().includes(searchLower) ||
      claim.nameOfClaimant?.toLowerCase().includes(searchLower) ||
      claim.claimType?.toLowerCase().includes(searchLower) ||
      claim.fileName?.toLowerCase().includes(searchLower);

    const matchesTab =
      tabValue === 0 ||
      (tabValue === 1 && claim.type === "manual") ||
      (tabValue === 2 && claim.type === "pdf");

    return matchesSearch && matchesTab;
  });

  const paginatedClaims = filteredClaims.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusChip = (claim) => {
    const status = claim.status || "pending";
    const colors = {
      pending: "warning",
      approved: "success",
      rejected: "error",
      processing: "info",
    };
    return (
      <Chip
        label={status.toUpperCase()}
        color={colors[status] || "default"}
        size="small"
      />
    );
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 1, sm: 2 } }}
    >
      <Paper
        elevation={3}
        sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: { xs: 1, sm: 2 } }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: "#0066cc",
              fontWeight: 600,
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" },
            }}
          >
            Admin Dashboard
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchClaims}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
          >
            <Tab label={`All Claims (${claims.length})`} />
            <Tab
              label={`Manual Forms (${
                claims.filter((c) => c.type === "manual").length
              })`}
            />
            <Tab
              label={`PDF Uploads (${
                claims.filter((c) => c.type === "pdf").length
              })`}
            />
          </Tabs>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by Claim No, Customer ID, Name, or Claim Type..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{ maxWidth: { sm: 600 } }}
          />
        </Box>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Claims Table */}
        {!loading && (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Claim No</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Customer ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Claimant Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Claim Type</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Amount</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Type</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedClaims.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No claims found. Submit a claim form to see it here.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedClaims.map((claim, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          {claim.claimNo || claim.fileName || "N/A"}
                        </TableCell>
                        <TableCell>{claim.customerId || "N/A"}</TableCell>
                        <TableCell>{claim.nameOfClaimant || "N/A"}</TableCell>
                        <TableCell>{claim.claimType || "PDF Upload"}</TableCell>
                        <TableCell>
                          {claim.amount
                            ? `$${parseFloat(claim.amount).toFixed(2)}`
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {claim.date
                            ? format(new Date(claim.date), "MMM dd, yyyy")
                            : claim.uploadedAt
                            ? format(new Date(claim.uploadedAt), "MMM dd, yyyy")
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={claim.type === "manual" ? "Manual" : "PDF"}
                            color={
                              claim.type === "manual" ? "primary" : "secondary"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{getStatusChip(claim)}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(claim)}
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          {claim.type === "pdf" && (
                            <IconButton
                              size="small"
                              onClick={() => handleDownloadPDF(claim)}
                              color="secondary"
                            >
                              <DownloadIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={filteredClaims.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}

        {/* Summary Cards */}
        {!loading && claims.length > 0 && (
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Claims
                  </Typography>
                  <Typography variant="h4">{claims.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Manual Forms
                  </Typography>
                  <Typography variant="h4">
                    {claims.filter((c) => c.type === "manual").length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    PDF Uploads
                  </Typography>
                  <Typography variant="h4">
                    {claims.filter((c) => c.type === "pdf").length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Amount
                  </Typography>
                  <Typography variant="h4">
                    $
                    {claims
                      .reduce(
                        (sum, claim) => sum + (parseFloat(claim.amount) || 0),
                        0
                      )
                      .toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Claim Details</Typography>
            {selectedClaim?.type === "pdf" && (
              <Button
                startIcon={<DownloadIcon />}
                variant="outlined"
                size="small"
                onClick={() => handleDownloadPDF(selectedClaim)}
              >
                Download PDF
              </Button>
            )}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedClaim && (
            <Grid container spacing={2}>
              {selectedClaim.type === "manual" ? (
                <>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Claim No
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedClaim.claimNo || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Customer ID
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedClaim.customerId || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Claim Type
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedClaim.claimType || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedClaim.amount
                        ? `$${parseFloat(selectedClaim.amount).toFixed(2)}`
                        : "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Nominee
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedClaim.nominee || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedClaim.date
                        ? format(new Date(selectedClaim.date), "MMMM dd, yyyy")
                        : "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Bank Account No
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedClaim.bankAccountNo || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Name of Claimant
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedClaim.nameOfClaimant || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Signature
                    </Typography>
                    {selectedClaim.signature ? (
                      <Box sx={{ mt: 1 }}>
                        <img
                          src={selectedClaim.signature}
                          alt="Signature"
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                          }}
                        />
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No signature provided
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Submitted At
                    </Typography>
                    <Typography variant="body1">
                      {selectedClaim.submittedAt
                        ? format(
                            new Date(selectedClaim.submittedAt),
                            "MMMM dd, yyyy 'at' hh:mm a"
                          )
                        : "N/A"}
                    </Typography>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      File Name
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedClaim.fileName || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      File Size
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedClaim.fileSize
                        ? `${(selectedClaim.fileSize / 1024).toFixed(2)} KB`
                        : "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      File Type
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedClaim.fileType || "application/pdf"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Uploaded At
                    </Typography>
                    <Typography variant="body1">
                      {selectedClaim.uploadedAt
                        ? format(
                            new Date(selectedClaim.uploadedAt),
                            "MMMM dd, yyyy 'at' hh:mm a"
                          )
                        : "N/A"}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
