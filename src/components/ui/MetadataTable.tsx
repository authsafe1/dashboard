import { AddCircle, Delete } from '@mui/icons-material';
import {
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import React from 'react';

interface KeyValue {
  key: string;
  value: string;
}

interface MetadataTableProps {
  isEdit?: boolean;
  metadata: KeyValue[];
  errors: {
    [index: number]: { key?: boolean; value?: boolean; message?: string };
  };
  onMetadataChange: (updatedMetadata: KeyValue[]) => void;
}

const MetadataTable: React.FC<MetadataTableProps> = ({
  isEdit,
  metadata,
  errors,
  onMetadataChange,
}) => {
  const handleAddRow = () => {
    onMetadataChange([...metadata, { key: '', value: '' }]);
  };

  const handleDeleteRow = (index: number) => {
    const updated = metadata.filter((_, i) => i !== index);
    onMetadataChange(updated);
  };

  const handleKeyChange = (index: number, newKey: string) => {
    const updated = [...metadata];
    updated[index].key = newKey;
    onMetadataChange(updated);
  };

  const handleValueChange = (index: number, newValue: string) => {
    const updated = [...metadata];
    updated[index].value = newValue;
    onMetadataChange(updated);
  };

  return (
    <TableContainer component={Card} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>Value</TableCell>
            {isEdit && <TableCell>Action</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {metadata.map((item, index) =>
            isEdit ? (
              <TableRow key={`metadata-row-editable-${index}`}>
                <TableCell>
                  <TextField
                    fullWidth
                    variant="standard"
                    value={item.key}
                    onChange={(e) => handleKeyChange(index, e.target.value)}
                    placeholder="Enter key"
                    disabled={!isEdit}
                    error={!!errors[index]?.key}
                    helperText={
                      errors[index]?.key
                        ? errors[index]?.message || 'Key is required'
                        : null
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    variant="standard"
                    value={item.value}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                    placeholder="Enter value"
                    disabled={!isEdit}
                    error={!!errors[index]?.value}
                    helperText={
                      errors[index]?.value
                        ? errors[index]?.message || 'Value is required'
                        : null
                    }
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => handleDeleteRow(index)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow key={`metadata-row-${index}`}>
                <TableCell>{item.key}</TableCell>
                <TableCell>{item.value}</TableCell>
              </TableRow>
            ),
          )}
          {isEdit && (
            <TableRow>
              <TableCell colSpan={3} align="center">
                <Tooltip title="Add key value pair">
                  <IconButton onClick={handleAddRow}>
                    <AddCircle />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MetadataTable;
