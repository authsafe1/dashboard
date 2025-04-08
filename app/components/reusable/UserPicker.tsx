import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import debounce from 'lodash/debounce'; // Import debounce
import React, {
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useOrganization } from '~/context/organization-context';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserPickerProps {
  onUserSelect: (user: User | null) => void;
  required?: boolean;
  error?: boolean;
  helperText?: ReactNode;
}

const UserPicker: React.FC<UserPickerProps> = ({
  onUserSelect,
  required,
  error,
  helperText,
}) => {
  const [options, setOptions] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState('');

  const { organization } = useOrganization();

  const fetchUsers = useCallback(
    async (query: string, page: number) => {
      setLoading(true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/admin/user/all`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              skip: page * 10, // Pagination: 10 users per page
              take: 10, // Fetch 10 users per page
              where: query
                ? {
                    OR: [
                      { name: { contains: query, mode: 'insensitive' } },
                      { email: { contains: query, mode: 'insensitive' } },
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

            // Check if more data is available
            if (data.length < 10) setHasMore(false);

            return newOptions;
          });
        } else {
          console.error('Failed to fetch users');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    },
    [page, query, organization?.id],
  );

  // Fetch users when page or query changes
  useEffect(() => {
    if (open && hasMore) {
      fetchUsers(query, page);
    }
  }, [open, page, query, hasMore, fetchUsers]);

  // Handle user input for searching, debounced to avoid spamming the API
  const handleInputChange = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      setOptions([]); // Clear previous options
      setPage(0); // Reset page number
      setHasMore(true); // Enable loading more users
      setQuery(inputValue); // Set new query which triggers fetch
    },
    300,
  ); // 300ms debounce for efficiency

  // Infinite scroll loading handler
  const handleScroll = (event: React.SyntheticEvent) => {
    const bottomReached =
      event.currentTarget.scrollHeight - event.currentTarget.scrollTop ===
      event.currentTarget.clientHeight;

    if (bottomReached && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1); // Load next page
    }
  };

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onInputChange={handleInputChange as any}
      options={options}
      getOptionLabel={(option) => option.name}
      filterOptions={(x) => x}
      loading={loading}
      onChange={(_, selectedUser) => onUserSelect(selectedUser)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select a user"
          variant="outlined"
          placeholder={params.InputProps.startAdornment ? '' : 'Select options'}
          required={required}
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
          }}
        />
      )}
      ListboxProps={{
        onScroll: handleScroll, // Attach scroll handler for infinite scroll
      }}
    />
  );
};

export default UserPicker;
