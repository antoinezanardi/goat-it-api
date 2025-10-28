# Configuration CORS dans Goat It API

## Vue d'ensemble

Dans cette API NestJS avec Fastify, les règles CORS (Cross-Origin Resource Sharing) sont gérées dans le fichier principal de démarrage du serveur.

## Configuration

### Emplacement principal

La configuration CORS se trouve dans `src/server/server.ts` dans la fonction `bootstrap()`.

```typescript
// Configuration CORS
app.enableCors(buildCorsConfig());
```

### Variables d'environnement

Les règles CORS peuvent être configurées via les variables d'environnement suivantes :

- `CORS_ORIGIN` : Origine(s) autorisée(s) (par défaut : `*`)
- `CORS_CREDENTIALS` : Autoriser les credentials (par défaut : `false`)

### Configuration par défaut

```typescript
{
  origin: "*",
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}
```

## Fichiers concernés

1. **`src/server/server.ts`** : Configuration principale
2. **`src/server/types/cors.types.ts`** : Types et configuration par défaut
3. **`src/server/cors.spec.ts`** : Tests de la configuration CORS
4. **`.env.example`** : Variables d'environnement d'exemple

## Alternatives de configuration

### 1. Configuration simple avec `app.enableCors()`

```typescript
app.enableCors({
  origin: 'https://example.com',
  credentials: true
});
```

### 2. Configuration avancée avec fonction

```typescript
app.enableCors({
  origin: (origin, callback) => {
    // Logique personnalisée pour valider l'origine
    callback(null, true);
  },
  credentials: true
});
```

### 3. Configuration au niveau des routes

Vous pouvez également configurer CORS pour des routes spécifiques dans les contrôleurs :

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Cors({ origin: 'https://specific-domain.com' })
  getSpecificRoute() {
    return 'This route has specific CORS rules';
  }
}
```

### 4. Configuration globale dans le module principal

Alternative : configurer CORS dans `app.module.ts` :

```typescript
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  // ... autres configurations
})
export class AppModule {
  // Configuration CORS via un guard global si nécessaire
}
```

## Bonnes pratiques

1. **En production** : Ne jamais utiliser `origin: "*"` avec `credentials: true`
2. **Sécurité** : Spécifier explicitement les domaines autorisés en production
3. **Performance** : Éviter les fonctions complexes pour valider l'origine si possible
4. **Tests** : Toujours tester les règles CORS dans vos tests d'intégration

## Debugging CORS

Pour debugger les problèmes CORS :

1. Vérifier les en-têtes de réponse dans les outils de développement
2. Utiliser des outils comme `curl` pour tester manuellement
3. Activer les logs de débogage si nécessaire

```bash
# Test CORS avec curl
curl -H "Origin: https://example.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://localhost:3000/api/endpoint
```