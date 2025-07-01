import {jest} from "@jest/globals";
import {vol} from "memfs";
import {inputs} from "./inputs";


jest.mock("fs", () => vol);
jest.mock("fs/promises", () => vol.promises);
jest.mock("@actions/core", () => {
    return {
        getInput(name) {
            return inputs[name];
        },
        info(message) {
            console.info(message);
        }
    };
});
