// components/ui/MarsButton.tsx

export default function MarsButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="bg-slate-800 hover:bg-marsRed text-white px-4 py-2 rounded-xl transition duration-300 shadow-md hover:shadow-mars"
    >
      {children}
    </button>
  );
}
