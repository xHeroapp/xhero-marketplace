export const animationCreate = () => {
    if (typeof window !== "undefined") {
        import("wowjs").then(() => {
            // wowjs is a CommonJS module that attaches WOW to window
            const WOW = window.WOW;
            if (WOW) {
                new WOW({ live: false }).init();
            }
        });
    }
};

