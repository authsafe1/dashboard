import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import debounce from 'lodash/debounce'; // Import debounce
import React, {
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useOrganization } from '~/context/OrganizationContext';

export interface Permission {
  id: string;
  name: string;
  key: string;
  description: string;
}

interface PermissionPickerProps {
  onPermissionSelect: (resource: Permission | Permission[] | null) => void;
  required?: boolean;
  error?: boolean;
  helperText?: ReactNode;
  multiple?: boolean;
  value?: any;
}

const PermissionPicker: React.FC<PermissionPickerProps> = ({
  onPermissionSelect,
  required,
  error,
  helperText,
  multiple,
  value,
}) => {
  const [options, setOptions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState('');

  const { organization } = useOrganization();

  const fetchPermissions = useCallback(
    async (query: string, page: number) => {
      setLoading(true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/permission/all`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              skip: page * 10,
              take: 10,
              where: query
                ? {
                    OR: [
                      { name: { contains: query, mode: 'insensitive' } },
                      { key: { contains: query, mode: 'insensitive' } },
                    ],
                    organizationId: organization?.id,
                  }
                : {},
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();

          setOptions((prevOptions) => {
            const newOptions = [...prevOptions, ...data];

            if (data.length < 10) setHasMore(false);

            return newOptions;
          });
        } else {
          console.error('Failed to fetch permissions');
        }
      } catch (err) {
        console.error('Error fetching permissions:', err);
      } finally {
        setLoading(false);
      }
    },
    [page, query, organization?.id],
  );

  useEffect(() => {
    if (open && hasMore) {
      fetchPermissions(query, page);
    }
  }, [open, page, query, hasMore, fetchPermissions]);

  const handleInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      setOptions([]);
      setPage(0);
      setHasMore(true);
      setQuery(inputValue);
    },
    300,
  );

  const handleScroll = (event: React.SyntheticEvent) => {
    const bottomReached =
      event.currentTarget.scrollHeight - event.currentTarget.scrollTop ===
      event.currentTarget.clientHeight;

    if (bottomReached && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Autocomplete
      open={open}
      multiple={multiple}
      value={value}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onInputChange={handleInputChange as any}
      options={options}
      getOptionLabel={(option) => option.name}
      filterOptions={(x) => x}
      loading={loading}
      disableCloseOnSelect={multiple}
      onChange={(_, selectedPermission) =>
        onPermissionSelect(selectedPermission)
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={multiple ? 'Permissions' : 'Permission'}
          variant="outlined"
          required={required}
          placeholder={params.InputProps.startAdornment ? '' : 'Select options'}
          error={error}
          fullWidth
          helperText={error ? helperText : ''}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            },
            inputLabel: {
              shrink: true,
            },
          }}
        />
      )}
      slotProps={{
        listbox: {
          onScroll: handleScroll,
        },
      }}
    />
  );
};

export default PermissionPicker;
