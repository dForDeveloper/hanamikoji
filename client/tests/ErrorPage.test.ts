import { describe, expect, it } from 'vitest';
import ErrorPage from '$lib/components/ErrorPage.svelte';
import { render, type RenderResult } from '@testing-library/svelte';
import matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

describe('Error Page', () => {
  it('renders a link to the main page', () => {
    const renderResult: RenderResult<ErrorPage> = render(ErrorPage, { status: 404, errorMessage: 'Not Found' });
    expect(renderResult.getByText('return to main page')).toBeInTheDocument();
  });
});

// import Hand from '$lib/components/Hand.svelte';
// import { Color, Stage, type Action, type ItemCard, type Player } from 'game-logic';
  // it('does not render when hasGameStarted is false', () => {
  //   const mockHand: ItemCard[] = [
  //     ...Array(2).fill({ charmPoints: 2, color: Color.PURPLE }),
  //     ...Array(2).fill({ charmPoints: 2, color: Color.RED }),
  //     ...Array(2).fill({ charmPoints: 2, color: Color.YELLOW }),
  //   ];

  //   const mockActions: Record<string, Action> = {
  //     0: { enabled: true, savedCard: null },
  //     1: { enabled: true, discardedCards: [] },
  //     2: { enabled: true },
  //     3: { enabled: true },
  //   };

  //   const mockPlayer: Player = {
  //     hand: mockHand,
  //     actions: mockActions,
  //     score: { geishaCount: 0, charmPoints: 0 },
  //   };

  //   const renderResult: RenderResult<Hand> = render(
  //     Hand,
  //     {
  //       player: mockPlayer,
  //       hasGameStarted: false,
  //       playerStage: Stage.NULL,
  //       selectedCards: [],
  //       currentAction: null,
  //       setSelectedCardsFromHand: vi.fn(),
  //     }
  //   );

  //   expect(renderResult.getByTestId('hand')).not.toBeInTheDocument();
  // });