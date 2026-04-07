# Web Institucional - CEIP San Isidro 🏫

Plataforma unificada y moderna desarrollada para digitalizar la gestión comunicativa y el acceso público a la información del colegio CEIP San Isidro. El proyecto incorpora una arquitectura full-stack, dividida en dos ecosistemas bien diferenciados, con un panel de control interactivo pensado para facilitar la vida del profesorado y administración, ofreciendo a su vez un frontal amigable, visual y veloz a los padres y alumnos ("Premium Design" con técnica de desenfoque *Glassmorphism*).

## Tecnologías y Herramientas 🛠️

Este proyecto se ha desarrollado desde cero utilizando herramientas ágiles y robustas.

### Frontend 💻
- **Librería Core**: React + Vite (Velocidad de compilación máxima).
- **Enrutamiento**: React Router DOM (Single Page Application para transiciones imperceptibles).
- **Estilos**: Vanilla CSS con variables nativas, modo oscuro en componentes y sobreescrituras premium (sin dependencias engorrosas).
- **Componentes Extra**: `lucide-react` para iconografía limpia, y `react-big-calendar` integrado con `date-fns` para la magia del calendario.

### Backend ⚙️
- **Framework Core**: FastAPI (Asíncrono, automatizado con Pydantic).
- **Patrón de Software**: Arquitectura Hexagonal (División pura y limpia entre Dominio, Casos de Uso e Infraestructura de rutas y BBDD).
- **Base de Datos**: SQLite motorizado mediante SQLAlchemy ORM (escalable a PostgreSQL sin alterar esquemas).
- **Seguridad**: JWT (JSON Web Tokens) interconectados y encriptación de hash unidireccional vía `passlib[bcrypt]`.

---

## Funcionalidades Dinámicas Implementadas 🚀

El colegio dispone de 4 ejes principales y todos incluyen un sistema de barrera (Login de Administrador) para proteger cualquier subida o edición fraudulenta:

1. **Gestor Inmersivo de "Alertas" Visuales (`Pop-ups`)**: En la página principal existe un módulo exclusivo para el administrador que permite "encender y apagar" ventanas emergentes. Avisan a todos los padres (una sola vez por sesión para no agobiar) de las novedades críticas (nevadas, excursiones importantes o plazos de admisión). Admiten Foto, Descripción y URL de ampliación informativa.
2. **Tablón de Noticias Inteligente**: Soporta creación de entradas periodísticas de texto, inyección de fotografías nativas auto-alojadas y enlaces automáticos a YouTube (Extrae el ID y genera el reproductor sin manchar el código).
3. **Repositorio de Documentos del Centro**: Carpeta digital orientada a las normativas de educación y circulares de jefatura, listando PDFs listos para descarga rápida y amigable.
4. **Calendario Interactivo Escolar**: Un complejo visor mensual/semanal de eventos con lógica superpuesta. Pulsar un día no interrumpe tu navegación, muestra una capa superior ("Modal") con vídeos, fecha temporal e imágenes.

---

## Despliegue Local & Inicialización 🏃‍♂️

Para levantar ambos servidores localmente, necesitas tener instalados `node` (>18) y `python` (>3.10) en tu máquina.

### Paso 1: Encender el Servidor Lógico (Backend)

1. Navega hasta el directorio del núcleo: `cd backend`
2. Activa tu entorno virtual cerrado: `source venv/bin/activate` (Mac/Linux) o `.\venv\Scripts\activate` (Windows).
3. Inicia la persistencia de datos (Uvicorn): `uvicorn main:app --reload`
*Correrá habitualmente sobre el puerto `8000`.*

### Paso 2: Encender el Diseño Visual (Frontend)

1. Abre un segundo terminal.
2. Navega la senda: `cd frontend`
3. Instala si fuera preciso: `npm install`
4. Lanza el portal: `npm run dev -- --port 5173`
*Correrá sobre la ruta `http://localhost:5173`.*

---

## Primeros Pasos & Credenciales

La base de datos genera usuarios automáticamente para mitigar fricciones operativas.

- **Usuario Admin:** `admin`
- **Contraseña predeterminada:** `admin123`

Se recomienda a encarecidamente utilizar el portal login de la Navbar para ingresar `admin` bajo esa frase de salto, de poder desbloquear las creaciones de posts, PDFs, eventos y poder invocar la "ruedecilla de tuerca dorada" de alertas directas en la "home".
