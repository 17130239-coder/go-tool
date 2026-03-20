import { lazy } from 'react';

export const DashboardPage = lazy(() =>
  import('../features/dashboard').then((module) => ({ default: module.DashboardPage })),
);

export const ConverterPage = lazy(() =>
  import('../features/naming-converter').then((module) => ({ default: module.ConverterPage })),
);

export const ColorConverterPage = lazy(() =>
  import('../features/random-color').then((module) => ({ default: module.ColorConverterPage })),
);

export const RandomNumberPage = lazy(() =>
  import('../features/random-number').then((module) => ({ default: module.RandomNumberPage })),
);

export const TextTypingPage = lazy(() =>
  import('../features/text-typing').then((module) => ({ default: module.TextTypingPage })),
);

export const JsonFormatterPage = lazy(() =>
  import('../features/json-formatter').then((module) => ({ default: module.JsonFormatterPage })),
);

export const SqlFormatterPage = lazy(() =>
  import('../features/sql-formatter').then((module) => ({ default: module.SqlFormatterPage })),
);

export const GrossNetSalaryPage = lazy(() =>
  import('../features/gross-net-salary').then((module) => ({ default: module.GrossNetSalaryPage })),
);
