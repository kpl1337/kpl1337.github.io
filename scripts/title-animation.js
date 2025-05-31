let text = 'koppel\'s portfolio ';
let animationId = null;

function rotateString(str) {
    return str.substring(1) + str[0];
}

function animate() {
    let currentText = text;
    currentText = rotateString(currentText);
    text = currentText;
    document.title = `${currentText}`;
    animationId = setTimeout(animate, 400);
}

animate();