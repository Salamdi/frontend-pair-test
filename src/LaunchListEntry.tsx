import React from "react";

type Props = {
    entry: any
}

const LaunchListEntry: React.FC<Props> = ({entry}) => {
    const [isDetailVisible, setIsDetailVisible] = React.useState(false);

    const onEntryClicked = () => {
        setIsDetailVisible(!isDetailVisible)
    };

    const payload = entry?.rocket?.second_stage?.payloads[0]?.payload_type;
    const missionPatch = entry?.links?.mission_patch_small;

    return (<>
        <div className="App-list-entry-title" data-testid="entryContainer">
            <h4 className="App-title-clickable" onClick={onEntryClicked} data-testid="missionName">
                {entry.mission_name}
            </h4>
            <h5>{entry.launch_date_utc}</h5>
        </div>
        {isDetailVisible && <div className="App-list-entry-body" data-testid="entryBody">
            {missionPatch && <img width="10%" src={missionPatch} alt={`${entry.mission_name} Mission Patch`}/>}
            <p>
                <strong>Rocket: </strong>{entry.rocket.rocket_name}
            </p>
            <p>
                <strong>Payload: </strong>{payload}
            </p>
        </div>}
    </>)
};

export default LaunchListEntry;