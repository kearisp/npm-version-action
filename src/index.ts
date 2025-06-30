import {run} from "./action";


run().catch((err) => {
    core.setFailed(err.message || "Some error");
});
