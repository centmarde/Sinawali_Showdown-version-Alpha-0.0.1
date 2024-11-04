const parallaxElements = document.querySelectorAll(".parallax");

let xValue = 0, yValue = 0;

window.addEventListener("mousemove", (e) => {
    xValue = e.clientX - window.innerWidth / 2;
    yValue = e.clientY - window.innerHeight / 2;
    

    parallaxElements.forEach((el) => {
        // Parse speed values to floats for consistent calculations
        let speedx = parseFloat(el.dataset.speedx);
        let speedy = parseFloat(el.dataset.speedy);
        
        // Apply parallax transform based on mouse position and speed
        el.style.transform = `
            translateX(calc(-50% + ${-xValue * speedx}px))
            translateY(calc(-50% + ${-yValue * speedy}px))
        `;
    });
});
