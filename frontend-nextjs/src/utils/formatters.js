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

export const generateActivityMessage = (activity, from) => {
  const { action, title, desc } = activity;
  switch (action) {
    case "create":
      return `đã thêm thẻ này ${desc}`;
    case "assign_user":
      return `${desc} thẻ này`;
    case "un_assign_user":
      return `${desc} thẻ này`;
    case "date_card":
      return `${desc}`;
    case "status_card":
      return `${desc}`;
    default:
      return `${desc}`;
  }
};
