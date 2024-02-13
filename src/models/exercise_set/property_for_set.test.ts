import PropertyForSet from "src/models/exercise_set/property_for_set";
import { seedPropertiesForSets } from "src/test_helpers/exercise_set_test_helpers";
import { dbTestSuite } from "src/test_helpers/setup_server_test_suite";

dbTestSuite("PropertyForSet", () => {
  suite("Create", () => {
    test("Creates new properties", async () => {
      await seedPropertiesForSets();
    });
  });

  suite("findPropertyByName", () => {
    test("returns correct propertyForSet", async () => {
      await seedPropertiesForSets();
      const propertyName = "expExertion";
      const propertyForSet = await PropertyForSet.findPropertyByName(
        propertyName
      );
      expect(propertyForSet).not.toBeNull();
      expect(propertyForSet!.name).toBe(propertyName);
    });
  });
});
