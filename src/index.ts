import * as core from "@actions/core";
import {run} from "./run.js";


try {
    await run();
}
catch(err) {
    core.setFailed((err as Error).message || "Some error");
    process.exit(1);
}
