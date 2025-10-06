export const Card = ({ children, className }) => (
  <div className={`bg-white shadow rounded p-4 ${className}`}>{children}</div>
);

export const CardContent = ({ children, className }) => (
  <div className={`mb-2 ${className}`}>{children}</div>
);
