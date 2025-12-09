jest.mock("mqtt", () => ({
  __esModule: true,
  default: {
    connect: () => ({ on: () => {} }),
  },
}));
