// // apps/react-frontend/src/features/health/HealthStatus.tsx

// import { use } from "react";
// import { StatusDot } from "../../components/ui/StatusDot";
// import { useHealthStatus } from "../../hooks/useHealthStatus";

// export function HealthStatus() {
//   const data = use(useHealthStatus());

//   return (
//     <div className="flex items-center">
//       <StatusDot status={data.status} />
//       <span className="text-gray-600">Status: {data.status}</span>
//     </div>
//   );
// }



import { use } from "react";
import { StatusDot } from "../../components/ui/StatusDot";
import { useHealthStatus } from "../../hooks/useHealthStatus";

type HealthResponse = {
  status: "healthy" | "error" | "loading";
  message?: string;
};

export function HealthStatus() {
  const data = use(useHealthStatus()) as HealthResponse;

  return (
    <div className="flex items-center">
      <StatusDot status={data.status} />
      <span className="text-gray-600">Status: {data.status}</span>
    </div>
  );
}