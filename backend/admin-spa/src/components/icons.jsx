export function IconEdit() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 1.5l3 3L5 14H2v-3l9.5-9.5z"/>
    </svg>
  );
}

export function IconDelete() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h12M5 4V2.5a1 1 0 011-1h4a1 1 0 011 1V4M13 4v9.5a1 1 0 01-1 1H4a1 1 0 01-1-1V4M6.5 7v5M9.5 7v5"/>
    </svg>
  );
}

export function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M7 1v12M1 7h12"/>
    </svg>
  );
}

export function IconSort({ dir }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {dir === "asc" ? (
        <path d="M7 11V3M3 7l4-4 4 4"/>
      ) : (
        <path d="M7 3v8M3 7l4 4 4-4"/>
      )}
    </svg>
  );
}

export function IconLink() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8a3 3 0 004 4l2-2a3 3 0 000-4M9 6a3 3 0 00-4-4L3 4a3 3 0 000 4"/>
    </svg>
  );
}

export function IconClose() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 4l8 8M12 4l-8 8"/>
    </svg>
  );
}
