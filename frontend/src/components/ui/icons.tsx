import React from "react";

export const IconPhone: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M6.6 10.2a15 15 0 006.2 6.2l1.8-1.8a1 1 0 01.9-.25 11.2 11.2 0 003.5.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h2.4a1 1 0 011 1 11.2 11.2 0 00.6 3.5 1 1 0 01-.25.9L6.6 10.2z" fill="currentColor"/>
  </svg>
);

export const IconEnvelope: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M3 8l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const IconMap: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 2C8.686 2 6 5 6 8.5 6 13.25 12 20 12 20s6-6.75 6-11.5C18 5 15.314 2 12 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="8.5" r="1.5" fill="currentColor"/>
  </svg>
);

export const IconCart: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M6 6h15l-1.5 9h-12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="10" cy="20" r="1" fill="currentColor"/>
    <circle cx="18" cy="20" r="1" fill="currentColor"/>
  </svg>
);
