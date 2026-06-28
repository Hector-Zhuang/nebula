export const dynamic = 'force-static';

export async function GET() {
  return Response.json(
    {
      error:
        'Built-in search is disabled for this site. Configure Algolia search instead.',
    },
    { status: 404 },
  );
}
