const ParseUrls = (urlsString: string): Array<string> => {
  return JSON.parse(urlsString.replace(/'/gm, '"'));
};

export default ParseUrls;
