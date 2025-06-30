import {describe, it, expect, beforeEach, afterEach, jest} from "@jest/globals";
import core from "@actions/core";
import {vol} from "memfs";
import {run} from "./run";
import {setInputs} from "../test/inputs";


describe("run", (): void => {
    const mockVersions = (versions: string[]) => {
        const packagesInfo = {
            versions: versions.reduce((info, version) => {
                info[version] = {};

                return info;
            }, {} as any)
        };

        jest.spyOn(global, "fetch")
            .mockImplementation(async () => {
                return {
                    ok: true,
                    status: 200,
                    headers: {},
                    json: async () => {
                        return packagesInfo;
                    }
                } as Response;
            });
    };

    beforeEach((): void => {
        jest.spyOn(core, "info")
            .mockImplementation(() => undefined);
    });

    afterEach((): void => {
        jest.resetAllMocks();
        vol.reset();
    });

    it.each([
        {
            versions: [],
            tag: "beta",
            version: "1.0.1",
            expected: "1.0.1-beta.0"
        },
        {
            versions: ["1.0.0-beta.0"],
            tag: "beta",
            version: "1.0.1",
            expected: "1.0.1-beta.0"
        },
        {
            versions: ["1.0.1-beta.0"],
            tag: "beta",
            version: "1.0.1",
            expected: "1.0.1-beta.1"
        },
        {
            versions: ["1.0.0", "1.0.1-beta.0", "1.0.1-beta.1"],
            tag: "beta",
            version: "1.0.1",
            expected: "1.0.1-beta.2"
        }
    ])("should change version $version -> $expected", async ({versions, tag, version, expected}): Promise<void> => {
        mockVersions(versions);

        vol.fromJSON({
            "package.json": JSON.stringify({
                name: "@wocker/core",
                version: version
            }, null, 4)
        }, process.cwd());

        setInputs({
            tag
        });

        await expect(run()).resolves.toBeUndefined();

        const content = JSON.parse(vol.readFileSync("package.json").toString());

        expect(content.version).toBe(expected);
    });

    it("should log version changes", async () => {
        mockVersions(["1.0.1-beta.0"]);

        vol.fromJSON({
            "package.json": JSON.stringify({
                name: "@wocker/core",
                version: "1.0.1"
            }, null, 4)
        }, process.cwd());

        setInputs({
            tag: "beta"
        });

        await run();

        expect(core.info).toHaveBeenCalledWith("NPM version changed: 1.0.1 -> 1.0.1-beta.1.");
    });

    it("should throw error if package.json is missing", async () => {
        setInputs({
            tag: "beta"
        });

        await expect(run()).rejects.toThrowError("File package.json is missing");
    });

    it("should throw an error if version is missing in package.json", async () => {
        vol.fromJSON({
            "package.json": JSON.stringify({
                name: "@wocker/core"
            }, null, 4)
        }, process.cwd());

        setInputs({
            tag: "beta"
        });

        await expect(run()).rejects.toThrowError();
    });

    it("should throw error if registry response is not OK", async () => {
        jest.spyOn(global, "fetch").mockImplementation(async () => ({
            ok: false,
            status: 500,
            json: async () => ({})
        } as Response));

        vol.fromJSON({
            "package.json": JSON.stringify({
                name: "@wocker/core",
                version: "1.0.1"
            }, null, 4)
        }, process.cwd());

        setInputs({
            tag: "beta"
        });

        await expect(run()).rejects.toThrowError("Failed to fetch package info from the registry");
    });
});
