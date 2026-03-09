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

    const API_URL = import.meta.env.VITE_API_URL || "https://pda-prod-api78190a61.azurewebsites.net";

    const response = await fetch(`${API_URL}/api/health`);

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

