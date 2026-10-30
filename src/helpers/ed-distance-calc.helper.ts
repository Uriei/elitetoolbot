import { first as _first, upperCase as _upperCase } from "lodash";
import { IEdsmSystemData, ISystemData } from "../modules/models/system-data.model";
import { differenceInMonths } from "date-fns";
import { Log } from "../modules/logging";

const EDSM_API_SYSTEMS = "https://www.edsm.net/api-v1/systems";

export async function calculateDistance(origin: string, destination: string): Promise<number> {
  const systemsData = await getSystemData(origin, destination);

  if (systemsData.length !== 2) {
    throw Error("ERROR-NOTFOUND");
  }

  const result =
    ((systemsData[0].coords.x - systemsData[1].coords.x) ** 2 +
      (systemsData[0].coords.y - systemsData[1].coords.y) ** 2 +
      (systemsData[0].coords.z - systemsData[1].coords.z) ** 2) **
    (1 / 2);
  const roundedResult = Math.round((result + Number.EPSILON) * 100) / 100;
  return roundedResult;
}

export async function getSystemData(...systems: Array<string>) {
  const systemsData: Array<ISystemData> = [];

  if (systems.length > 0) {
    const SYSTEM_PARAM = "&systemName[]=";
    const baseUrl = `${EDSM_API_SYSTEMS}?showCoordinates=1&showId=1&showPermit=1&showInformation=1${SYSTEM_PARAM}`;
    const suffixPerSystem = systems.join(SYSTEM_PARAM);

    const url = `${baseUrl}${suffixPerSystem}`;

    Log.log("DistanceHelper", "Retrieving EDSM System Data", systems);
    const edsmResponse: Array<IEdsmSystemData> = await fetch(url).then((res) => res.json());

    for (const edsmSystem of edsmResponse) {
      const system: ISystemData = {
        name: edsmSystem.name,
        id64: edsmSystem.id64,
        coords: { x: edsmSystem.coords.x, y: edsmSystem.coords.y, z: edsmSystem.coords.z },
        needsPermit: edsmSystem.requirePermit,
        updateTime: new Date().valueOf(),
      };
      systemsData.push(system);
    }
  }

  return Promise.resolve(systemsData);
}

export async function getFormattedSystemName(systemName: string) {
  const systems = await getSystemData(systemName);
  const system = _first(systems);
  return system?.name;
}
