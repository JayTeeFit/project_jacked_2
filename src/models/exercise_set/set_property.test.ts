import SetProperty from "src/models/exercise_set/set_property";
import { seedPropertiesForSets } from "src/models/utils/property_for_set_test_helpers";
import { dbTestSuite } from "src/test_helpers/setup_server_test_suite";

dbTestSuite("SetProperty", () => {
  beforeEach(async () => {
    await seedPropertiesForSets();
  });

  suite("Create", () => {
    test("Creates new set properties", async () => {
      const { value: property, errorMessage } = await SetProperty.create({
        setId: 1,
        propertyName: "expExertion",
        value: "1",
      });

      expect(errorMessage).toBeNull();
      expect(property).not.toBeNull();
    });
  });
});
