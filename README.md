# 🐾 La Puce à l'Oreille — Site web

Site statique pour le salon de toilettage canin **La Puce à l'Oreille**  
📍 4 Place de la Voile, 56390 Locmaria-Grand-Champ  
📞 06 86 09 43 73  
⭐ 4,9/5 sur Google (47 avis)

---

## Structure

```
puce-a-loreille/
  index.html          ← Page unique
  css/
    style.css         ← Styles principaux
    animations.css    ← Animations scroll
  js/
    main.js           ← Nav burger + scroll + animations
  images/
    .gitkeep          ← Dossier pour les vraies photos
  README.md
```

## Lancer en local

Ouvrez simplement `index.html` dans votre navigateur.  
Ou avec un serveur local (recommandé) :

```bash
# Python
python3 -m http.server 8000

# Node.js (si installé)
npx serve .
```

## Remplacer les emojis par de vraies photos

Dans `index.html`, cherchez les commentaires `<!-- <img src="images/..."> -->` et décommentez-les après avoir placé vos photos dans `/images/`.

Dans `style.css`, cherchez les commentaires :
```css
/* background: url('../images/photo-X.jpg') center/cover; */
```

### Noms de fichiers conseillés
```
images/
  hero-chien.jpg          ← Photo principale hero
  toiletteuse.jpg         ← Photo de la toiletteuse (section À propos)
  galerie-caniche.jpg
  galerie-bichon.jpg
  galerie-golden.jpg
  galerie-yorkshire.jpg
  galerie-cocker.jpg
  favicon.ico
```

## Déployer

### GitHub Pages (gratuit)
1. Push sur GitHub
2. Settings → Pages → Source : `main` / `/ (root)`
3. Votre site est en ligne sur `https://votre-compte.github.io/puce-a-loreille/`

### Netlify (gratuit, recommandé)
1. Glissez le dossier sur [netlify.com/drop](https://app.netlify.com/drop)
2. Ou connectez votre repo GitHub pour un déploiement automatique

## Personnaliser

| Quoi | Où |
|---|---|
| Couleurs | `css/style.css` → variables `:root` |
| Textes | `index.html` |
| Tarifs | `index.html` → section `#services` |
| Avis | `index.html` → section `#avis` |
| Photos | `/images/` + décommenter les `<img>` |
| Horaires | `index.html` → section `#contact` + footer |

## Technologies

- HTML5 sémantique
- CSS3 (variables CSS, Grid, Flexbox)
- JavaScript vanilla (ES6+)
- Aucune dépendance externe
- 0 framework, 0 build tool nécessaire

---

*Site réalisé avec ❤️ pour La Puce à l'Oreille*
