export const omit = (
  obj: any = {},
  fields: string[] = [],
): { [key: string]: any } => {
  const shallowCopy = { ...obj };
  fields.forEach(key => {
    delete shallowCopy[key];
  });
  return shallowCopy;
};

export const noop = (..._args: any[]): void => {};
