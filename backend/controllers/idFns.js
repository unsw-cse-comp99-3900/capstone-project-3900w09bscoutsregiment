export const validIdString = (id) => {
  if (!(typeof id === 'string' || id instanceof String)) {
    return false;
  }
  const regex = /^[0-9A-Fa-f]{24}$/;
  if (!regex.test(id)) {
    return false;
  }
  return true;
};
