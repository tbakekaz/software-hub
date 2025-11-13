export function Logo({ className = "size-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"
        fill="currentColor"
      />
    </svg>
  );
}

