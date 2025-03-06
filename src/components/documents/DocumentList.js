import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Delete,
  Edit,
  Visibility,
  CloudUpload,
} from '@mui/icons-material';

const DocumentList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Mock data - replace with actual API call
  const documents = [
    {
      id: '1',
      title: 'Study Protocol',
      category: 'Essential Documents',
      version: '1.0',
      uploadDate: '2024-03-15',
      status: 'Active',
    },
    // Add more mock documents
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Document Management</Typography>
        <Button
          variant="contained"
          startIcon={<CloudUpload />}
          onClick={() => {/* Handle upload */}}
        >
          Upload Document
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>{doc.category}</TableCell>
                  <TableCell>{doc.version}</TableCell>
                  <TableCell>{doc.uploadDate}</TableCell>
                  <TableCell>{doc.status}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => {/* Handle view */}}>
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" onClick={() => {/* Handle edit */}}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" onClick={() => {/* Handle delete */}}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={documents.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </Box>
  );
};

export default DocumentList; 