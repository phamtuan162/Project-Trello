export const mapOrder = (originalArray, orderArray, key) => {
  if (!originalArray || !orderArray || !key) return [];
  return [...originalArray].sort(
    (a, b) => orderArray.indexOf(a[key]) - orderArray.indexOf(b[key])
  );
};

export const sortCardFunctions = {
  name: (a, b) => a.title.localeCompare(b.title),
  endDateTime: (a, b) => {
    if (a.endDateTime && b.endDateTime)
      return new Date(a.endDateTime) - new Date(b.endDateTime);
    return a.endDateTime
      ? -1
      : b.endDateTime
      ? 1
      : a.title.localeCompare(b.title);
  },
  createdAtAsc: (a, b) => new Date(a.created_at) - new Date(b.created_at),
  createdAtDesc: (a, b) => new Date(b.created_at) - new Date(a.created_at),
};
