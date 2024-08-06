import { createClient, commandOptions } from "redis";
import { downloadS3Folder } from "./aws";
import { buildProject } from "./utils";
import { copyFinalDist } from "./aws";
const subscriber = createClient();
subscriber.connect();

const publisher = createClient();
publisher.connect();

async function main() {
    while(1) {
        const res = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'build-queue',
            0
          );
         // @ts-ignore
          const id = res.element;

          await downloadS3Folder(`output/${id}`)
          console.log("downloaded")
          await buildProject(id)
          copyFinalDist(id);
          console.log("uploaded")
        }
    }
main()