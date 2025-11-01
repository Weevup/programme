# 🚀 Configuration GitHub Pages

## Étapes pour activer GitHub Pages

Pour que la démo soit accessible publiquement, vous devez activer GitHub Pages dans les paramètres du repository.

### 1. Accéder aux paramètres

1. Allez sur https://github.com/Weevup/programme
2. Cliquez sur **Settings** (en haut à droite)
3. Dans le menu latéral gauche, cliquez sur **Pages**

### 2. Configurer la source

Dans la section "Build and deployment":

1. **Source**: Sélectionnez `GitHub Actions`
   - **NE PAS** sélectionner "Deploy from a branch"
   - Choisir explicitement **"GitHub Actions"**

2. Sauvegardez (si nécessaire)

### 3. Permissions du Workflow

Assurez-vous que le workflow a les permissions nécessaires:

1. Toujours dans **Settings**
2. Allez dans **Actions** > **General**
3. Descendez à "Workflow permissions"
4. Sélectionnez **"Read and write permissions"**
5. Cochez **"Allow GitHub Actions to create and approve pull requests"**
6. Cliquez sur **Save**

### 4. Déclencher le déploiement

Le workflow se déclenche automatiquement sur chaque push vers la branche `claude/event-platform-mvp-011CUhgk1BFwUPHsaWgSW5jx`.

Pour forcer un déploiement immédiat:

1. Allez dans l'onglet **Actions**
2. Sélectionnez le workflow "Deploy Demo to GitHub Pages"
3. Cliquez sur **Run workflow**
4. Sélectionnez votre branche
5. Cliquez sur **Run workflow**

### 5. Vérifier le déploiement

1. Dans l'onglet **Actions**, vous verrez le workflow en cours
2. Attendez que les deux jobs soient verts :
   - ✅ build
   - ✅ deploy
3. Une fois terminé, votre démo sera accessible à:

   **https://weevup.github.io/programme/**

### 6. Configuration du domaine personnalisé (optionnel)

Si vous souhaitez utiliser un domaine personnalisé:

1. Dans **Settings** > **Pages**
2. Section "Custom domain"
3. Entrez votre domaine (ex: `demo.weevup.com`)
4. Configurez vos DNS records:
   ```
   Type: CNAME
   Name: demo (ou le sous-domaine souhaité)
   Value: weevup.github.io
   ```
5. Attendez la propagation DNS (peut prendre quelques heures)
6. Cochez "Enforce HTTPS"

## 🔍 Vérification

### Vérifier que GitHub Pages est activé

1. Allez dans **Settings** > **Pages**
2. Vous devriez voir :
   ```
   Your site is live at https://weevup.github.io/programme/
   ```

### Vérifier le workflow

1. Onglet **Actions**
2. Cherchez "Deploy Demo to GitHub Pages"
3. Le dernier run devrait être ✅ vert

### En cas d'erreur

**Erreur 404 après déploiement:**
- Vérifiez que le `basePath` est correct dans `next.config.js`
- Vérifiez que le workflow a bien uploadé les fichiers
- Attendez quelques minutes pour la propagation

**Le workflow échoue:**
- Vérifiez les permissions (étape 3)
- Vérifiez que la branche existe
- Consultez les logs du workflow dans Actions

**Les assets ne se chargent pas:**
- Vérifiez que `.nojekyll` existe dans `apps/web/public/`
- Vérifiez la configuration `basePath` dans next.config.js

## 📝 Structure du déploiement

```
Repository Github
    └── Actions Workflow
        ├── 1. Build (pnpm install + next build)
        │   └── Génère /apps/web/out/
        └── 2. Deploy
            └── Upload vers GitHub Pages
                └── Accessible à https://weevup.github.io/programme/
```

## 🎯 URLs importantes

- **Démo live**: https://weevup.github.io/programme/
- **Repository**: https://github.com/Weevup/programme
- **Actions**: https://github.com/Weevup/programme/actions
- **Settings**: https://github.com/Weevup/programme/settings/pages

## ✅ Checklist rapide

- [ ] Pages activé dans Settings > Pages
- [ ] Source = "GitHub Actions"
- [ ] Permissions workflow = "Read and write"
- [ ] Workflow exécuté avec succès
- [ ] Site accessible à l'URL GitHub Pages

## 💡 Conseils

- Le premier déploiement peut prendre 5-10 minutes
- Les déploiements suivants sont plus rapides (2-3 minutes)
- Le cache aide à accélérer les builds
- Les modifications sont visibles immédiatement après le déploiement
