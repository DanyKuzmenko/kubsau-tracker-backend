export const sortByDate = (a: any, b: any): number => {
  if (new Date(a.date) > new Date(b.date)) {
    return 1;
  }
  if (new Date(a.date) < new Date(b.date)) {
    return -1;
  }
  return 0;
};

export const sortByName = (a: any, b: any) => {
  if (a.name > b.name) {
    return 1;
  }
  if (a.name < b.name) {
    return -1;
  }
  return 0;
};
