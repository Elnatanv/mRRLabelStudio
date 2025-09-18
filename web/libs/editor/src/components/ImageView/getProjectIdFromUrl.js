export const getProjectIdFromUrl = () => {
  const path = window.location.pathname; // e.g., "/projects/3/data"
  const match = path.match(/\/projects\/(\d+)\//);
  return match ? parseInt(match[1], 10) : null;
};
