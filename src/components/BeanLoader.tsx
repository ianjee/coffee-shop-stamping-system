export default function BeanLoader({ size = 56, label }: { size?: number; label?: string }) {
  return (
    <span className="bean-loader" role="status" aria-live="polite">
      <svg className="bean-svg" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
        <g transform="rotate(-30 24 24)">
          <ellipse cx="24" cy="24" rx="12" ry="18" fill="currentColor" />
          <path d="M24 7c-6 7 6 11 0 17s6 11 0 17" fill="none" stroke="var(--cream)" strokeWidth="2.6" strokeLinecap="round" />
        </g>
      </svg>
      <span className="bean-shadow" aria-hidden="true" />
      <span className={label ? "bean-label" : "sr-only"}>{label ?? "Loading"}</span>
    </span>
  );
}
