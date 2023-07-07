export const fetcher = async (
  ...args: [input: RequestInfo | URL, init?: RequestInit | undefined]
) => {
  const res = await fetch(...args);
  if (res.ok) {
    return res.json();
  } else {
    const error = new Error("An error occurred while fetching data");
    const data = await res.json();
    error.message = data.message;
    // @ts-expect-error
    error.status = res.status;
    throw error;
  }
};
