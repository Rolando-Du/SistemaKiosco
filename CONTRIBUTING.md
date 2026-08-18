# Contribuir

## Flujo

1. Crear una rama desde `master`.
2. Mantener los cambios enfocados.
3. Ejecutar validaciones locales.
4. Crear commits descriptivos.
5. Abrir un pull request con pasos de prueba.

## Backend

```bash
cd backend
pip install -r requirements.txt
python -m compileall .
```

## Frontend

```bash
cd frontend
pnpm install
pnpm lint
pnpm build
```

## Reglas

- No publicar credenciales o datos comerciales reales.
- Revisar bases SQLite y backups antes de versionar.
- Mantener la lógica de stock y caja consistente.
- Documentar cambios que afecten ventas, compras o reportes.
- Evitar dependencias innecesarias.

## Pull requests

Incluí una descripción clara, pruebas realizadas y capturas cuando cambie la interfaz.
