import fetch from 'node-fetch';

const request = async (path, options = {}) => {
  const {
    headers,
    query = null,
    method = "GET",
    host = "https://opentdb.com",
    ...extraOpts
  } = options;

  const reqOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...extraOpts,
  };

  let queryString = "";
  
  if (query) {
    // Convert to encoded string and prepend with ?
    queryString = new URLSearchParams(query).toString();
    queryString = queryString && `?${queryString}`;
  }

  const response = await fetch(`${host}${path}${queryString}`, reqOptions);
  return await response.json();
};

export default request;
