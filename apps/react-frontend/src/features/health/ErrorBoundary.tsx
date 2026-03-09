// // apps/react-frontend/src/features/health/ErrorBoundary.tsx

// import { StatusDot } from "../../components/ui/StatusDot";

// export function ErrorBoundary({ children }) {
//   let error = undefined;
//   try {
//     return children;
//   } catch (e) {
//     error = e;
//   }

//   return (
//     <div className="flex items-center">
//       <StatusDot status="error" />
//       <span className="text-red-600">
//         Error: {error?.message || "Something went wrong"}
//       </span>
//     </div>
//   );
// }

import { ReactNode } from "react";
import { StatusDot } from "../../components/ui/StatusDot";

type Props = {
  children: ReactNode;
};

export function ErrorBoundary({ children }: Props) {
  let error: Error | null = null;

  try {
    return children;
  } catch (e) {
    if (e instanceof Error) {
      error = e;
    } else {
      error = new Error("Unknown error");
    }
  }

  return (
    <div className="flex items-center">
      <StatusDot status="error" />
      <span className="text-red-600">
        Error: {error?.message || "Something went wrong"}
      </span>
    </div>
  );
}
