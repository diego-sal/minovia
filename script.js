let audio = document.getElementById('audiodefondo')
let sonidito = document.getElementById('sonidito')
let hasrun = false


audio.volume = 1
sonidito.volume = 0.7




document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "z" && !hasrun) { // Detecta 'z' o 'Z' de manera case-insensitive
        hasrun = true 
        document.getElementById('activador').style.display = "none"
        document.getElementById('texto').style.display = "flex"
        audio.play()
        const paragraphs = document.querySelectorAll("#texto p");
        let paragraphIndex = 0;

        function typeParagraph(paragraph) {
            if (!paragraph) return; // Evita errores si no hay más párrafos

            paragraph.style.display = "block";
            const content = paragraph.innerHTML; // Guarda el contenido con HTML
            paragraph.innerHTML = ""; // Limpia el párrafo
            let i = 0;

            function typeChar() {
                if (i < content.length) {
                    let currentChar = content[i];

                    // Si encuentra una etiqueta <span>, avanza hasta el cierre de la etiqueta
                    if (currentChar === "<" && content.substring(i, i + 5) === "<span") {
                        const closingTagIndex = content.indexOf("</span>", i);
                        i = closingTagIndex + 7; // Salta la longitud de "</span>"
                    } else {
                        // Muestra el carácter en pantalla
                        paragraph.innerHTML = content.substring(0, i + 1);

                        // Reproduce sonido solo si el carácter no es un espacio
                        if (currentChar !== " ") {
                            sonidito.currentTime = 0; // Resetea el tiempo del sonido para superponerlo
                            sonidito.play();
                        }

                        i++;

                        // Si el carácter es una coma, un punto o un guion, hacer una pausa más larga
                        let delay = 90; // Tiempo normal
                        if ([",", ".", "-"].includes(currentChar)) {
                            delay = 300; // Pausa más larga en esos caracteres
                        }

                        setTimeout(typeChar, delay);
                        return;
                    }

                    setTimeout(typeChar, 90); // Velocidad de escritura normal
                } else {
                    paragraphIndex++;
                    if (paragraphIndex < paragraphs.length) {
                        setTimeout(() => typeParagraph(paragraphs[paragraphIndex]), 500);
                    } else {
                        // Si ya se escribieron todos los párrafos, cambia el fondo
                        cambiarFondo();
                    }
                }
            }

            typeChar();
        }

        function checkParagraphVisibility() {
            for (let i = 0; i < paragraphs.length; i++) {
                if (i !== paragraphIndex) {
                    paragraphs[i].style.display = "none";
                }
            }

            const rect = paragraphs[paragraphIndex].getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

            if (isVisible && rect.top < window.innerHeight / 2) {
                typeParagraph(paragraphs[paragraphIndex]);
                window.removeEventListener("scroll", checkParagraphVisibility);
            }
        }

        window.addEventListener("scroll", checkParagraphVisibility);
        checkParagraphVisibility();
    }
});

// Función para cambiar el fondo con animación
function cambiarFondo() {
    document.body.classList.add("animacion-fondo");
}