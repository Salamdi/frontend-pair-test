import React from "react";

import { LaunchData } from './types';

import { fetchPastLaunches } from './api';
import LaunchListEntry from './LaunchListEntry';

type Props = {
    limit?: number
}

const LaunchList: React.FC<Props> = ({limit = 10}) => {
    const [entries, setEntries] = React.useState<LaunchData[]>([]);

    const [sort, setSort] = React.useState<string | null>(null);

    const [order, setOrder] = React.useState<string | null>(null);

    React.useEffect(() => {
        const retrieveListItems = async () => {
            const results = await fetchPastLaunches(limit, {sort, order});

            setEntries(results)
        };

        retrieveListItems();
    }, [setEntries, limit, order, sort]);

    const handleOrderChange: React.ChangeEventHandler<HTMLSelectElement> = async (event) => {
        const order = event.target.value;
        setOrder(order || null);
    };

    const handleSortChange: React.ChangeEventHandler<HTMLSelectElement> = async (event) => {
        const sortBy = event.target.value;
        setSort(sortBy || null);
    };

    return (
        <section className="App-list">
            <h4>Past Launches</h4>
            <p>List of past SpaceX launches</p>
            <div className="App-list-controls">
                <div className="App-list-control">
                    <label htmlFor="sortOrder">
                        Sort by
                    </label>
                    <select name="sortOrder" id="sortOrder" data-testid="sortOrder" onChange={handleOrderChange}>
                        <option value="">-</option>
                        <option value="asc">asc</option> 
                        <option value="desc">desc</option> 
                    </select>
                    <select name="sortBy" id="sortBy" data-testid="sortBy" onChange={handleSortChange}>
                        <option value="">-</option>
                        <option value="mission_name">name</option> 
                        <option value="launch_date_utc">date</option> 
                    </select>
                </div>
                <div className="App-list-control">
                    <label htmlFor="textSearch">
                        Search
                    </label>
                    <input name="textSearch" id="textSearch"
                        placeholder="Type mission name..."
                        data-testid="textSearch"/>
                </div>
            </div>
            <ul data-testid="missionList">{
                entries.map((entry) => <li key={entry.id}>
                    <LaunchListEntry entry={entry}/>
                </li>)
            }</ul>
        </section>
    )
};

export default LaunchList;