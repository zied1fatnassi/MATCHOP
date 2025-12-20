/**
 * SpeedInsights Component
 * 
 * Integrates Vercel Speed Insights for performance monitoring
 * This component should be placed in the root of your application
 * to track Core Web Vitals and other performance metrics.
 * 
 * Speed Insights collects:
 * - Largest Contentful Paint (LCP)
 * - First Input Delay (FID)
 * - Cumulative Layout Shift (CLS)
 * - First Contentful Paint (FCP)
 * - Time to First Byte (TTFB)
 */

import { SpeedInsights } from '@vercel/speed-insights/react'

export default function SpeedInsightsComponent() {
  return <SpeedInsights />
}
