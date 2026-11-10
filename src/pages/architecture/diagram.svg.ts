/* The architecture diagram as one standalone SVG file, for saving or printing.
   The same drawing as /architecture/diagram/, without the page around it. */
import type { APIRoute } from 'astro';
import { renderDiagram } from '../../lib/diagram';

export const GET: APIRoute = () =>
  new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${renderDiagram({ standalone: true })}\n`, {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
  });
