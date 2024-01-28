import PropertyForSet from "src/models/exercise_set/property_for_set";
import { dbTestSuite } from "src/test_helpers/setup_server_test_suite";

dbTestSuite("SetProperty", () => {
  async function createPropertiesForSets() {}
  suite("Create", () => {
    test("Creates new properties", async () => {
      const { value: property, errorMessage } = await PropertyForSet.create({
        name: "expExertion",
        dataType: "integer",
      });

      expect(errorMessage).toBeNull();
      expect(property).not.toBeNull();
    });
  });
});
