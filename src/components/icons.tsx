import type { SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="6" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5L16 8" />
      <path d="m12 2 1.5 2.5L16 6l-2.5 1.5L12 10 9.5 7.5 7 6l2.5-1.5Z" />
    </svg>
  ),
};
