import JournalPage from '@/app/(protected)/journal/page';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('JournalPage', () => {
  it('renders the journal page header', () => {
    render(<JournalPage />);
    expect(screen.getByText('Trading Journal')).toBeInTheDocument();
    expect(screen.getByText('New Entry')).toBeInTheDocument();
  });

  it('renders mock entries', () => {
    render(<JournalPage />);
    expect(screen.getByText('Overcoming Analysis Paralysis')).toBeInTheDocument();
    expect(screen.getByText('Successful Risk Management Day')).toBeInTheDocument();
  });

  it('filters entries by search term', () => {
    render(<JournalPage />);
    const searchInput = screen.getByPlaceholderText('Search journal entries...');

    // Search for specific term
    fireEvent.change(searchInput, { target: { value: 'Analysis Paralysis' } });

    expect(screen.getByText('Overcoming Analysis Paralysis')).toBeInTheDocument();
    expect(screen.queryByText('Successful Risk Management Day')).not.toBeInTheDocument();
  });

  it('filters entries by mood', () => {
    render(<JournalPage />);

    // Click "Positive" filter
    const positiveButton = screen.getByText('Positive');
    fireEvent.click(positiveButton);

    expect(screen.queryByText('Overcoming Analysis Paralysis')).not.toBeInTheDocument(); // Mood is negative
    expect(screen.getByText('Successful Risk Management Day')).toBeInTheDocument(); // Mood is positive
  });

  it('shows no results message when no entries match', () => {
    render(<JournalPage />);
    const searchInput = screen.getByPlaceholderText('Search journal entries...');

    fireEvent.change(searchInput, { target: { value: 'NonExistentTerm' } });

    expect(screen.getByText('No journal entries found')).toBeInTheDocument();
  });
});
