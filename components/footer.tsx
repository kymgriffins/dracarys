import Link from "next/link";
import { Target } from "lucide-react";

export function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center mb-8">
          <Link href="/" aria-label="Dracarys Trader Development Platform">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold">Dracarys</span>
            </div>
          </Link>
        </div>
        <div className="text-center text-muted-foreground">
          <p>&copy; {currentYear} Dracarys. All rights reserved. Professional trader development platform.</p>
          <p className="text-sm mt-2">Focus on psychology, discipline, and mental game mastery.</p>
        </div>
      </div>
    </footer>
  );
}
