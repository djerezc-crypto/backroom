# Backrooms Together

Escape cooperativo en primera persona para 2 jugadores. Cada uno queda en un
backroom distinto (Sala Amarilla / Sala Verde) y solo pueden avanzar
contándose por chat lo que cada uno ve — el mecanismo que abre TU puerta
está en la sala del otro.

No usa cuentas, ni bases de datos, ni servicios externos: es un servidor
Node.js chiquito (Express + WebSocket) que corre en tu propio computador y
solo reenvía tres cosas entre los dos navegadores: quién es Jugador A/B, el
chat, y el aviso de "resolví mi mecanismo".

Funciona desde PC (teclado + mouse o trackpad) **y** desde el celular
(joystick táctil en pantalla) — se puede abrir en Chrome, o en Safari de un
iPhone, sin instalar nada.

## La forma fácil: doble click

1. En **tu computador**, abre esta carpeta y haz doble click en:
   - **Windows:** `JUGAR-EN-WINDOWS.bat`
   - **Mac:** `JUGAR-EN-MAC.command`

   La primera vez puede tardar un poco instalando lo necesario. Cuando
   termine, se abre solo `http://localhost:3000` en tu navegador — ese eres
   tú, Jugador A.

2. La misma ventana te muestra una dirección tipo `http://192.168.1.23:3000`.
   Mándasela a tu hermano (por WhatsApp, por ejemplo) — **tienen que estar
   conectados a la misma wifi de la casa**.

3. Tu hermano abre esa dirección desde el navegador de su celular (Safari o
   Chrome, da igual) o desde su PC. En el celular le va a aparecer un
   joystick táctil en pantalla para moverse y botones para usar objetos,
   chatear y pausar. En PC se juega con WASD y el mouse/trackpad para mirar.

4. Apenas entra, queda como Jugador B y empieza la partida. Dejen la ventana
   del servidor (la que abriste con doble click) abierta mientras juegan —
   si la cierras, se corta la conexión.

Si Windows/Mac te muestra una advertencia de seguridad al abrir el archivo
por primera vez (por ser un script descargado), dale a "Ejecutar de todas
formas" / "Abrir igual" — es el mismo servidor que se describe aquí, no hay
nada más corriendo.

## La forma manual (si prefieres la terminal)

```bash
npm install
npm start
```

Abre `http://localhost:3000` en una pestaña (serás Jugador A) y la misma
dirección desde el otro dispositivo (serás Jugador B). Si quieres varias
partidas separadas al mismo tiempo, agrégale a la URL `?room=loquesea` —
todos los que abran la misma `?room=` juegan juntos.

## Si NO están en la misma wifi (jugar por internet)

Necesitas un hosting que mantenga la conexión abierta (WebSocket), no uno
que solo sirva archivos estáticos. La opción más simple y gratis:

### Opción recomendada: Render.com

1. Sube esta carpeta a un repositorio de GitHub (puedes usar tu cuenta
   `cjerez7025`):
   ```bash
   git init
   git add .
   git commit -m "Backrooms Together"
   git branch -M main
   git remote add origin https://github.com/cjerez7025/backrooms-together.git
   git push -u origin main
   ```
2. Entra a [render.com](https://render.com) y crea una cuenta gratis
   (puedes entrar directo con tu GitHub).
3. "New +" → "Web Service" → conecta el repo `backrooms-together`.
4. Configuración:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
5. Dale a "Create Web Service". En 1-2 minutos te da una URL pública tipo
   `https://backrooms-together.onrender.com`.
6. Ese es el link que le mandas a tu hermano (y el que abres tú) — funciona
   igual desde Safari en su iPhone que desde Chrome en tu PC. Cualquiera de
   los dos que entre primero es Jugador A; el segundo es Jugador B.

**Nota:** el plan gratis de Render "duerme" el servidor tras ~15 minutos sin
uso. La primera conexión del día puede tardar 20-30 segundos en despertar;
después de eso funciona normal mientras lo estén usando.

### Alternativas

- **Railway.app** o **Fly.io**: mismo tipo de despliegue (detectan
  `package.json`, corren `npm start`), planes gratuitos con límites
  parecidos.
- Evita Vercel/Netlify para el servidor: están pensados para funciones que
  responden y terminan, no para mantener un WebSocket abierto.

## Estructura

```
backrooms-together/
├── server.js               # Express + WebSocket: sirve /public y reenvía mensajes
├── package.json
├── JUGAR-EN-WINDOWS.bat     # Doble click para correr todo en Windows
├── JUGAR-EN-MAC.command     # Doble click para correr todo en Mac
└── public/
    └── index.html           # El juego completo (Three.js, todo en un archivo)
                              # con controles de teclado/mouse en PC y
                              # controles táctiles (joystick + botones) en celular
```

## Cómo se reparten los roles

El primero en conectarse a una sala (`?room=xxxx`) es **Jugador A** (Sala
Amarilla), el segundo es **Jugador B** (Sala Verde). Un tercero que entre a
la misma sala recibe un aviso de "sala llena" — abre otra `?room=` distinta
para jugar otra partida en paralelo.
