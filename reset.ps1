Write-Host "Removendo node_modules e package-lock.json..."

#Apaga node_modules
Remove-Item -Recurse -Force .\node_modules
Remove-Item -Recurse -Force .\services\node_modules

#Apaga package-lock.json
Remove-Item -Force .\package-lock.json
Remove-Item -Force .\services\package-lock.json

Write-Host "Instalando dependências novamente..."
npm install

Write-Host "Pronto! Agora você pode rodar:"
Write-Host "npx expo start -c"
