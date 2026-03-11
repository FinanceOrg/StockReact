// app/(app)/loading.tsx

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="h-16 w-16 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
    </div>
  );
}
