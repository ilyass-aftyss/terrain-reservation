export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
    </div>
  );
}