export const capitalizeFirstLetter = (val) => {
  if (!val) return "";
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`;
};

export const generatePlaceholderCard = (column) => {
  return (
    column && {
      id: `${column.id}-placeholder-card`,
      column_id: column.id,
      FE_PlaceholderCard: true,
    }
  );
};
