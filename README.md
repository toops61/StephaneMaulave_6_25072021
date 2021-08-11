## Piquante

installer :
- [NodeJS](https://nodejs.org/en/download/)
- [Angular CLI](https://github.com/angular/angular-cli) : npm install -g @angular/cli (attention le projet ne fonctionne pas sur les versions de Angular > 8)

télécharger et dézipper le fichier Maulave_Stephane_P6_env.zip dans le dossier du projet, vous obtenez le fichier .env qui contient les éléments de sécurité pour la connexion, absents de ce repository. Attention ce fichier est caché sur l'explorateur (MacOS, Windows) mais visible sur VSCode ou en affichant les fichiers cachés.

lancer npm install

Sur Windows, ces installations nécessitent d'utiliser PowerShell en tant qu'administrateur.

## Development server

Démarrer ng serve pour avoir accès au serveur de développement.
démarrer nodemon server sur un autre terminal (pour l'installer : npm install -g nodemon) sinon node server.

Rendez-vous sur http://localhost:4200/. L'application va se recharger automatiquement si vous modifiez un fichier source.