import type { Route } from './+types/playground';
import { redirect } from 'react-router';
import { createSupabaseServerClient } from '~/lib/supabase/server';
import { mergeRouteModuleMeta } from '~/lib/merge-meta';

export const meta = mergeRouteModuleMeta(() => {
  const title = 'Playground | Maily';
  const description =
    'Try out Maily, the Open-source editor for crafting emails.';

  return [
    { title: title },
    {
      name: 'description',
      content: description,
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      name: 'og:title',
      content: title,
    },
    {
      name: 'og:description',
      content: description,
    },
  ];
});

export async function loader(args: Route.LoaderArgs) {
  const { request } = args;

  const headers = new Headers();
  const supabase = createSupabaseServerClient(request, headers);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect('/templates', { headers });
  }

  return redirect('/login', { headers });
}

export default function Playground() {
  return redirect('/login');
}
