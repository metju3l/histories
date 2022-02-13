import IMeContext from '@lib/types/contexts/MeContext';
import React from 'react';

const MeContext = React.createContext<IMeContext>({
  data: undefined,
  loading: true,
  error: undefined,
  refetch: undefined,
});

export default MeContext;
