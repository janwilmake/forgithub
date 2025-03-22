Badges

- Have an api for forgithub
- Use it to render a form where you can select the ones you like and get a markdown snippet for it with a link to edit the markdown (and easily make PR)

SEO

- analyse stars to get top repos
- every day generate sitemap.xml in kv for top repos
- generate better og:image by making that a custom worker. ensure it works similar to the og for uithub, making it look like githubs one.

Misc

- extrahere md parser as API and expose forgithub as API too. now it can be directly embedded into uithub.
- every day generate a vectorization of the hostnames and link texts. use this locally with a local vector search
- add a kv store that counts hostname clicks, cache that daily, and sort the items, in their category, based on this.
