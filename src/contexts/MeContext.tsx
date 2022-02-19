import IMeContext from '@src/types/contexts/MeContext';
import React from 'react';

const MeContext = React.createContext<IMeContext>({
  isLoggedIn: false,
  me: undefined,
  data: undefined,
  loading: true,
  error: undefined,
  refetch: undefined,
});

export default MeContext;
