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
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { exportClaimsToExcel } from "../utility/exportClaims";

const AdminDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [mainTab, setMainTab] = useState(0); // NEW: main tabs (Dashboard / Table)

  // Dummy Data
  const generateDummyClaims = () => [
    {
      claimNo: "CLM001",
      customerId: "CUST001",
      nameOfClaimant: "John Doe",
      claimType: "Health",
      amount: "2500",
      date: "2025-10-20",
      type: "manual",
      status: "approved",
    },
    {
      claimNo: "CLM002",
      customerId: "CUST002",
      nameOfClaimant: "Jane Smith",
      claimType: "Accident",
      amount: "5000",
      date: "2025-10-22",
      type: "manual",
      status: "pending",
    },
    {
      claimNo: "CLM003",
      customerId: "CUST003",
      nameOfClaimant: "Robert Brown",
      claimType: "Life",
      amount: "7500",
      uploadedAt: "2025-10-23",
      type: "pdf",
      fileName: "LifeClaim_003.pdf",
      fileUrl: "#",
      status: "processing",
    },
    {
      claimNo: "CLM004",
      customerId: "CUST004",
      nameOfClaimant: "Alice Johnson",
      claimType: "Health",
      amount: "1200",
      uploadedAt: "2025-10-28",
      type: "pdf",
      fileName: "HealthClaim_004.pdf",
      fileUrl: "#",
      status: "rejected",
    },
    {
      claimNo: "CLM005",
      customerId: "CUST005",
      nameOfClaimant: "Michael Green",
      claimType: "Property",
      amount: "3000",
      date: "2025-10-29",
      type: "manual",
      status: "approved",
    },
  ];

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = () => {
    setLoading(true);
    setTimeout(() => {
      setClaims(generateDummyClaims());
      setLoading(false);
    }, 800);
  };

  const filteredClaims = claims.filter((claim) => {
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      claim.claimNo?.toLowerCase().includes(s) ||
      claim.customerId?.toLowerCase().includes(s) ||
      claim.nameOfClaimant?.toLowerCase().includes(s) ||
      claim.claimType?.toLowerCase().includes(s) ||
      claim.fileName?.toLowerCase().includes(s);
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

  // Charts Data
  const typeData = [
    {
      name: "Manual Forms",
      value: claims.filter((c) => c.type === "manual").length,
    },
    {
      name: "PDF Uploads",
      value: claims.filter((c) => c.type === "pdf").length,
    },
  ];

  const amountOverTime = claims.map((c) => ({
    date: format(new Date(c.date || c.uploadedAt), "MMM dd"),
    amount: parseFloat(c.amount) || 0,
  }));

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2, #42a5f5)",
          color: "white",
          borderRadius: 3,
          p: 4,
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Monitor claims, financial summaries, and performance metrics
        </Typography>
      </Box>

      {/* Main Tabs */}
      <Tabs
        value={mainTab}
        onChange={(e, val) => setMainTab(val)}
        sx={{ mb: 3 }}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Dashboard Overview" />
        <Tab label="Claims Table" />
      </Tabs>

      {/* ---- DASHBOARD OVERVIEW TAB ---- */}
      {mainTab === 0 && (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              {
                title: "Total Claims",
                value: claims.length,
                color: "#1976d2",
              },
              {
                title: "Manual Forms",
                value: claims.filter((c) => c.type === "manual").length,
                color: "#2e7d32",
              },
              {
                title: "PDF Uploads",
                value: claims.filter((c) => c.type === "pdf").length,
                color: "#6a1b9a",
              },
              {
                title: "Total Amount",
                value: `$${claims
                  .reduce(
                    (sum, claim) => sum + (parseFloat(claim.amount) || 0),
                    0
                  )
                  .toFixed(2)}`,
                color: "#ef6c00",
              },
            ].map((card, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  sx={{
                    background: `${card.color}20`,
                    borderLeft: `6px solid ${card.color}`,
                    transition: "0.3s",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ color: card.color, fontWeight: 600 }}
                    >
                      {card.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Charts */}
          <Grid container spacing={3} sx={{ mx: -3 }}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: 3, height: 420, ml: '100px' }}>
                <Typography variant="h6" gutterBottom>
                  Claims by Type
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={typeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1976d2" barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: 3, height: 420, ml: '100px' }}>
                <Typography variant="h6" gutterBottom>
                  Claims Over Time
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={amountOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#ef6c00"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* ---- CLAIMS TABLE TAB ---- */}
      {mainTab === 1 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={(e, val) => setTabValue(val)}
              sx={{ minHeight: 44 }}
            >
              <Tab label={`All (${claims.length})`} />
              <Tab
                label={`Manual (${
                  claims.filter((c) => c.type === "manual").length
                })`}
              />
              <Tab
                label={`PDFs (${
                  claims.filter((c) => c.type === "pdf").length
                })`}
              />
            </Tabs>

            <Button
              variant="contained"
              color="primary"
              startIcon={<DownloadIcon />}
              onClick={() => exportClaimsToExcel(claims)}
            >
              Export
            </Button>
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchClaims}
              disabled={loading}
              variant="outlined"
            >
              Refresh
            </Button>
          </Box>

          <TextField
            fullWidth
            placeholder="Search by Claim No, Customer ID, or Claim Type..."
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
            sx={{ mb: 3 }}
          />

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table sx={{ borderRadius: 2, overflow: "hidden" }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      {[
                        "Claim No",
                        "Customer ID",
                        "Claim Type",
                        "Amount",
                        "Date",
                        "Type",
                        "Status",
                        "Actions",
                      ].map((head) => (
                        <TableCell key={head} sx={{ fontWeight: 600 }}>
                          {head}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedClaims.length ? (
                      paginatedClaims.map((c, i) => (
                        <TableRow
                          key={i}
                          hover
                          sx={{
                            "&:nth-of-type(odd)": {
                              backgroundColor: "#fafafa",
                            },
                          }}
                        >
                          <TableCell>
                            {c.claimNo || c.fileName || "N/A"}
                          </TableCell>
                          <TableCell>{c.customerId || "N/A"}</TableCell>
                          <TableCell>{c.claimType || "PDF Upload"}</TableCell>
                          <TableCell>
                            {c.amount
                              ? `$${parseFloat(c.amount).toFixed(2)}`
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {c.date
                              ? format(new Date(c.date), "MMM dd, yyyy")
                              : c.uploadedAt
                              ? format(new Date(c.uploadedAt), "MMM dd, yyyy")
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={c.type === "manual" ? "Manual" : "PDF"}
                              color={
                                c.type === "manual" ? "primary" : "secondary"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{getStatusChip(c)}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                setSelectedClaim(c);
                                setOpenDialog(true);
                              }}
                              color="primary"
                            >
                              <VisibilityIcon />
                            </IconButton>
                            {c.type === "pdf" && (
                              <IconButton
                                color="secondary"
                                onClick={() => window.open(c.fileUrl, "_blank")}
                              >
                                <DownloadIcon />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          No records found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filteredClaims.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) =>
                  setRowsPerPage(parseInt(e.target.value, 10))
                }
              />
            </>
          )}
        </Paper>
      )}

      {/* Claim Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Claim Details</DialogTitle>
        <DialogContent dividers>
          {selectedClaim ? (
            Object.entries(selectedClaim).map(([key, val]) => (
              <Box key={key} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {key}
                </Typography>
                <Typography>{String(val) || "N/A"}</Typography>
              </Box>
            ))
          ) : (
            <Typography>No details available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
