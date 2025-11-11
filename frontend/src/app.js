// Lógica de la aplicación

/**
 * Inicializa los event listeners del sidebar
 */
export const initializeSidebar = () => {
    const toggleButton = document.querySelector('.toggle-sidebar');
    
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleSidebar);
    }
};

/**
 * Alterna la visibilidad del sidebar
 */
export const toggleSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar && mainContent) {
        sidebar.classList.toggle('collapsed');
        if (sidebar.classList.contains('collapsed')) {
            sidebar.style.width = '70px';
            mainContent.style.marginLeft = '70px';
        } else {
            sidebar.style.width = '250px';
            mainContent.style.marginLeft = '250px';
        }
    }
};

/**
 * Inicializa los items del menú
 */
export const initializeMenuItems = () => {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => {
                i.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
};

/**
 * Inicializa la funcionalidad de búsqueda
 */
export const initializeSearch = () => {
    const searchInput = document.querySelector('.search-box input');
    
    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.classList.add('focused');
        });
        
        searchInput.addEventListener('blur', () => {
            searchInput.parentElement.classList.remove('focused');
        });
    }
};

/**
 * Inicializa todos los event listeners
 */
export const initializeApp = () => {
    initializeSidebar();
    initializeMenuItems();
    initializeSearch();
};
