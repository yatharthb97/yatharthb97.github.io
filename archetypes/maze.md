{{- /*
  Archetype for hidden "maze" pages.

  Preferred:   python maze.py new "Page title"
  Also works:  hugo new content maze/page-name.md

  maze.py passes a cryptographically random token in HUGO_MAZE_TOKEN.
  When run through plain `hugo new`, a fallback token is derived here.
  The page is published at /maze/<token>/<page-name>/ and is linked from nowhere.
  Do not add tags or categories: a tag used only by hidden pages would still
  create a public /tags/<name>/ page.
*/ -}}
{{- $token := getenv "HUGO_MAZE_TOKEN" -}}
{{- if not $token -}}
  {{- $token = substr (sha256 (printf "%d|%v|%s" now.UnixNano (shuffle (seq 2000)) .File.Path)) 0 32 -}}
{{- end -}}
{{- $title := getenv "HUGO_MAZE_TITLE" | default (replace .Name "-" " " | title) -}}
---
title: {{ $title | jsonify }}
date: {{ .Date }}
draft: false
url: "/maze/{{ $token }}/{{ .Name }}/"
description: ""
math: false
showToc: false
TocOpen: false
hidemeta: true
comments: false
ShowReadingTime: false
ShowWordCount: false
ShowBreadCrumbs: false
disableShare: true
---

