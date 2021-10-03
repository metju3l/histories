import { Button } from '@nextui-org/react';
import React, { useState } from 'react';

const LoadingButton: React.FC<{ func: () => void; title: string }> = ({
  func,
  title,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return isLoading ? (
    <Button loading loaderType="spinner" />
  ) : (
    <Button
      type="submit"
      onClick={async () => {
        setIsLoading(true);
        await func();
        setIsLoading(false);
      }}
    >
      {title}
    </Button>
  );
};

export default LoadingButton;
