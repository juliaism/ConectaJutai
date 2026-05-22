# 📱 **ConectaJutai**
O ConectaJutai é um aplicativo mobile desenvolvido com um foco em educação a distância para regiões com conectividade limitada. O projeto adota uma arquitetura offline-first, permitindo que os usuários acessem conteúdos educacionais sem dependência constante de internet.O sistema prioriza a experiência do usuário ao garantir que o progresso nos estudos seja registrado localmente e sincronizado com o servidor assim que uma conexão estável for detectada.

### ✨ **Características Principais**<br>
O aplicativo foi estruturado para oferecer uma jornada de aprendizado contínua através das seguintes funcionalidades:<br>
• 📚 Módulos de Cursos — Organização de conteúdo em níveis progressivos: Iniciante, Intermediário e Avançado<br>
• 🎬 Videoaulas — Suporte a reprodução de vídeo otimizada para dispositivos móveis<br>
• 📊 Rastreamento de Progresso Offline — Armazenamento local de aulas assistidas e módulos concluídos <br>
• 📥 Download Online — Funcionalidade para baixar conteúdos quando houver conexão, permitindo o estudo posterior em modo avião ou áreas rurais <br>
• 🔄 Sincronização Automática — Progresso sincronizado com o servidor quando a internet retorna<br>

### 🛠️ Tecnologias Utilizadas

| Tecnologia | Tipo | Descrição | 
|---|---|---|
| **React Native e Expo** | Framework | Framework para desenvolvimento mobile multiplataforma |
| **TypeScript** | Linguagem | Superset do JavaScript com tipagem estática |
| **Supabase** | Backend & BD | Plataforma open-source com PostgreSQL |
| **AsyncStorage** | Armazenamento Local | Persistência de dados no dispositivo |
| **Axios** | HTTP Client | Biblioteca para fazer requisições HTTP |
| **React Navigation** | Navegação | Gerencia rotas e navegação |
| **Node.js** | Runtime | Ambiente de execução JavaScript |
| **Express.js** | Framework Backend | Framework para criar APIs REST |

### 📁 **Estrutura do Projeto**<br>
```


```


### 🔐 **Autenticação**<br>
A segurança do usuário é garantida por um sistema de credenciais simplificado e rigoroso:<br>
• 📱 Identificador: Telefone celular (exatamente 9 dígitos)<br>
• 🔑 Credencial: Senha numérica<br>
• 🛡️ Segurança: As senhas são criptografadas utilizando bcrypt antes de serem armazenadas no banco de dados<br>

### 📊 **Rastreamento de Progresso**<br>
O app registra automaticamente:<br>
• ✅ Aulas assistidas<br>
• 📈 Módulos concluídos<br>
• 🎯 Porcentagem de conclusão por curso<br>
