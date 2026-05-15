Write-Host "Removendo node_modules e package-lock.json..."

# Apaga a pasta node_modules
Remove-Item -Recurse -Force node_modules

# Apaga o package-lock.json
Remove-Item -Force package-lock.json

Write-Host "Instalando dependências novamente..."
npm install

Write-Host "Pronto! Agora você pode rodar:"
Write-Host "npx expo start -c"
