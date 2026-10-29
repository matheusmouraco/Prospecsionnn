/*------------------------------------------
	= line active aniamtion
	-------------------------------------------*/
	document.addEventListener("DOMContentLoaded", () => {

    // Select the first line element.
    const originalLine = document.querySelector(".line");
    if (!originalLine) return;

    const parent = originalLine.parentNode;
    const screenWidth = window.innerWidth;

    // Line spacing
    const lineWidth = 2;
    const lineGap = screenWidth > 1024 ? 15 : 10;
    const totalWidth = lineWidth + lineGap;

    // Number of duplicated lines
    const lineCount = Math.floor(screenWidth / totalWidth);

    // Parent height 
    const sectionHeight = parent.clientHeight;

    // Responsive dynamic height ranges
    let minH = 0;
    let maxH = 0;

    if (screenWidth >= 821) {
        minH = screenWidth * (350 / 1920);
        maxH = sectionHeight - 70;
    } else if (screenWidth >= 501) {
        minH = screenWidth * (700 / 1920);
        maxH = sectionHeight - 100;
    } else if (screenWidth >= 361) {
        minH = screenWidth * (100 / 1920);
        maxH = sectionHeight - 130;
    } else {
        minH = screenWidth * (1800 / 1920);
        maxH = sectionHeight - 100;
    }

    // Height calculation function (smooth + wave effect)
    const getHeight = (p) => {
        const base = minH + (maxH - minH) * Math.pow(p, 1.5);
        const wave =
            Math.sin(p * Math.PI * 4.7) *
            sectionHeight *
            (screenWidth > 500 ? 0.09 : 0.07) *
            (1 - Math.pow(p - 0.5, 2));
        return base + wave;
    };

    // Generate lines
    for (let i = 0; i <= lineCount; i++) {
        const line = i === 0 ? originalLine : originalLine.cloneNode(true);
        if (i !== 0) parent.appendChild(line);

        const progress = i / (lineCount - 1 || 1);
        const height = getHeight(progress);

        line.style.height = `${height}px`;
        line.style.left = `${i * totalWidth}px`;

        if (!line.querySelector(".dot")) {
            const dot = document.createElement("span");
            dot.className = "dot";
            line.appendChild(dot);
        }
    }

    // GSAP Animation
    const lines = gsap.utils.toArray(".line");
    const endIndex = screenWidth > 500 ? lines.length - 6 : lines.length - 5;

    let animation = null;
    let activeIndex = -1;

    // Run animation
    const startAnimation = () => {
        if (animation) animation.kill();

        lines.forEach((l) => l.classList.remove("act", "dot-act"));
        activeIndex = -1;

        animation = gsap.to({}, {
            duration: endIndex * 0.03,
            onUpdate() {
                const prog = this.progress();
                const targetIndex = Math.floor(prog * endIndex);

                if (targetIndex !== activeIndex) {
                    if (activeIndex >= 0 && activeIndex < endIndex) {
                        lines[activeIndex].classList.remove("act", "dot-act");
                    }
                    if (targetIndex >= 0 && targetIndex < endIndex) {
                        lines[targetIndex].classList.add("act", "dot-act");
                    }
                    activeIndex = targetIndex;
                }
            },
            onComplete() {
                lines[endIndex].classList.add("act", "dot-act");
            }
        });
    };

    // ScrollTrigger
    ScrollTrigger.create({
        trigger: ".s2",
        start: "top 0%",
        end: "bottom 20%",
        onEnter: startAnimation,
        onLeave: () => reset(),
        onLeaveBack: () => reset(),
    });

    const reset = () => {
        if (animation) animation.kill();
        lines.forEach((l, i) => {
            if (i < endIndex) l.classList.remove("act", "dot-act");
        });
    };
});
