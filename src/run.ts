import core from "@actions/core";
import fs from "fs";
import {applyEdits, modify} from "jsonc-parser";
import {Npm} from "./makes/Npm";
import {escapeRegExp} from "./utils";


export const run = async (): Promise<void> => {
    const tag = core.getInput("tag"),
          registryUrl = core.getInput("registry-url");

    if(!tag) {
        throw new Error("Tag not provided");
    }

    if(!fs.existsSync("package.json")) {
        throw new Error("File package.json is missing");
    }

    let packageContent = fs.readFileSync("package.json").toString();

    const packageData = JSON.parse(packageContent);

    if(!packageData.version) {
        throw new Error("Version field is missing in package.json");
    }

    const npm = new Npm(registryUrl),
          info = await npm.getPackageInfo(packageData.name);

    const lastIndex = Object.keys(info.versions).reduce((index, version) => {
        const regExp = new RegExp(`^${escapeRegExp(packageData.version)}-${tag}\.(\\d+)$`);

        if(regExp.test(version)) {
            const [, currentIndex] = regExp.exec(version) || [];

            index = Math.max(index, parseInt(currentIndex));
        }

        return index;
    }, -1);

    const newVersion = `${packageData.version}-${tag}.${lastIndex + 1}`;

    packageContent = applyEdits(packageContent, modify(packageContent, ["version"], newVersion, {}));

    fs.writeFileSync("package.json", packageContent);

    core.info(`NPM version changed: ${packageData.version} -> ${newVersion}.`);
}
