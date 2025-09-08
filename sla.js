const xMin= 30;
const xMax= 390;
const yMin= 10;
const yMax= 370;

function initAxes() {
  const svg = document.getElementById("canvas");
  const width = 400;
  const height = 400;

  // Limpiar cualquier cosa previa
  svg.innerHTML = "";
    
  // Crear eje X
  const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  xAxis.setAttribute("x1", xMin);
  xAxis.setAttribute("y1", yMax);
  xAxis.setAttribute("x2", xMax);
  xAxis.setAttribute("y2", yMax);
  xAxis.setAttribute("stroke", "#ccc");
  xAxis.setAttribute("stroke-width", "2");
  svg.appendChild(xAxis);

  // Crear eje Y
  const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  yAxis.setAttribute("x1", xMin);
  yAxis.setAttribute("y1", yMin);
  yAxis.setAttribute("x2", xMin);
  yAxis.setAttribute("y2", yMax);
  yAxis.setAttribute("stroke", "#ccc");
  yAxis.setAttribute("stroke-width", "2");
  svg.appendChild(yAxis);

  // Etiqueta X
  const xlabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  xlabel.setAttribute("x", width - 20);
  xlabel.setAttribute("y", height - 20);
  xlabel.setAttribute("fill", "#ccc");
  xlabel.textContent = "x";
  svg.appendChild(xlabel);

  // Etiqueta Y
  const ylabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  ylabel.setAttribute("x", 20);
  ylabel.setAttribute("y", 20);
  ylabel.setAttribute("fill", "#ccc");
  ylabel.textContent = "y";
  svg.appendChild(ylabel);
}

// Llamar la función apenas cargue la página
window.onload = initAxes;


// Vector global donde guardaremos los vértices
let rect = [];


function generarRectangulo() {
  const svg = document.getElementById("canvas");
  const width = parseInt(svg.getAttribute("width"));
  const height = parseInt(svg.getAttribute("height"));

  // Eliminar rectángulos previos (sin borrar ejes ni otros elementos)
  const oldRects = svg.querySelectorAll("rect");
  oldRects.forEach(r => r.remove());

  // Generar dimensiones aleatorias entre 10 y 270
  const rectWidth = Math.floor(Math.random() * 261) + 10;  // 10–270
  const rectHeight = Math.floor(Math.random() * 261) + 10; // 10–270

  // Límites para que no cruce ejes
  const minX = 30 + rectWidth / 2 + 5;
  const maxX = width - rectWidth / 2 - 5;

  const minY = 10 + rectHeight / 2;
  const maxY = (height - 30) - rectHeight / 2 - 5;

  // Generar centro aleatorio en zona válida
  const centerX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
  const centerY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

  // Calcular esquina superior izquierda
  const x = centerX - rectWidth / 2;
  const y = centerY - rectHeight / 2;

  // Crear rectángulo
  const newRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  newRect.setAttribute("x", x);
  newRect.setAttribute("y", y);
  newRect.setAttribute("width", rectWidth);
  newRect.setAttribute("height", rectHeight);
  newRect.setAttribute("fill", "rgba(0,150,255,0.3)");
  newRect.setAttribute("stroke", "#09f");
  newRect.setAttribute("stroke-width", "2");

  svg.appendChild(newRect);

  // Guardar vértices en el vector rect
  rect = [
    { x: x, y: y },                           // arriba izquierda
    { x: x + rectWidth, y: y },               // arriba derecha
    { x: x + rectWidth, y: y + rectHeight },  // abajo derecha
    { x: x, y: y + rectHeight }               // abajo izquierda
  ];
}

// Asociar al botón "Generar rectángulo"
document.querySelector("form#rectForm button[type=submit]").addEventListener("click", function (e) {
  e.preventDefault(); // evitar recargar página
  generarRectangulo();
});

// Vectores globales para las dos clases
let class1 = []; // dentro del rectángulo
let class2 = []; // fuera del rectángulo

