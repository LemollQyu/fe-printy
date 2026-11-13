// api/authentikasi/get-test.ts

import { api, type ApiResponse } from "@/lib/api";

export type TestData = {
  service: string;
  status: string;
  uptime: string;
};

export type TestResponse = ApiResponse<TestData>;

/**
 * GET /api/v1/test
 * Health check service
 */
export async function getTest(): Promise<TestResponse> {
  return api<TestResponse>("/test", {
    method: "GET",
  });
}