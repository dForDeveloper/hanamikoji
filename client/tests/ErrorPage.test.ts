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
