import { characterData } from './mugiwaras.js';

document.addEventListener('DOMContentLoaded', function () {
  const body = document.body;
  const header = document.querySelector('header');
  const jollyRogers = document.querySelectorAll('.jolly_roger');
  const modal = document.getElementById('modal');
  const modalContent = document.querySelector('.modal-content');
  const modalTitle = document.getElementById('modal-title');
  const closeModal = document.querySelector('.close-btn');
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContent = document.querySelector('.tab-content');

  let currentCharacter = null; // Mantener el personaje actual seleccionado

  // Función para remover todas las clases activas
  function removeActiveClasses() {
    body.className = ''; // Elimina todas las clases del body
    header.className = ''; // Elimina todas las clases del header
    modalContent.className = 'modal-content'; // Resetear clase dinámica del modal
  }

  // Añadir eventos a cada Jolly Roger
  jollyRogers.forEach((jolly) => {
    // Hover para cambiar el color de la página
    jolly.addEventListener('mouseenter', function () {
      removeActiveClasses();

      // Obtener el ID del personaje (ej: "luffy-jolly" → "luffy")
      const character = this.id.split('-')[0];

      // Añadir clases activas dinámicamente
      body.classList.add(`${character}-active`);
      header.classList.add(`${character}-active`);
    });

    // Click para abrir el modal
    jolly.addEventListener('click', function () {
      const character = this.id.split('-')[0]; // Obtener el personaje (ej: "luffy")
      const data = characterData[character]; // Buscar datos del personaje

      if (!data) {
        console.error(`No se encontraron datos para el personaje: ${character}`);
        return;
      }

      currentCharacter = character; // Guardar el personaje actual

      // Actualizar el contenido del modal
      modalContent.classList.add(`${character}-active`);
      modalContent.classList.add(`menu-${character}`); // Añadir clase dinámica para el menú
      modalTitle.textContent = data.title;

      // Configurar una imagen única para el header
      const modalHeader = modalContent.querySelector('header img');
      if (modalHeader) {
        modalHeader.src = `images/modal_headers/${character}_header.png`;
        modalHeader.alt = `${character} header`;
      } else {
        const newModalHeader = document.createElement('img');
        newModalHeader.src = `images/modal_headers/${character}_header.png`;
        newModalHeader.alt = `${character} header`;
        modalContent.querySelector('header').appendChild(newModalHeader);
      }

      // Mostrar el contenido de la pestaña "Introducción" por defecto
      updateTabContent('intro');

      // Activar solo la pestaña "Introducción" por defecto
      tabButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.classList.add(`tab-${character}`); // Añadir clase dinámica para las pestañas
      });
      document.querySelector('.tab-button[data-tab="intro"]').classList.add('active');

      // Mostrar el modal completamente superpuesto
      modal.style.display = 'flex'; // Cambiar el display para mostrar el modal
      modal.classList.add('superposed'); // Añadir clase para estilo de superposición
    });
  });

  // Resetear colores cuando el mouse sale del contenedor principal
  document.querySelector('main').addEventListener('mouseleave', removeActiveClasses);

  // Cerrar el modal
  closeModal.addEventListener('click', function () {
    modal.style.display = 'none'; // Ocultar el modal
    modal.classList.remove('superposed'); // Quitar la clase de superposición
    modalContent.className = 'modal-content'; // Resetear clases dinámicas
    tabButtons.forEach((btn) => btn.className = 'tab-button'); // Resetear clases de pestañas
  });

  // Función para actualizar el contenido de la pestaña activa
  function updateTabContent(tabId) {
    if (!currentCharacter) return; // Si no hay un personaje seleccionado, salir

    const data = characterData[currentCharacter]; // Obtener los datos del personaje actual
    if (!data) {
      console.error(`No se encontraron datos para el personaje: ${currentCharacter}`);
      return;
    }

    if (!tabContent) {
      console.error("No se encontró el contenedor '.tab-content' en el DOM.");
      return; // Salir si el contenedor no existe
    }

    // Actualizar el contenido según la pestaña seleccionada
    switch (tabId) {
      case 'intro':
        tabContent.innerHTML = `<p>${data.intro}</p>`;
        break;
      case 'powers':
        tabContent.innerHTML = `<p>${data.powers}</p>`;
        break;
      case 'misc':
        tabContent.innerHTML = `<p>${data.misc}</p>`;
        break;
      default:
        tabContent.innerHTML = `<p>No hay información disponible.</p>`;
    }
  }

  // Cambiar entre pestañas dentro del modal
  tabButtons.forEach((button) => {
    button.addEventListener('click', function () {
      // Quitar la clase activa de todos los botones
      tabButtons.forEach((btn) => btn.classList.remove('active'));

      // Activar el botón correspondiente
      this.classList.add('active');

      // Obtener el ID de la pestaña seleccionada
      const tabId = this.getAttribute('data-tab');

      // Actualizar el contenido de la pestaña activa
      updateTabContent(tabId);
    });
  });
});