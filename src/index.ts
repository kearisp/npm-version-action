import * as core from "@actions/core";
import {run} from "./run";


run().catch((err) => {
    core.setFailed(err.message || "Some error");
});
