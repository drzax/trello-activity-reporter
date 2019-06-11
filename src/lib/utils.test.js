import { getCardCover } from "./utils";

describe("getCardCover", () => {
  test("no data", () => {
    expect(getCardCover({})).toBe(undefined);
  });
  test("no cover", () => {
    expect(getCardCover({ idAttachmentCover: null })).toBe(undefined);
  });
  test("missing cover", () => {
    expect(getCardCover({ idAttachmentCover: "abc", attachments: [] })).toBe(
      undefined
    );
  });
  test("exists", () => {
    const att = { id: "abc", name: "name" };
    expect(
      getCardCover({
        idAttachmentCover: "abc",
        attachments: [att, { id: "bcd" }]
      })
    ).toBe(att);
  });
});
