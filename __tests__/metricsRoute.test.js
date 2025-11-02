const request = require("supertest");
const createTestApp = require("../utils/createTestApp");
const analyticsService = require("../services/analyticsService");

// Mock analytics service
jest.mock("../services/analyticsService", () => ({
  getTotalProfit: jest.fn().mockResolvedValue(12000),
  getProfitPerAgent: jest
    .fn()
    .mockResolvedValue([{ _id: "James Chen", totalProfit: 4664 }]),
  getProfitPerRole: jest
    .fn()
    .mockResolvedValue([{ _id: "Tech Sales", totalProfit: 5000 }]),
  getProfitByOutreach: jest
    .fn()
    .mockResolvedValue([{ _id: "Cold Call", totalProfit: 4664 }]),
  getRecentJobs: jest.fn().mockResolvedValue([
    {
      agent: "James Chen",
      profit: 4664,
      lead: "Cold Call",
      timestamp: new Date(),
    },
  ]),
}));

// Mock auth middleware to always attach a user session
jest.mock("../middleware/auth", () => (req, res, next) => {
  req.session = { username: "testuser" };
  next();
});

let app;

beforeAll(() => {
  app = createTestApp();
});

describe("GET /metrics", () => {
  test("renders dashboard with metrics", async () => {
    const res = await request(app).get("/metrics");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Total Profit: 12000");
    expect(res.text).toContain("User: testuser");
    expect(res.text).toContain("James Chen");
    expect(res.text).toContain("Tech Sales");
    expect(res.text).toContain("Cold Call");
  });
});

describe("GET /metrics failures", () => {
  const serviceFunctions = [
    "getTotalProfit",
    "getProfitPerAgent",
    "getProfitPerRole",
    "getProfitByOutreach",
    "getRecentJobs",
  ];

  serviceFunctions.forEach((fnName) => {
    test(`returns 500 when ${fnName} throws`, async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      analyticsService[fnName].mockRejectedValueOnce(
        new Error(`${fnName} failed`)
      );

      const res = await request(app).get("/metrics");

      expect(res.status).toBe(500);
      expect(res.text).toContain("Error loading metrics");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching metrics:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});
