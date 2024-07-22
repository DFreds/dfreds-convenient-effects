import { exec } from "child_process";
import { pf2eRepoPath } from "../foundryconfig.json";

exec(`cd ${pf2eRepoPath} && git checkout master && git pull`);
