import { DiscordUserProfile } from "@blurple-canvas-web/types";
declare global {
  namespace Express {
    interface User extends DiscordUserProfile {}
  }
}
