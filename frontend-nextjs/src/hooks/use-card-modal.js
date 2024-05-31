// import { createContext, useContext, useState } from "react";

// // Create a Context for the modal
// const CardModalContext = createContext();

// export const useCardModal = () => {
//   return useContext(CardModalContext);
// };

// export const CardModalProvider = ({ children }) => {
//   const [modalState, setModalState] = useState({
//     id: undefined,
//     isOpen: false,
//   });

//   const onOpen = (id) => {
//     setModalState({ id, isOpen: true });
//   };

//   const onClose = () => {
//     setModalState({ id: undefined, isOpen: false });
//   };

//   return (
//     <CardModalContext.Provider value={{ ...modalState, onOpen, onClose }}>
//       {children}
//     </CardModalContext.Provider>
//   );
// };

import { create } from "zustand";

const useCardModal = create((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));

export default useCardModal;
