const {
  getTotalProfit,
  getProfitPerAgent,
  getProfitPerRole,
  getProfitByOutreach,
  getRecentJobs,
} = require("../services/analyticsService");

const Job = require("../models/Data");

jest.mock("../models/Data.js");

describe("Analytics Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getTotalProfit should return sum of all profits", async () => {
    Job.aggregate.mockReturnValue({
      exec: jest.fn().mockResolvedValue([{ _id: null, totalProfit: 12000 }]),
    });

    const result = await getTotalProfit();
    expect(result).toBe(12000);
  });

  test("getProfitPerAgent should group by agent", async () => {
    const mockData = [
      { _id: "James Chen", totalProfit: 4664 },
      { _id: "Aisha Patel", totalProfit: 1092 },
    ];
    Job.aggregate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockData),
    });

    const result = await getProfitPerAgent();
    expect(result).toEqual(mockData);
  });

  test("getProfitPerRole should group by role", async () => {
    const mockData = [
      { _id: "Tech Sales", totalProfit: 5000 },
      { _id: "Enterprise Sales", totalProfit: 7000 },
    ];
    Job.aggregate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockData),
    });

    const result = await getProfitPerRole();
    expect(result).toEqual(mockData);
  });

  test("getProfitByOutreach should group by lead type", async () => {
    const mockData = [
      { _id: "Cold Call", totalProfit: 4664 },
      { _id: "Email", totalProfit: 1092 },
    ];
    Job.aggregate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockData),
    });

    const result = await getProfitByOutreach();
    expect(result).toEqual(mockData);
  });

  test("getRecentJobs should return latest jobs", async () => {
    const mockJobs = [
      {
        agent: "James Chen",
        profit: 4664,
        lead: "Cold Call",
        timestamp: new Date(),
      },
    ];
    Job.find.mockReturnValue({
      sort: () => ({
        limit: () => ({
          lean: () => ({
            exec: () => Promise.resolve(mockJobs),
          }),
        }),
      }),
    });

    const result = await getRecentJobs();
    expect(result).toEqual(mockJobs);
  });
});
