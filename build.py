import pathlib
root = pathlib.Path(__file__).parent
css = (root / "src/styles.css").read_text(encoding="utf-8")
ill = (root / "src/ill.js").read_text(encoding="utf-8")
app = (root / "src/app.js").read_text(encoding="utf-8")
html = f"""<!DOCTYPE html>
<html lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bilim do'sti</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Onest:wght@400;500;600;700;800&family=Unbounded:wght@600;700&display=swap" rel="stylesheet">
<style>
{css}
</style>
</head>
<body>
<header id="top"></header>
<main id="app"></main>
<div class="toast" id="toast" role="status" aria-live="polite" hidden></div>
<script>
(() => {{
{ill}
{app}
}})();
</script>
</body>
</html>
"""
(root / "index.html").write_text(html, encoding="utf-8")
print("built", len(html), "bytes")
