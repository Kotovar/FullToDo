/* eslint-disable no-console */
import axe from 'axe-core';

const DELAY = 1000;

let observer: MutationObserver | null = null;
let timeoutId: ReturnType<typeof setTimeout> | null = null;
let running = false;

const logViolations = (results: axe.AxeResults) => {
  if (!results.violations.length) return;

  console.error(
    `%cAccessibility violations found: ${results.violations.length}`,
    'color: #ff0000; font-weight: bold; font-size: 13px',
  );

  results.violations.forEach(violation => {
    const color =
      violation.impact === 'critical'
        ? '#ff0000'
        : violation.impact === 'serious'
          ? '#ff8800'
          : violation.impact === 'moderate'
            ? '#ffcc00'
            : '#aaaaaa';

    console.groupCollapsed(
      `%c${violation.impact?.toUpperCase() || 'INFO'}: ${violation.help}`,
      `color: ${color}; font-weight: bold;`,
    );
    console.log(violation.description);
    console.log(`Learn more: ${violation.helpUrl}`);

    violation.nodes.forEach(node => {
      console.groupCollapsed('Affected node');
      console.log('Selector:', node.target.join(' '));
      console.log('HTML:', node.html);
      if (node.failureSummary) console.log('Summary:', node.failureSummary);
      console.groupEnd();
    });

    console.groupEnd();
  });
};

export function initAxe() {
  if (typeof window === 'undefined' || import.meta.env.PROD || observer) return;

  const run = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      if (running) return;

      running = true;

      try {
        const results = await axe.run(document, {
          reporter: 'v2',
        });

        if (results.violations.length) {
          logViolations(results);
        }
      } finally {
        running = false;
      }
    }, DELAY);
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(run);
  } else {
    setTimeout(run, 0);
  }

  observer = new MutationObserver(run);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
