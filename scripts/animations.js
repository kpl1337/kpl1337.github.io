
const animations = [ ];
animations.variables = [ ];

animations.variables.text = 'koppel\'s portfolio ';
animations.variables.animationId = null;

animations.scroll = () => {
    document.querySelector('#skills').scrollIntoView({ behavior: 'smooth' });
}

animations.rotateString = (str) => {
    return str.substring(1) + str[0];
}

animations.rotateTextAnimation = () => {
    let currentText = animations.variables.text;
    
    currentText = animations.rotateString(currentText);
    animations.variables.text = currentText;
    
    document.title = `${ currentText }`;
    animations.variables.animationId = setTimeout(animations.rotateTextAnimation, 400);
}

animations.rotateTextAnimation();

