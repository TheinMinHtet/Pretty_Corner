'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === 'development') {
      if (metric.rating === 'poor' || metric.rating === 'needs-improvement') {
        console.warn(`[Web Vitals Warning] ${metric.name}: ${metric.value.toFixed(1)}ms (${metric.rating})`);
      }
    }
  });

  return null;
}
