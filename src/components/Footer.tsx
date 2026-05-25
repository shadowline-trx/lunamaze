'use client';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.axiomapp.app&hl=en_IN';
const STUDIO_URL = '/';
const STUDIO_GITHUB_URL = 'https://github.com/shadowline-trx';
const STUDIO_EMAIL = 'lunamaze.dev@gmail.com';

export default function Footer() {
  return (
    <footer className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-axiom-border/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">Axiom</h3>
            <p className="text-axiom-textSecondary leading-relaxed max-w-sm">
              Habit tracker for brain recovery. Built with neuroscience,
              designed for humans. Your truth. Daily.
            </p>
            <p className="text-axiom-textDim text-sm mt-4">
              A product of{' '}
              <a
                href={STUDIO_URL}
                className="text-axiom-primaryLight hover:text-axiom-textPrimary transition-colors"
              >
                Luna Maze
              </a>
              .
            </p>
          </div>

          {/* Product links — only routes that actually exist */}
          <div>
            <h4 className="text-sm font-semibold text-axiom-textPrimary uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-axiom-textSecondary hover:text-axiom-primaryLight transition-colors text-sm"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#protocol"
                  className="text-axiom-textSecondary hover:text-axiom-primaryLight transition-colors text-sm"
                >
                  Protocol
                </a>
              </li>
              <li>
                <a
                  href="#premium"
                  className="text-axiom-textSecondary hover:text-axiom-primaryLight transition-colors text-sm"
                >
                  Premium
                </a>
              </li>
              <li>
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-axiom-textSecondary hover:text-axiom-primaryLight transition-colors text-sm"
                >
                  Google Play
                </a>
              </li>
            </ul>
          </div>

          {/* Studio links */}
          <div>
            <h4 className="text-sm font-semibold text-axiom-textPrimary uppercase tracking-wider mb-4">
              Studio
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={STUDIO_URL}
                  className="text-axiom-textSecondary hover:text-axiom-primaryLight transition-colors text-sm"
                >
                  Luna Maze
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${STUDIO_EMAIL}`}
                  className="text-axiom-textSecondary hover:text-axiom-primaryLight transition-colors text-sm"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href={STUDIO_GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-axiom-textSecondary hover:text-axiom-primaryLight transition-colors text-sm"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-axiom-border/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-axiom-textDim text-sm">
            &copy; {new Date().getFullYear()} Luna Maze Studio. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href={STUDIO_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-axiom-textDim hover:text-axiom-primaryLight transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.393-3.369-1.393-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a
              href={`mailto:${STUDIO_EMAIL}`}
              aria-label="Email"
              className="text-axiom-textDim hover:text-axiom-primaryLight transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l9 6 9-6M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