function generarPuntos(n) {
  const svg = document.getElementById("canvas");

  // Eliminar puntos previos (pero no ejes ni rectángulos)
  const oldPoints = svg.querySelectorAll("circle.point, rect.point");
  oldPoints.forEach(p => p.remove());

  // Limpiar vectores globales
  class1Points = [];
  class2Points = [];

  // Calcular límites del rectángulo actual
  if (rect.length === 0) {
    alert("Primero genera un rectángulo antes de graficar puntos.");
    return;
  }
  const rectXmin = rect[0].x;
  const rectYmin = rect[0].y;
  const rectXmax = rect[1].x;
  const rectYmax = rect[2].y;

  for (let i = 0; i < n; i++) {
    // Generar un punto aleatorio dentro del área de la gráfica
    const x = Math.floor(Math.random() * (xMax - xMin + 1)) + xMin;
    const y = Math.floor(Math.random() * (yMax - yMin + 1)) + yMin;

    // Revisar si cae dentro del rectángulo
    if (x >= rectXmin && x <= rectXmax && y >= rectYmin && y <= rectYmax) {
      // Clase 1 → círculo azul
      class1Points.push({ x, y });

      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", x);
      dot.setAttribute("cy", y);
      dot.setAttribute("r", 3);
      dot.setAttribute("fill", "red");
      dot.setAttribute("class", "point");
      svg.appendChild(dot);
    } else {
      // Clase 2 → cuadrado negro
      class2Points.push({ x, y });

      const sq = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      sq.setAttribute("x", x - 2);
      sq.setAttribute("y", y - 2);
      sq.setAttribute("width", 4);
      sq.setAttribute("height", 4);
      sq.setAttribute("fill", "black");
      sq.setAttribute("class", "point");
      svg.appendChild(sq);
    }
  }
}



// ---- Asociar el botón del form nForm ----
document.querySelector("form#nForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const n = parseInt(document.getElementById("states").value);
  if (!isNaN(n) && n > 0) {
    generarPuntos(n);
  } else {
    alert("Ingresa un número válido de puntos");
  }
});




// Vector global para guardar rectángulo predicho
let rectPred = [];

