import { GlassCard, GlassCardTitle } from '@/components/ui/glass-card';
import { render, screen } from '@testing-library/react';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
}));

describe('GlassCard Component', () => {
  it('renders children correctly', () => {
    render(
      <GlassCard>
        <GlassCardTitle>Test Title</GlassCardTitle>
        <p>Test Content</p>
      </GlassCard>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies glass class by default', () => {
    render(<GlassCard data-testid="glass-card" />);
    const card = screen.getByTestId('glass-card');
    // The GlassCard component wraps the Card in a motion.div, but the Card itself has the class.
    // We need to check if the Card (which is rendered inside) has the class.
    // However, since we are using shadcn Card, it might be hard to access directly without a testid on the Card itself.
    // Let's check if the rendered HTML contains the class.
    expect(card.innerHTML).toContain('glass');
  });

  it('applies hover effect when hoverEffect is true', () => {
    render(<GlassCard hoverEffect={true} data-testid="glass-card-hover" />);
    const card = screen.getByTestId('glass-card-hover');
    expect(card.innerHTML).toContain('glass-hover');
  });
});
