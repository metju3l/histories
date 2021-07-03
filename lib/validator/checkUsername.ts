const CheckUsername = (username: string) => {
  const regex = new RegExp(
    '^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$'
  );
  return regex.test(username);
};

export default CheckUsername;
