import { styled } from "@mui/material";

import { DiscordUserProfile, Palette, Point } from "@blurple-canvas-web/types";

import {
  useActiveCanvasContext,
  useAuthContext,
  useSelectedColorContext,
  useSelectedPixelLocationContext,
} from "@/contexts";
import { usePalette } from "@/hooks";
import { DynamicAnchorButton, DynamicButton } from "../../button";
import { InteractiveSwatch } from "../../swatch";
import { Heading } from "../ActionPanel";
import { ActionPanelTabBody } from "./ActionPanelTabBody";
import BotCommandCard from "./BotCommandCard";
import ColorInfoCard from "./SelectedColorInfoCard";

const ColorPicker = styled("div")`
  display: grid;
  gap: 0.25rem;
  grid-template-columns: repeat(5, 1fr);
`;

export const CoordinateLabel = styled("span")`
  opacity: 0.6;
`;

export const partitionPalette = (palette: Palette) => {
  const mainColors: Palette = [];
  const partnerColors: Palette = [];
  for (const color of palette) {
    (color.global ? mainColors : partnerColors).push(color);
  }

  return [mainColors, partnerColors];
};

function userWithinServer(user: DiscordUserProfile, serverId: string) {
  return false;
  // return user.guilds.some((guild) => guild.id === serverId);
}

interface PlacePixelTabProps {
  eventId: number | null;
  active?: boolean;
}

export default function PlacePixelTab({
  active = false,
  eventId,
}: PlacePixelTabProps) {
  const { data: palette = [], isLoading: paletteIsLoading } = usePalette(
    eventId ?? undefined,
  );
  const [mainColors, partnerColors] = partitionPalette(palette);

  const { color: selectedColor, setColor: setSelectedColor } =
    useSelectedColorContext();

  const { user } = useAuthContext();
  const { canvas } = useActiveCanvasContext();

  const { coords } = useSelectedPixelLocationContext();

  const inviteSlug = selectedColor?.invite;
  const hasInvite = !!inviteSlug;
  const serverInvite =
    hasInvite ? `https://discord.gg/${inviteSlug}` : undefined;

  const selectedCoordinates = coords;
  const x = selectedCoordinates?.x;
  const y = selectedCoordinates?.y;

  const webPlacingEnabled = canvas.webPlacingEnabled;

  const canPlacePixel =
    webPlacingEnabled &&
    selectedColor &&
    user &&
    (selectedColor.global || userWithinServer(user, selectedColor.guildId));

  const readOnly = canvas.isLocked;

  const isJoinServerShown =
    (!canPlacePixel || readOnly) && !selectedColor?.global && serverInvite;

  const isSelected = selectedCoordinates && selectedColor;

  return (
    <ActionPanelTabBody active={active}>
      <ColorPicker>
        <Heading>Main colors</Heading>
        {mainColors.map((color) => (
          <InteractiveSwatch
            key={color.code}
            rgba={color.rgba}
            onAction={() => setSelectedColor(color)}
            selected={color === selectedColor}
          />
        ))}
        <Heading>Partner colors</Heading>
        {partnerColors.map((color) => (
          <InteractiveSwatch
            key={color.code}
            onAction={() => setSelectedColor(color)}
            rgba={color.rgba}
            selected={color === selectedColor}
          />
        ))}
      </ColorPicker>
      <ColorInfoCard color={selectedColor} invite={serverInvite} />
      {canPlacePixel && !readOnly && (
        <DynamicButton
          color={selectedColor}
          disabled={paletteIsLoading || !selectedColor}
        >
          {isSelected ? "Place pixel" : "Select a pixel"}
          <CoordinateLabel>
            {isSelected ? `(${x},\u00A0${y})` : undefined}
          </CoordinateLabel>
        </DynamicButton>
      )}
      {isJoinServerShown && (
        <DynamicAnchorButton color={selectedColor} href={serverInvite}>
          Join {selectedColor?.guildName ?? "server"}
        </DynamicAnchorButton>
      )}
      {!readOnly && isSelected && (
        <BotCommandCard
          color={selectedColor}
          coordinates={selectedCoordinates}
        />
      )}
    </ActionPanelTabBody>
  );
}
