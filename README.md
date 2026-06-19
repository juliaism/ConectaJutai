#  **ConectaJutai**
O ConectaJutai é um aplicativo mobile desenvolvido com um foco em educação a distância para regiões com conectividade limitada. O projeto adota uma arquitetura offline-first, permitindo que os usuários acessem conteúdos educacionais sem dependência constante de internet. O sistema prioriza a experiência do usuário ao garantir que o progresso nos estudos seja registrado localmente e sincronizado com o servidor assim que uma conexão estável for detectada.

## **Características Principais**<br>
O aplicativo foi estruturado para oferecer uma jornada de aprendizado contínua através das seguintes funcionalidades:<br>
-  Módulos de Cursos — Organização de conteúdo em níveis progressivos: Iniciante, Intermediário e Avançado<br>
-  Videoaulas — Suporte a reprodução de vídeo otimizada para dispositivos móveis<br>
-  Rastreamento de Progresso Offline — Armazenamento local de aulas assistidas e módulos concluídos <br>
-  Download Online — Funcionalidade para baixar conteúdos quando houver conexão, permitindo o estudo posterior em modo avião ou áreas rurais <br>
-  Sincronização Automática — Progresso sincronizado com o servidor quando a internet retorna<br>
-  Calendário — Agenda com data, hora e local das mentorias presenciais<br>

## Tecnologias Utilizadas<br>
| Tecnologia | Tipo | Descrição |
|---|---|---|
| **React Native** | Framework | Framework para desenvolvimento mobile multiplataforma |
| **Expo** | Toolchain | Conjunto de ferramentas para facilitar desenvolvimento React Native |
| **TypeScript** | Linguagem | Superset do JavaScript com tipagem estática |
| **Supabase** | Backend & Banco de Dados | Plataforma open-source com PostgreSQL |
| **AsyncStorage** | Armazenamento Local | Persistência de dados no dispositivo |
| **Axios** | HTTP Client | Biblioteca para fazer requisições HTTP |
| **React Navigation** | Navegação | Gerencia rotas e navegação |
| **Node.js** | Runtime | Ambiente de execução JavaScript |
| **Express.js** | Framework Backend | Framework para criar APIs REST |
| **JWT** | Autenticação | Tokens para autenticação sem estado |
| **bcrypt** | Segurança | Criptografia de senhas |
| **JSONB** | Armazenamento | Armazenamento flexível de dados estruturados |

## **Estrutura do Projeto**<br>
```
conecta-jutai/
├── .expo/
├── .vscode/                                                  
│    └── .react/
├── app/                      
│   ├── src/                    
│   │   ├── assets/                               
│   │   │   ├── imagens
│   │   │   └── videos
│   │   ├── configApi/                       # Configuração de API               
│   │   │   └── api.ts
│   │   ├── contexts/            
│   │   │   └── authContext.tsx
│   │   ├── navigation/                      # Configuração de navegação
│   │   │   └── Navigation.tsx
│   │   ├── screens/                         # Telas do aplicativo
│   │   │   ├── Calendario.tsx  
│   │   │   ├── Download.tsx
│   │   │   ├── Guia.tsx
│   │   │   ├── Jornada.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Modulo.tsx
│   │   │   ├── Perfil.tsx
│   │   │   ├── ResetPassword.tsx
│   │   │   └── Signup.tsx
│   │   └── service/                         # Serviços do aplicativo
│   │   │   ├── authService.ts
│   │   │   ├── downloadGuiasService.ts
│   │   │   ├── syncService.ts
│   │   │   └── videoApiService.ts
│   └── app.json                             # Configuração Expo
├── components/                                                        
│    └── ui/
├── constants/                                                         
│    └── theme.ts
├── hooks/
├── node_modules/
├── scripts/                                                  
├── services/                                                         
│   ├── config/                                             
│   │   │   └── supabaseClient.ts                             
│   ├── controllers/                         # Lógica de negócio das rotas                                 
│   │   │   ├── authController.ts
│   │   │   ├── classController.ts
│   │   │   ├── coursesController.ts
│   │   │   └── progressController.ts
│   ├── middleware/                                          
│   │   │   └── authMiddleware.ts                           
│   ├── routes/                              # Definição das rotas da API                                            
│   │   │   ├── auth.ts
│   │   │   ├── class.ts                                
│   │   │   ├── courses.ts                                  
│   │   │   └── progress.ts                                  
│   └── server.ts                            # Arquivo de entrada do servidor                                        
├── .env.example                             # Exemplo de variáveis de ambiente                    
├── .gitignore                               # Arquivos e pastas ignorados pelo Git                  
├── app.json                      
├── App.tsx                                 
├── package-lock.json                 
├── package.json                             
├── README.md                                
└── tsconfig.json                            

```

##  **Executar Localmente**<br>
### Pré-requisitos<br> 
- Instalar o aplicativo Expo Go, disponivel na App Store e Google Play<br>
- Node.js (versão 22)<br>
- Computador e celular conectados à mesma rede de Wi-Fi<br>

### Como Rodar o Projeto<br>
-
-
-
-



## **Autenticação**<br>
A segurança do usuário é garantida por um sistema de credenciais simplificado e rigoroso:<br>
-  Identificador: Telefone celular (exatamente 9 dígitos)<br>
-  Credencial: Senha (exatamente 8 dígitos)<br>
-  Segurança: As senhas são criptografadas utilizando bcrypt antes de serem armazenadas no banco de dados<br>

##  **Rastreamento de Progresso**<br>
O app registra automaticamente:<br>
-  Aulas assistidas<br>
-  Módulos concluídos<br>
-  Porcentagem de conclusão por curso<br>

##  **Equipe**<br>
- Júlia Labad Jatene - Ciência da Computação<br>
- André Luiz Aragão Valentim - Administração<br>
- Beatriz Amaral Damasceno - Engenharia Civil<br>
- Eduarda Maffessoni Marques Melo - Engenharia Civil<br>
- Edgar Vinícius Teixeira Teófilo - Engenharia da Computação<br>
- Matheus Lima de Sá - Engenharia da Computação<br>
- Maria Eduarda Lopes Alves - Arquitetura e Urbanismo<br>
- Vitoria Campos Ferrari - Arquitetura e Urbanismo<br>
- Luysa de Lima Mendes - Arquitetura e Urbanismo<br>




