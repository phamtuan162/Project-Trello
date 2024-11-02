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

export const interceptorLoadingElements = (calling) => {
  // DOM lấy ra toàn bộ phần tử trên page hiện tại có className là 'interceptor-loading'
  const elements = document.querySelectorAll(".interceptor-loading");

  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      // // Lưu trữ nội dung ban đầu vào data-attribute chỉ nếu chưa lưu
      // if (!elements[i].dataset.originalContent) {
      //   elements[i].dataset.originalContent = elements[i].innerHTML;
      // }

      // elements[i].innerHTML = ""; // Xóa nội dung cũ

      // // Tạo và thêm CircularProgress
      // const circularProgressContainer = document.createElement("div");
      // circularProgressContainer.classList.add("circular-progress-container");

      // ReactDOM.render(
      //   <CircularProgress size="sm" />,
      //   circularProgressContainer
      // );

      // // Thêm circularProgressContainer vào phần tử
      // elements[i].appendChild(circularProgressContainer);

      elements[i].style.opacity = "0.5";
      elements[i].style.pointerEvents = "none";
    } else {
      // Khôi phục trạng thái ban đầu
      elements[i].style.opacity = "initial";
      elements[i].style.pointerEvents = "initial";
    }
  }
};
