export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Main background
        mainBackground: "#F5F5DC", // Light beige color

        // Secondary background
        secondaryBackground: "#FFFDD0", // Cream color

        // Button background
        buttonHover: "#F4A460", // Sandy brown color

        buttonBackground: "#8B4513", // Saddle brown color
        // Main text color
        mainText: "#D2691E", // Chocolate brown

        // Other text color
        otherText: "#4E3B31", // Cocoa brown

        // Additional colors can be added here if needed
      },
    },
  },
  plugins: [],
};
