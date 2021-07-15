import { LaunchData } from './types';

export async function fetchPastLaunches(limit: number, {sort, order}: {sort: string | null, order: string | null}): Promise<LaunchData[]> {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const body = sort && order ? JSON.stringify({
        query: `{
            launchesPast(limit: ${limit}, sort: "${sort}", order: "${order}") {
                rocket {
                    rocket_name
                    second_stage {
                        payloads {
                        payload_type
                        }
                        block
                    }
                }
                launch_date_utc
                mission_name
                id
                links {
                    mission_patch_small
                }
            }
        }`
    }) : JSON.stringify({
        query: `{
            launchesPast(limit: ${limit}) {
                rocket {
                    rocket_name
                    second_stage {
                        payloads {
                        payload_type
                        }
                        block
                    }
                }
                launch_date_utc
                mission_name
                id
                links {
                    mission_patch_small
                }
            }
        }`
    });

    const options: RequestInit = {
        method: "POST",
        redirect: "follow",
        headers,
        body,
    };

    const request = await fetch("https://api.spacex.land/graphql/", options);
    const response = await request.json();

    return response.data.launchesPast;
}
