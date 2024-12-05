"use strict";

// Получение CSS-переменных
function getCssColor(name) {
  return window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(name);
}

// Функция для рисования графика
function drawCanvasGraph(coordinatesList, radioButtonR) {
  if (!radioButtonR) return;

  const xList = coordinatesList.map((coordinate) => coordinate.x);
  const yList = coordinatesList.map((coordinate) => coordinate.y);
  const rList = coordinatesList.map((coordinate) => coordinate.r);
  const hitList = coordinatesList.map((coordinate) => coordinate.result);

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
  const rValue = width / 2.5;

  drawGraph();

  function convertXToCanvasCoordinate(x, r, canvasR) {
    return (x / r) * canvasR + width / 2;
  }

  function convertYToCanvasCoordinate(y, r, canvasR) {
    return (-y / r) * canvasR + height / 2;
  }

  function drawDots() {
    for (let i = 0; i < xList.length; i++) {
      const x = convertXToCanvasCoordinate(
        xList[i],
        radioButtonR,
        rValue
      );
      const y = convertYToCanvasCoordinate(
        yList[i],
        radioButtonR,
        rValue
      );
      ctx.fillStyle = hitList[i] ? hitDotColor : missDotColor;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawHorizontalMarks() {
    ctx.strokeStyle = axisColor;
    ctx.fillStyle = labelsColor;
    ctx.beginPath();

    // Positive R/2
    ctx.fillText("R/2", width / 2 + rValue / 2 - 10, height / 2 - markLen - 5);
    ctx.moveTo(width / 2 + rValue / 2, height / 2 + markLen);
    ctx.lineTo(width / 2 + rValue / 2, height / 2 - markLen);

    // Negative R/2
    ctx.fillText("-R/2", width / 2 - rValue / 2 - 15, height / 2 - markLen - 5);
    ctx.moveTo(width / 2 - rValue / 2, height / 2 + markLen);
    ctx.lineTo(width / 2 - rValue / 2, height / 2 - markLen);

    // Positive R
    ctx.fillText("R", width / 2 + rValue - 5, height / 2 - markLen - 5);
    ctx.moveTo(width / 2 + rValue, height / 2 + markLen);
    ctx.lineTo(width / 2 + rValue, height / 2 - markLen);

    // Negative R
    ctx.fillText("-R", width / 2 - rValue - 15, height / 2 - markLen - 5);
    ctx.moveTo(width / 2 - rValue, height / 2 + markLen);
    ctx.lineTo(width / 2 - rValue, height / 2 - markLen);

    ctx.stroke();
  }

  function drawVerticalMarks() {
    ctx.strokeStyle = axisColor;
    ctx.fillStyle = labelsColor;
    ctx.beginPath();

    // Positive R/2
    ctx.fillText("R/2", width / 2 + markLen + 5, height / 2 - rValue / 2 + 5);
    ctx.moveTo(width / 2 - markLen, height / 2 - rValue / 2);
    ctx.lineTo(width / 2 + markLen, height / 2 - rValue / 2);

    // Negative R/2
    ctx.fillText("-R/2", width / 2 + markLen + 5, height / 2 + rValue / 2 + 5);
    ctx.moveTo(width / 2 - markLen, height / 2 + rValue / 2);
    ctx.lineTo(width / 2 + markLen, height / 2 + rValue / 2);

    // Positive R
    ctx.fillText("R", width / 2 + markLen + 5, height / 2 - rValue + 5);
    ctx.moveTo(width / 2 - markLen, height / 2 - rValue);
    ctx.lineTo(width / 2 + markLen, height / 2 - rValue);

    // Negative R
    ctx.fillText("-R", width / 2 + markLen + 5, height / 2 + rValue + 5);
    ctx.moveTo(width / 2 - markLen, height / 2 + rValue);
    ctx.lineTo(width / 2 + markLen, height / 2 + rValue);

    ctx.stroke();
  }

  function drawAreas() {
    ctx.fillStyle = areasColor;

    // Прямоугольник (4 четверть)
    ctx.fillRect(width / 2, height / 2, rValue, rValue);

    // Треугольник (1 четверть)
    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2);
    ctx.lineTo(width / 2, height / 2 - rValue / 2);
    ctx.lineTo(width / 2 + rValue / 2, height / 2);
    ctx.closePath();
    ctx.fill();

    // Четверть круга (2 четверть)
    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2);
    ctx.arc(width / 2, height / 2, rValue / 2, Math.PI / 2, Math.PI, false);
    ctx.closePath();
    ctx.fill();
  }

  function drawAxes() {
    ctx.strokeStyle = axisColor;

    // X-ось
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width - arrowDifference, height / 2 - arrowDifference);
    ctx.lineTo(width, height / 2);
    ctx.lineTo(width - arrowDifference, height / 2 + arrowDifference);
    ctx.stroke();

    // Y-ось
    ctx.beginPath();
    ctx.moveTo(width / 2, height);
    ctx.lineTo(width / 2, 0);
    ctx.moveTo(width / 2 - arrowDifference, arrowDifference);
    ctx.lineTo(width / 2, 0);
    ctx.lineTo(width / 2 + arrowDifference, arrowDifference);
    ctx.stroke();
  }

  function drawGraph() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    drawAreas();

    drawHorizontalMarks();
    drawVerticalMarks();

    drawAxes();

    drawDots();
  }

  // Обработчик клика по Canvas для добавления точки
  canvas.addEventListener("mousedown", function (event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const x = ((clickX - width / 2) / rValue) * radioButtonR;
    const y = ((height / 2 - clickY) / rValue) * radioButtonR;

    // Проверка значения R перед отправкой
    if (isNaN(radioButtonR)) {
      alert("Пожалуйста, выберите значение R.");
      return;
    }

    // Отправка данных на сервер через remoteCommand addAttempt
    addAttempt([
      { name: "x", value: x.toString() },
      { name: "y", value: y.toString() },
      { name: "r", value: radioButtonR.toString() }
    ]);
  });
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  // Предполагается, что drawDots уже определена в `drawDotsPanel`
  // и будет вызвана для отрисовки существующих точек
});

// Ассоциация функции с глобальным объектом
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
