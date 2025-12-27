export const guard = (context: any) => {
  const { isAuthorized, error, set } = context;
  if (!isAuthorized) {
    if (typeof error === 'function') {
        return error(401, 'Unauthorized');
    }
    set.status = 401;
    return 'Unauthorized';
  }
};
