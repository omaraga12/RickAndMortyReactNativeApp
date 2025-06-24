jest.useFakeTimers();

import { gql } from "@apollo/client";
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react-native';

// Datos falsos
import TabTwoScreen from '../components/_tabs_explore';

const mockEpisodes = [
  {
    id: '1',
    name: 'Pilot',
    air_date: 'December 2, 2013',
    episode: 'S01E01',
    characters: [],
  },
];
 const  GET_EPISODES = gql`
  query GetEpisodes($page: Int!) {
    episodes(page: $page) {
      info {
        next
      }
      results {
        id
        name
        air_date
        episode
        characters {
          id
          name
          species
        image
        status
        }
      }
    }
  }
`;

const mocks = [
  {
    request: {
      query: GET_EPISODES,
      variables: { page: 1 },
    },
    result: {
      data: {
        episodes: {
          info: { next: null },
          results: mockEpisodes,
        },
      },
    },
  },
];

describe('TabTwoScreen', () => {
  it('muestra el encabezado y carga datos correctamente', async () => {
    const { getByText, queryByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TabTwoScreen />
      </MockedProvider>
    );

    expect(getByText('EPISODES LIST')).toBeTruthy();

    await waitFor(() => expect(getByText('PILOT')).toBeTruthy());
    expect(getByText('December 2, 2013')).toBeTruthy();
    expect(getByText('Learn more')).toBeTruthy();
  });

  

  it('muestra el loader mientras carga', () => {
    const { getByText } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <TabTwoScreen />
      </MockedProvider>
    );

    expect(getByText('Loading...')).toBeTruthy();
  });

  it('muestra mensaje de error si falla la consulta', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_EPISODES,
          variables: { page: 1 },
        },
        error: new Error('Error de red'),
      },
    ];

    const { getByText } = render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <TabTwoScreen />
      </MockedProvider>
    );

    await waitFor(() => expect(getByText(/Error:/)).toBeTruthy());
    expect(getByText(/Error: Error de red/)).toBeTruthy();
  });
});
