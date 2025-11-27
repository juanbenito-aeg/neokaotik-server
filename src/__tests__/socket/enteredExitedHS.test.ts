describe("entered-exited-hs socket event", () => {
  let User: any;

  beforeEach(() => {
    User = {
      updateFields: jest.fn(),
      getAcolytes: jest.fn(),
    };
  });

  it("should call updateFields when player data is updated", () => {
    User.updateFields();

    expect(User.updateFields).toHaveBeenCalled();
  });

  it("should call getAcolytes to retrieve all acolytes", () => {
    User.getAcolytes();

    expect(User.getAcolytes).toHaveBeenCalled();
    expect(User.getAcolytes).toHaveBeenCalledTimes(1);
  });
});
