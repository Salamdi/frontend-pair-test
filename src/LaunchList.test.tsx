import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { LaunchData } from './types';
import LaunchList from './LaunchList';

import { fetchPastLaunches } from './api';
import { act } from 'react-dom/test-utils';
jest.mock('./api');

const mockLaunches: LaunchData[] = [
  {
    "rocket": {
      "rocket_name": "Falcon 9",
      "second_stage": {
        "payloads": [
          {
            "payload_type": "Crew Dragon"
          }
        ],
        "block": 5
      }
    },
    "launch_date_utc": "2020-11-15T00:49:00.000Z",
    "mission_name": "Crew-1",
    "id": "107",
    "links": {
      "mission_patch_small": null
    }
  },
  {
    "rocket": {
      "rocket_name": "Falcon 9",
      "second_stage": {
        "payloads": [
          {
            "payload_type": "Satellite"
          }
        ],
        "block": 5
      }
    },
    "launch_date_utc": "2020-11-01T00:00:00.000Z",
    "mission_name": "SXM-7",
    "id": "110",
    "links": {
      "mission_patch_small": null
    }
  },
  {
    "rocket": {
      "rocket_name": "Falcon 9",
      "second_stage": {
        "payloads": [
          {
            "payload_type": "Dragon 1.1"
          }
        ],
        "block": 5
      }
    },
    "launch_date_utc": "2020-12-02T17:50:00.000Z",
    "mission_name": "CRS-21",
    "id": "112",
    "links": {
      "mission_patch_small": null
    }
  }
];

beforeEach(() => {
  (fetchPastLaunches as jest.Mock).mockImplementation((limit: number, { sort, order }: { sort: 'mission_name' | 'launch_date_utc'; order: string }) => {
    if (order === 'asc' && sort) {
      return mockLaunches.sort((a, b) => a[sort].localeCompare(b[sort]));
    }
    if (order === 'desc' && sort) {
      return mockLaunches.sort((a, b) => b[sort].localeCompare(a[sort]));
    }
    return mockLaunches;
  });
})

test('renders past launches', async () => {
  render(<LaunchList/>);

  const titleElement = screen.getByText("Past Launches");
  expect(titleElement).toBeInTheDocument();

  const items = await screen.findAllByRole('listitem');
  expect(items.length).toBe(mockLaunches.length);

  expect(fetchPastLaunches).toBeCalledTimes(1);
});

test('renders sort by dropdown', async () => {
  render(<LaunchList/>);

  const dropdownElements = await screen.findAllByRole('combobox');
  dropdownElements.forEach(el => expect(el).toBeInTheDocument())
});

test('renders search input', async () => {
  render(<LaunchList/>);

  const searchInput = await screen.findByRole('textbox');
  expect(searchInput).toBeInTheDocument();
});

test('sorts launches by mission name', async () => {
  render(<LaunchList/>);
  const selectOrder = screen.getByTestId('sortOrder');
  const selectBy = screen.getByTestId('sortBy');
  await act(async () => {
    fireEvent.change(selectOrder, { target: { value: 'asc'} });
    fireEvent.change(selectBy, { target: { value: 'mission_name'} });
  });
  const list = screen.getAllByTestId('missionName');
  const orderedMissionNames = list.map(li => li.textContent);
  expect(orderedMissionNames).toEqual(['Crew-1', 'CRS-21', 'SXM-7']);
});

test('sorts launches by mission date', async () => {
  render(<LaunchList />);
  const selectOrder = screen.getByTestId('sortOrder');
  const selectOrderBy = screen.getByTestId('sortBy');
  await act(async () => {
    fireEvent.change(selectOrder, { target: { value: 'asc'} });
    fireEvent.change(selectOrderBy, { target: { value: 'launch_date_utc'} });
  });
  const list = screen.getAllByTestId('missionName');
  const orderedMissionNames = list.map(li => li.textContent);
  expect(orderedMissionNames).toEqual(['SXM-7', 'Crew-1', 'CRS-21',]);
})
