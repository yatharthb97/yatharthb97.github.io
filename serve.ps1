echo ""hugo.exe" -argumentList @("serve", "--buildDrafts", "--disableFastRender")"
Start-Process -FilePath "hugo.exe" -argumentList @("serve", "--buildDrafts", "--disableFastRender") -NoNewWindow
