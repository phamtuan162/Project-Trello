export function ListHeader({ column }) {
  return (
    <div className="mx-2 px-2 py-1">
      <span>{column.title}</span>
    </div>
  );
}
