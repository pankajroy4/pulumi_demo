// // apps/react-frontend/src/hooks/useHealthStatus.ts

// // Cache the promise to avoid creating a new one on every render
// let healthPromise = null;

// export function useHealthStatus() {
//   if (!healthPromise) {
//     healthPromise = fetchHealthStatus();
//   }
//   return healthPromise;
// }

// async function fetchHealthStatus() {
//   try {
//     const response = await fetch(`${import.meta.env.VITE_API_URL}/api/health`);
//     if (!response.ok) return { status: "error" };
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     return { status: "error", message: error.message };
//   }
// }



type HealthResponse = {
  status: "healthy" | "error" | "loading";
  message?: string;
};

// Cache the promise
let healthPromise: Promise<HealthResponse> | null = null;

export function useHealthStatus(): Promise<HealthResponse> {
  if (!healthPromise) {
    healthPromise = fetchHealthStatus();
  }
  return healthPromise;
}

async function fetchHealthStatus(): Promise<HealthResponse> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/health`);

    if (!response.ok) {
      return { status: "error" };
    }

    const data = (await response.json()) as HealthResponse;
    return data;

  } catch (error: unknown) {
    if (error instanceof Error) {
      return { status: "error", message: error.message };
    }

    return { status: "error" };
  }
}