// Función para calcular distancia Euclidiana
function distancia(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

function aplicarCentroide() {
  const svg = document.getElementById("canvas");

  if (class1Points.length === 0 || class2Points.length === 0) {
    alert("Primero genera puntos y un rectángulo antes de aplicar el algoritmo Centroide.");
    return;
  }

  // 1. Calcular centroide de clase 1
  const cx = class1Points.reduce((acc, p) => acc + p.x, 0) / class1Points.length;
  const cy = class1Points.reduce((acc, p) => acc + p.y, 0) / class1Points.length;

  // 2. Encontrar min y max de clase 1
  const minX = Math.min(...class1Points.map(p => p.x));
  const maxX = Math.max(...class1Points.map(p => p.x));
  const minY = Math.min(...class1Points.map(p => p.y));
  const maxY = Math.max(...class1Points.map(p => p.y));

  // 3. Buscar puntos clase 2 más cercanos a cada borde
  let closestLeft = null, closestRight = null, closestTop = null, closestBottom = null;
  let dLeft = Infinity, dRight = Infinity, dTop = Infinity, dBottom = Infinity;

  class2Points.forEach(p => {
    // distancia al borde izquierdo
    let dl = Math.abs(p.x - minX);
    if (dl < dLeft) { dLeft = dl; closestLeft = p; }

    // distancia al borde derecho
    let dr = Math.abs(p.x - maxX);
    if (dr < dRight) { dRight = dr; closestRight = p; }

    // distancia al borde superior
    let dt = Math.abs(p.y - minY);
    if (dt < dTop) { dTop = dt; closestTop = p; }

    // distancia al borde inferior
    let db = Math.abs(p.y - maxY);
    if (db < dBottom) { dBottom = db; closestBottom = p; }
  });

  // 4. Definir bordes como punto medio entre extremos clase1 y vecinos clase2
  const newMinX = closestLeft ? (minX + closestLeft.x) / 2 : minX;
  const newMaxX = closestRight ? (maxX + closestRight.x) / 2 : maxX;
  const newMinY = closestTop ? (minY + closestTop.y) / 2 : minY;
  const newMaxY = closestBottom ? (maxY + closestBottom.y) / 2 : maxY;

  // Guardar coordenadas en vector global
  rectPred = [
    { x: newMinX, y: newMinY },   // arriba izquierda
    { x: newMaxX, y: newMinY },   // arriba derecha
    { x: newMaxX, y: newMaxY },   // abajo derecha
    { x: newMinX, y: newMaxY }    // abajo izquierda
  ];

  // Dibujar rectángulo verde
  const rectWidth = newMaxX - newMinX;
  const rectHeight = newMaxY - newMinY;

  const newRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  newRect.setAttribute("x", newMinX);
  newRect.setAttribute("y", newMinY);
  newRect.setAttribute("width", rectWidth);
  newRect.setAttribute("height", rectHeight);
  newRect.setAttribute("fill", "rgba(0,255,0,0.3)");
  newRect.setAttribute("stroke", "green");
  newRect.setAttribute("stroke-width", "2");

  svg.appendChild(newRect);
}


// Asociar al botón
document.getElementById("algoBtn").addEventListener("click", function (e) {
  e.preventDefault();

  const checkCentroide = document.getElementById("algCentroide").checked;

  if (checkCentroide) {
    aplicarCentroide();
  } else {
    alert("Debes seleccionar al menos un algoritmo.");
  }
});

// Evaluación
function evaluarAlgoritmo() {


  // Área total de la gráfica
  const areaTotal = (xMax - xMin) * (yMax - yMin);

  // Áreas individuales
  const areaReal = (rect[1].x - rect[0].x) * (rect[2].y - rect[1].y);
  const areaPred = (rectPred[1].x - rectPred[0].x) * (rectPred[2].y - rectPred[1].y);

  // Calcular intersección
  const ixMin = Math.max(rect[0].x, rectPred[0].x);
  const iyMin = Math.max(rect[0].y, rectPred[0].y);
  const ixMax = Math.min(rect[1].x, rectPred[1].x);
  const iyMax = Math.min(rect[2].y, rectPred[2].y);

  let areaInter = 0;
  if (ixMax > ixMin && iyMax > iyMin) {
    areaInter = (ixMax - ixMin) * (iyMax - iyMin);
  }

  // Matriz de confusión por áreas
  const TP = areaInter;
  const FN = areaReal - TP;
  const FP = areaPred - TP;
  const TN = areaTotal - (TP + FN + FP);

  // Métricas
  const sensibilidad = TP / (TP + FN);          // Sensibilidad = TP/(TP+FN)
  const especificidad = TN / (TN + FP);         // Especificidad = TN/(TN+FP)
  const precision = TP / (TP + FP);             // Precisión = TP/(TP+FP)
  const npv = TN / (TN + FN);                   // NPV = TN/(TN+FN)
  const accuracy = (TP + TN) / areaTotal;       // Exactitud = (TP+TN)/(Total)

  // Mostrar en la página
  const resDiv = document.getElementById("results");
  resDiv.innerHTML = `
    <h3 style="color: #666;">Reporte de Evaluación del Algoritmo de Aprendizaje Simbólico</h3>
    <p style="color: #aaa; list-style: none; line-height: 1.6;">
        <strong>TP</strong> = ${TP.toFixed(2)},    <strong>FN </strong> = ${FN.toFixed(2)}, <br>
      <strong>FP </strong> = ${FP.toFixed(2)},    <strong>TN </strong> = ${TN.toFixed(2)}</p>

    <p style="color: #aaa; list-style: none; line-height: 1.6;"><strong>Sensibilidad:</strong> TP/(TP+FN) = ${sensibilidad.toFixed(3)}</p>
    <p style="color: #aaa; list-style: none; line-height: 1.6;"><strong>Especificidad:</strong> TN/(TN+FP) = ${especificidad.toFixed(3)}</p>

    <p style="color: #aaa; list-style: none; line-height: 1.6;"><strong>Precisión:</strong> TP/(TP+FP) = ${precision.toFixed(3)}</p>
    <p style="color: #aaa; list-style: none; line-height: 1.6;"><strong>Valor predictivo negativo:</strong> TN/(TN+FN) = ${npv.toFixed(3)}</p>

    <p style="color: #aaa; list-style: none; line-height: 1.6;"><strong>Exactitud:</strong> (TP+TN)/(TP+TN+FP+FN) = ${accuracy.toFixed(3)}</p>

  
    <form id="eForm" >
      <p style="color: #666;  margin = 6em; list-style: none; line-height: 1.6;"><strong>Listo</strong> </p>
      
      <p style="color: #ddd; list-style: cursive; line-height: 1;"> Área total de la gráfica = 360 px x 360 px = 129600 px </p>
    </form>

  `;
    
}

// Asociar al botón Evaluar
document.querySelector("form#vForm").addEventListener("submit", function (e) {
  e.preventDefault();
  evaluarAlgoritmo();
});
