## Piquante

Pour faire fonctionner le projet, vous devez installer :
- [NodeJS](https://nodejs.org/en/download/) en version 12.14 ou 14.0 
- [Angular CLI](https://github.com/angular/angular-cli) en version 7.0.2.


installer :
- [NodeJS](https://nodejs.org/en/download/) en version 12.14 ou 14.0
- [Angular CLI](https://github.com/angular/angular-cli) : npm install -g @angular/cli
- [node-sass](https://www.npmjs.com/package/node-sass) : attention à prendre la version correspondante à NodeJS. Pour Node 14.0 par exemple, installer node-sass en version 4.14+.

npm install

Sur Windows, ces installations nécessitent d'utiliser PowerShell en tant qu'administrateur.

## Development server

Démarrer ng serve pour avoir accès au serveur de développement. 
démarrer nodemon server sur un autre terminal

Rendez-vous sur http://localhost:4200/. L'application va se recharger automatiquement si vous modifiez un fichier source.

Cliquer sur l'ongler "inscription":
si une erreur se produit lors de la création d'un utilisateur, stopper puis relancer le serveur (nodemon server). L'utilisateur est quand même créé, vérifier sur la page connexion.