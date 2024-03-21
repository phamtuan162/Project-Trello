const Auth = ({ children }) => {
  return (
    <div
      className="fixed inset-0 flex items-center h-full bg-no-repeat bg-cover bg-center 	justify-center"
      style={{
        zIndex: "999",
        background: "white",
        backgroundImage:
          "url(https://img.freepik.com/free-vector/realistic-design-technology-background_23-2148426705.jpg?w=826&t=st=1708676791~exp=1708677391~hmac=86502f0e359af9574ee7a7626db0f62b5bdb7800ffd4a24e471c2dc76f5cf869)",
      }}
    >
      <div className="">{children}</div>
    </div>
  );
};
export default Auth;
