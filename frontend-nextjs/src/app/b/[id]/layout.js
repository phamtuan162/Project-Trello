import BoardNavbar from "./_components/BoardNavbar";

export default function BoardLayout({ children }) {
  const board = {
    id: 1,
    title: "Tiêu đề 1",
  };
  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center "
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1673975165266-018393e0b0c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NjQyOTF8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MDc0NDcxOTV8&ixlib=rb-4.0.3&q=80&w=200|https://images.unsplash.com/photo-1673975165266-018393e0b0c7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1NjQyOTF8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MDc0NDcxOTV8&ixlib=rb-4.0.3&q=85|https://unsplash.com/photos/a-man-riding-skis-on-top-of-a-snow-covered-slope-VpjOYdf6-nE|eberhard)`,
      }}
    >
      <BoardNavbar data={board} />
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative pt-28 h-full">{children}</div>
    </div>
  );
}
