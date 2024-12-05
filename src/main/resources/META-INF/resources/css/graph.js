"use strict";

// Флаг для отслеживания добавления обработчика
let listenerAdded = false;

// Получение CSS-переменных
function getCssColor(name) {
  return window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(name);
}



function getCurrentRValue() {
  const rValueElement = document.getElementById('rValue');
  if (rValueElement) {
    const r = parseFloat(rValueElement.textContent);
    if (!isNaN(r)) {
      return r;
    }
  }
  return NaN;
}


// Функция для рисования графика
function drawCanvasGraph(coordinatesList, r) {
  console.log('drawCanvasGraph called with:', coordinatesList, r);

  if (!r) {
    return;
  }

  const xList = coordinatesList.map((coordinate) => coordinate.x);
  const yList = coordinatesList.map((coordinate) => coordinate.y);
  const hitList = coordinatesList.map((coordinate) => coordinate.result === true || coordinate.result === 'true');


  const markLen = 10;
  const arrowDifference = 10;
  const bgColor = getCssColor("--secondary-background") || "#ffffff";
  const labelsColor = getCssColor("--secondary-text") || "#000000";
  const axisColor = getCssColor("--primary-text") || "#000000";
  const areasColor = getCssColor("--areas-color") || "rgba(30, 144, 255, 0.5)";

  const hitDotColor = getCssColor("--hit-dot-color") || "green";
  const missDotColor = getCssColor("--miss-dot-color") || "red";

  const canvas = document.getElementById("graph");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  // Определение границ логических координат
  const minX = -5;
  const maxX = 5;
  const minY = -5;
  const maxY = 5;

  const scaleX = width / (maxX - minX);
  const scaleY = height / (maxY - minY);

  // Функции конвертации координат
  function convertXToCanvasCoordinate(x) {
    return canvas.width / 2 + x * scaleX;
  }

  function convertYToCanvasCoordinate(y) {
    return canvas.height / 2 - y * scaleY; // Обратите внимание на минус
  }

  function convertCanvasToLogicalX(xCanvas) {
    return (xCanvas - canvas.width / 2) / scaleX;
  }

  function convertCanvasToLogicalY(yCanvas) {
    return (canvas.height / 2 - yCanvas) / scaleY;
  }

  // Рисование точек
  function drawDots() {
    for (let i = 0; i < xList.length; i++) {
      const x = convertXToCanvasCoordinate(xList[i]);
      const y = convertYToCanvasCoordinate(yList[i]);
      ctx.fillStyle = hitList[i] ? hitDotColor : missDotColor;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Рисование горизонтальных меток
  function drawHorizontalMarks() {
    ctx.strokeStyle = axisColor;
    ctx.fillStyle = labelsColor;
    ctx.beginPath();

    const yAxisPosition = convertYToCanvasCoordinate(0);

    for (let x = minX + 1; x < maxX; x++) {
      if (x !== 0) {
        const xCanvas = convertXToCanvasCoordinate(x);
        ctx.moveTo(xCanvas, yAxisPosition - markLen / 2);
        ctx.lineTo(xCanvas, yAxisPosition + markLen / 2);
        ctx.fillText(x.toString(), xCanvas - 5, yAxisPosition + 15);
      }
    }

    ctx.stroke();
  }

  // Рисование вертикальных меток
  function drawVerticalMarks() {
    ctx.strokeStyle = axisColor;
    ctx.fillStyle = labelsColor;
    ctx.beginPath();

    const xAxisPosition = convertXToCanvasCoordinate(0);

    for (let y = minY + 1; y < maxY; y++) {
      if (y !== 0) {
        const yCanvas = convertYToCanvasCoordinate(y);
        ctx.moveTo(xAxisPosition - markLen / 2, yCanvas);
        ctx.lineTo(xAxisPosition + markLen / 2, yCanvas);
        ctx.fillText(y.toString(), xAxisPosition + 5, yCanvas + 5);
      }
    }

    ctx.stroke();
  }

  // Рисование областей
  function drawAreas() {
    ctx.fillStyle = areasColor;

    // Треугольник (2 четверть)
    ctx.beginPath();
    ctx.moveTo(convertXToCanvasCoordinate(0), convertYToCanvasCoordinate(0)); // (0, 0)
    ctx.lineTo(convertXToCanvasCoordinate(-r / 2), convertYToCanvasCoordinate(0)); // (-R/2, 0)
    ctx.lineTo(convertXToCanvasCoordinate(0), convertYToCanvasCoordinate(r)); // (0, R)
    ctx.closePath();
    ctx.fill();

    // Прямоугольник (1 четверть)
    ctx.beginPath();
    ctx.moveTo(convertXToCanvasCoordinate(0), convertYToCanvasCoordinate(0));
    ctx.lineTo(convertXToCanvasCoordinate(r), convertYToCanvasCoordinate(0));
    ctx.lineTo(convertXToCanvasCoordinate(r), convertYToCanvasCoordinate(r / 2));
    ctx.lineTo(convertXToCanvasCoordinate(0), convertYToCanvasCoordinate(r / 2));
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(convertXToCanvasCoordinate(0), convertYToCanvasCoordinate(0));
    ctx.arc(
      convertXToCanvasCoordinate(0),
      convertYToCanvasCoordinate(0),
      (r) * scaleX,
      0.5 * Math.PI, // Начальный угол: 90 градусов
      Math.PI,       // Конечный угол: 180 градусов
      false          // Рисуем по часовой стрелке
    );
    ctx.closePath();
    ctx.fill();
  }

  // Рисование осей
  function drawAxes() {
    ctx.strokeStyle = axisColor;

    // X-ось
    ctx.beginPath();
    const yAxisPosition = convertYToCanvasCoordinate(0);
    ctx.moveTo(0, yAxisPosition);
    ctx.lineTo(width, yAxisPosition);
    // Стрелка
    ctx.moveTo(width - arrowDifference, yAxisPosition - arrowDifference);
    ctx.lineTo(width, yAxisPosition);
    ctx.lineTo(width - arrowDifference, yAxisPosition + arrowDifference);
    ctx.stroke();

    // Y-ось
    ctx.beginPath();
    const xAxisPosition = convertXToCanvasCoordinate(0);
    ctx.moveTo(xAxisPosition, height);
    ctx.lineTo(xAxisPosition, 0);
    // Стрелка
    ctx.moveTo(xAxisPosition - arrowDifference, arrowDifference);
    ctx.lineTo(xAxisPosition, 0);
    ctx.lineTo(xAxisPosition + arrowDifference, arrowDifference);
    ctx.stroke();
  }

  // Полное рисование графика
  function drawGraph() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    drawAreas();
    drawAxes();
    drawHorizontalMarks();
    drawVerticalMarks();
    drawDots();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // Инициализация обработчика события только один раз
  if (!listenerAdded) {
    canvas.addEventListener("mousedown", function (event) {
      if (window.isRequestInProgress) {
        console.warn("Запрос уже обрабатывается. Пожалуйста, подождите.");
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      const x = convertCanvasToLogicalX(clickX);
      const y = convertCanvasToLogicalY(clickY);
      window.isRequestInProgress = true;

      // Отправка данных на сервер через remoteCommand addAttempt
      addAttempt([
        { name: 'x', value: x.toString() },
        { name: 'y', value: y.toString() },
        { name: 'r', value: r.toString() }
      ]);
    });
    listenerAdded = true;
    // handleClick();
  }

  // Функция сброса флага после завершения запроса
  window.onAddAttemptComplete = function () {
    window.isRequestInProgress = false;
  };

  // Рисуем график
  drawGraph();
}

// Инициализация при загрузке страницы
// document.addEventListener("DOMContentLoaded", function () {
//   const canvas = document.getElementById("graph");
//   const ctx = canvas.getContext("2d");
//   window.canvas = canvas;
//   window.ctx = ctx;
//
//   // Изначально рисуем график
//   drawCanvasGraph([]);
// });


window.drawDots = drawCanvasGraph;

function updateErrorMessageR(r) {
  document.querySelector("#error-message").innerHTML = r ? "" : "R не установлено";
}

window.updateErrorMessageR = updateErrorMessageR;

// Функция для переключения видимости таблицы
function toggleTable(data) {
  if (data.status === 'success') {
    const table = document.getElementById('resultsTable');
    table.style.display = table.style.display === 'none' ? 'block' : 'none';
  }
}

// function handleClick() {
//   canvas.addEventListener("mousedown", function (event) {
//     if (window.isRequestInProgress) {
//       console.warn("Запрос уже обрабатывается. Пожалуйста, подождите.");
//       return;
//     }
//
//     const rect = canvas.getBoundingClientRect();
//     const clickX = event.clientX - rect.left;
//     const clickY = event.clientY - rect.top;
//
//     const x = convertCanvasToLogicalX(clickX);
//     const y = convertCanvasToLogicalY(clickY);
//     window.isRequestInProgress = true;
//
//     // Отправка данных на сервер через remoteCommand addAttempt
//     addAttempt([
//       { name: 'x', value: x.toString() },
//       { name: 'y', value: y.toString() },
//       { name: 'r', value: r.toString() }
//     ]);
//   });
//   listenerAdded = true;
// }

// window.onload = function() {
//   handleClick();
// }
