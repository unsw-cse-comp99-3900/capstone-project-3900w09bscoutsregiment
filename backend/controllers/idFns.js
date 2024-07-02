
export const validIdString = (id) => {
  if (!(typeof id === 'string' || id instanceof String)) {
    console.log('not string');
    return false;
  }
  const regex = /^[0-9A-Fa-f]{24}$/;
  if (!regex.test(id)) {
    console.log('failed regex');
    return false;
  }
  return true;
};
