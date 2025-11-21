import { Builder, By, until } from 'selenium-webdriver';

async function run() {
  console.log('Iniciando prueba E2E del dashboard con Selenium (Chrome)...');
  let driver;
  try {
    console.log('Creando instancia de ChromeDriver...');
    driver = await new Builder().forBrowser('chrome').build();
    console.log('ChromeDriver creado. Abriendo /login...');
    // Abre la app (login primero para poder setear localStorage sin redirecciones raras)
    await driver.get('http://localhost:3000/login');

    console.log('Página /login cargada, inyectando usuario en localStorage...');
    // Inyecta un usuario falso en localStorage para pasar el ProtectedRoute
    await driver.executeScript(`window.localStorage.setItem('usuario', '{"nombre":"Test"}');`);

    console.log('Usuario de prueba seteado. Navegando al dashboard / ...');
    // Navega al dashboard
    await driver.get('http://localhost:3000/');

    console.log('Esperando título Dashboard...');
    // Espera a que aparezca el título Dashboard
    const title = await driver.wait(
      until.elementLocated(By.css('h1.page-title')),
      15000
    );
    const titleText = await title.getText();
    console.log('Título encontrado:', titleText);
    if (!titleText.toLowerCase().includes('dashboard')) {
      throw new Error(`No se encontró el título Dashboard, texto actual: ${titleText}`);
    }

    // Verifica tarjeta Reservas del Mes
    console.log('Buscando tarjeta "Reservas del Mes"...');
    const reservasCardTitle = await driver.findElement(
      By.xpath("//div[contains(@class,'card-title') and normalize-space(text())='Reservas del Mes']")
    );
    if (!(await reservasCardTitle.isDisplayed())) {
      throw new Error('La tarjeta "Reservas del Mes" no está visible');
    }

    // Verifica tarjeta Destinos Activos
    console.log('Buscando tarjeta "Destinos Activos"...');
    const destinosCardTitle = await driver.findElement(
      By.xpath("//div[contains(@class,'card-title') and normalize-space(text())='Destinos Activos']")
    );
    if (!(await destinosCardTitle.isDisplayed())) {
      throw new Error('La tarjeta "Destinos Activos" no está visible');
    }

    // Verifica contenedor de gráfico Reservas por Mes
    console.log('Buscando gráfico "Reservas por Mes"...');
    const reservasChartTitle = await driver.findElement(
      By.xpath("//div[contains(@class,'chart-title') and normalize-space(text())='Reservas por Mes']")
    );
    if (!(await reservasChartTitle.isDisplayed())) {
      throw new Error('El gráfico "Reservas por Mes" no está visible');
    }

    // Verifica contenedor de gráfico Destinos Populares
    console.log('Buscando gráfico "Destinos Populares"...');
    const destinosChartTitle = await driver.findElement(
      By.xpath("//div[contains(@class,'chart-title') and normalize-space(text())='Destinos Populares']")
    );
    if (!(await destinosChartTitle.isDisplayed())) {
      throw new Error('El gráfico "Destinos Populares" no está visible');
    }

    console.log('✅ Prueba E2E del dashboard completada correctamente.');
  } catch (err) {
    console.error('❌ Error en la prueba E2E del dashboard:', err);
    process.exitCode = 1;
  } finally {
    if (driver) {
      // Pausa breve para que puedas ver el navegador antes de que se cierre
      try {
        await driver.sleep(5000);
      } catch {}
      await driver.quit();
    }
  }
}

run();
