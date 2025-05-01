import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.aiexam.app",
  appName: "AIExam",
  webDir: "out", // Убедись, что в папке `out/` есть index.html после next export
};

export default config;
