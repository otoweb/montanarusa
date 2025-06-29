// Función para actualizar el estado de apertura
function updateOpeningStatus() {
  const now = new Date();
  const currentHour = now.getHours();
  const statusElement = document.getElementById("statusText");
  const doorIcon = document.getElementById("doorIcon");

  // Horario: de 16:00 (4 PM) a 00:00 (12 AM) del día siguiente
  const openHour = 16; // 4 PM
  const closeHour = 24; // 12 AM (medianoche)

  let isOpen = false;

  // Si la hora actual está entre las 16:00 y las 24:00
  if (
    currentHour >= openHour ||
    currentHour < (closeHour === 24 ? 0 : closeHour)
  ) {
    // Consideramos que está abierto después de las 16:00 y antes de medianoche
    if (currentHour >= openHour || currentHour < 0) {
      isOpen = true;
    }
  }

  if (isOpen) {
    doorIcon.className = "fas fa-door-open status-open";
    statusElement.textContent = "Abierto";
  } else {
    doorIcon.className = "fas fa-door-closed status-closed";
    statusElement.textContent = "Cerrado";
  }
}

// Botones de WhatsApp
document.querySelectorAll(".whatsapp-btn").forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    const product = this.getAttribute("data-product");
    const price = this.getAttribute("data-price");
    const message = `Hola, me interesa pedir: ${product} (${price})`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5353910527?text=${encodedMessage}`, "_blank");
  });
});

// Botón para volver arriba
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", function () {
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add("active");
  } else {
    scrollTopBtn.classList.remove("active");
  }
});

scrollTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Mostrar notificación al cargar la página
window.addEventListener("DOMContentLoaded", (event) => {
  const notificacion = document.getElementById("notificacion");
  notificacion.style.display = "block";

  // Ocultar automáticamente después de 5 segundos
  setTimeout(() => {
    notificacion.style.display = "none";
  }, 3000);

  // Cerrar manualmente
  document
    .getElementById("cerrarNotificacion")
    .addEventListener("click", () => {
      notificacion.style.display = "none";
    });
});

// Inicializar estado de apertura
updateOpeningStatus();
// Actualizar cada minuto
setInterval(updateOpeningStatus, 60000);

// Configura tu URL y clave pública de Supabase
const SUPABASE_URL = "https://sqslszpxnkgukpedpfbh.supabase.co"; // Cambia esto por tu URL
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxc2xzenB4bmtndWtwZWRwZmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMTg0NzMsImV4cCI6MjA2NjY5NDQ3M30.LWh4EZBgnN04PzUs6DJnI9gv-MDJ5DpjNSF3a7oDJ4o"; // Cambia esto por tu clave pública

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function cargarProductos() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "<p>Cargando menú...</p>";

  // Cambia 'productos' por el nombre real de tu tabla en Supabase
  const { data: products, error } = await supabase
    .from("product")
    .select("*")
    .eq("store_id", 2);

  if (error) {
    grid.innerHTML = "<p>Error al cargar el menú.</p>";
    return;
  }

  grid.innerHTML = products
    .map(
      (product) => `
      <div class="product-card">
        <div class="product-image" style="background-image: url('${product.image}');"></div>
        <div class="product-content">
          <h3>${product.name} <span class="product-price">${product.price}</span></h3>
          <p>${product.description}</p>
          <a href="#" class="whatsapp-btn" data-product="${product.name}" data-price="${product.price}">
            <i class="fab fa-whatsapp"></i> Pedir por WhatsApp
          </a>
        </div>
      </div>
    `
    )
    .join("");

  // Vuelve a activar los botones de WhatsApp después de renderizar
  document.querySelectorAll(".whatsapp-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const product = this.getAttribute("data-product");
      const price = this.getAttribute("data-price");
      const message = `Hola, me interesa pedir: ${product} (${price})`;
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/5353910527?text=${encodedMessage}`, "_blank");
    });
  });
}

// Llama a la función al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  // ...resto de tu código para notificaciones...
});
