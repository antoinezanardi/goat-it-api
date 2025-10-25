export const CONFIGURATION = (): { port: number } => ({
  port: Number.parseInt(process.env.PORT ?? "3000"),
});
