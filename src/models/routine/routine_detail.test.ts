import Sinon from "sinon";
import RoutineDetail from "src/models/routine/routine_detail";
import User from "src/models/user/user";
import { createDefaultUser } from "src/models/utils/user_test_helpers";
import { dbTestSuite } from "src/test_helpers/setup_server_test_suite";

dbTestSuite("RoutineDetail", () => {
  let user: User;
  beforeEach(async () => {
    user = await createDefaultUser();
  });

  suite("Create", () => {
    test("can create a routine detail with userId", async () => {
      const { value: routineDetail, errorMessage } = await RoutineDetail.create(
        {
          creator: user.id,
          name: "Test Detail",
          description: "Test Description",
        }
      );

      expect(errorMessage).toBeNull();
      expect(routineDetail).not.toBeNull();
    });

    test("can create a routine detail with user", async () => {
      const { value: routineDetail, errorMessage } = await RoutineDetail.create(
        {
          creator: user,
          name: "Test Detail",
          description: "Test Description",
        }
      );

      expect(errorMessage).toBeNull();
      expect(routineDetail).not.toBeNull();
    });
  });

  suite("getCreator", () => {
    let dbQuerySpy: Sinon.SinonSpy;

    beforeEach(async () => {
      dbQuerySpy = Sinon.spy(db.query.users, "findFirst");
    });

    test("returns detail synchronously if pre-fetched", async () => {
      const { value: routineDetail, errorMessage } = await RoutineDetail.create(
        {
          creator: user,
          name: "Test Detail",
          description: "Test Description",
        }
      );

      expect(errorMessage).toBeNull();
      expect(routineDetail).not.toBeNull();

      const creator = await routineDetail!.getCreator();
      Sinon.assert.notCalled(dbQuerySpy);

      expect(creator).not.toBeNull();
    });

    test("returns detail async", async () => {
      const { value: routineDetail, errorMessage } = await RoutineDetail.create(
        {
          creator: user.id,
          name: "Test Detail",
          description: "Test Description",
        }
      );

      expect(errorMessage).toBeNull();
      expect(routineDetail).not.toBeNull();

      const creator = await routineDetail!.getCreator();
      Sinon.assert.calledOnce(dbQuerySpy);

      expect(creator).not.toBeNull();
    });
  });

  suite("findRoutineDetailById", () => {
    test("fetches a routine detail with no relations", async () => {
      const { value: routineDetail, errorMessage } = await RoutineDetail.create(
        {
          creator: user,
          name: "Test Detail",
          description: "Test Description",
        }
      );

      expect(errorMessage).toBeNull();
      expect(routineDetail).not.toBeNull();

      const foundRoutineDetail = await RoutineDetail.findRoutineDetailById(
        routineDetail!.id
      );

      expect(foundRoutineDetail).not.toBeNull();
      expect(foundRoutineDetail!.creator).toBeNull();
    });

    test("fetches and sets creator on routine detail", async () => {
      const { value: routineDetail, errorMessage } = await RoutineDetail.create(
        {
          creator: user,
          name: "Test Detail",
          description: "Test Description",
        }
      );

      expect(errorMessage).toBeNull();
      expect(routineDetail).not.toBeNull();

      const foundRoutineDetail = await RoutineDetail.findRoutineDetailById(
        routineDetail!.id,
        { creator: true }
      );

      expect(foundRoutineDetail).not.toBeNull();
      expect(foundRoutineDetail!.creator).not.toBeNull();
      expect(foundRoutineDetail!.creator!).toBeInstanceOf(User);
    });
  });
});
