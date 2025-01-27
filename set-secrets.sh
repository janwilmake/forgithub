# Export local vars to GitHub secrets
cat .dev.vars | while read line; do
  KEY=$(echo $line | cut -d'=' -f1)
  VALUE=$(echo $line | cut -d'=' -f2)
  gh secret set "$KEY" -b"$VALUE"
done