import {vitest} from "vitest";
import {vol} from "memfs";

vitest.mock("fs", () => {
    return {
        default: vol
    };
});
vitest.mock("fs/promises", () => vol.promises);
