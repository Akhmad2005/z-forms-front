import { createSlice, createAsyncThunk  } from '@reduxjs/toolkit';
import { fetchServer } from '@/utilities/functions/fetchServer';

export const fetchUser = createAsyncThunk('me/fetchUser', async (userId: string) => {
  const data = await fetchServer({
    endpoint: '/me',
  });
  return {
    name: 'test',
    role: 'admin'
  };
});

interface UserState {
  user: { [key: string]: any } | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const meSlice = createSlice({
  name: 'me',
  initialState, 
  reducers: {
   setUser: (state, actions) => { 
    const { payload } = actions;
    state.user = payload;
   },
  },
  extraReducers: (builder) => {
   builder
     .addCase(fetchUser.pending, (state) => {
       state.loading = true;
       state.error = null;
     })
     .addCase(fetchUser.fulfilled, (state, action) => {
       state.loading = false;
       state.user = action.payload;
     })
     .addCase(fetchUser.rejected, (state, action) => {
       state.loading = false;
       state.error = action.error.message || "Undefined error";
     });
   }
});

export const { setUser } = meSlice.actions;
export default meSlice.reducer;