import { exec } from "child_process";
// @ts-expect-error Expect error when the `foundryconfig.example.json` was not copied
import { pf2eRepoPath } from "../foundryconfig.json";

exec(`cd ${pf2eRepoPath} && git checkout master && git pull`);
