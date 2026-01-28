# KarinPulse

Aplicación móvil desarrollada con React Native y Expo.

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Nota:** El archivo `.env` está incluido en `.gitignore` y no se subirá al repositorio. Asegúrate de configurar estas variables en tu entorno local y en las plataformas de despliegue.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm start
```

## Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo de Expo
- `npm run android` - Inicia la app en Android
- `npm run ios` - Inicia la app en iOS
- `npm run web` - Inicia la app en el navegador
- `npm run lint` - Ejecuta el linter
- `npm run format` - Formatea el código con Prettier