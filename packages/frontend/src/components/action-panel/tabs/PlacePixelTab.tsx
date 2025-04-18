import { Skeleton, styled } from "@mui/material";

import { Palette } from "@blurple-canvas-web/types";

import {
  useAuthContext,
  useCanvasContext,
  useSelectedColorContext,
} from "@/contexts";
import { usePalette } from "@/hooks";
import { DynamicAnchorButton, PlacePixelButton } from "../../button";
import { InteractiveSwatch } from "../../swatch";
import { Heading } from "../ActionPanel";
import { ScrollBlock, TabBlock } from "./ActionPanelTabBody";
import { ActionPanelTabBody } from "./ActionPanelTabBody";
import BotCommandCard from "./BotCommandCard";
import ColorInfoCard from "./SelectedColorInfoCard";

const ColorPicker = styled("div")`
  display: grid;
  gap: 0.25rem;
  grid-template-columns: repeat(5, 1fr);
`;

const PlacePixelTabBlock = styled(TabBlock)`
  grid-template-rows: 1fr auto;
`;

export const CoordinateLabel = styled("span")`
  opacity: 0.6;
`;

const SwatchSkeleton = styled(Skeleton)`
  aspect-ratio: 1;
  border-radius: 0.5rem;
  width: 100%;
  height: auto;
`;

export const partitionPalette = (palette: Palette) => {
  const mainColors: Palette = [];
  const partnerColors: Palette = [];
  for (const color of palette) {
    (color.global ? mainColors : partnerColors).push(color);
  }

  return [mainColors, partnerColors];
};

// function userWithinServer(user: DiscordUserProfile, serverId: string) {
//   return false;
//   const guildIds = decodeUserGuildsBase64(user);
//   return guildIds.some((guildId) => guildId === serverId);
// }

interface PlacePixelTabProps {
  active?: boolean;
  eventId: number | null;
}

export default function PlacePixelTab({
  active = false,
  eventId,
}: PlacePixelTabProps) {
  const { data: palette = [] } = usePalette(eventId ?? undefined);
  const [mainColors, partnerColors] = partitionPalette(palette);

  const { color: selectedColor, setColor: setSelectedColor } =
    useSelectedColorContext();

  const { user } = useAuthContext();
  const { canvas } = useCanvasContext();

  const inviteSlug = selectedColor?.invite;
  const hasInvite = !!inviteSlug;
  const serverInvite =
    hasInvite ? `https://discord.gg/${inviteSlug}` : undefined;

  const webPlacingEnabled = canvas.webPlacingEnabled;

  const canPlacePixel =
    webPlacingEnabled && (!selectedColor || selectedColor.global);

  const readOnly = canvas.isLocked;

  const isJoinServerShown =
    (!(canPlacePixel && user) || readOnly) &&
    !selectedColor?.global &&
    serverInvite;

  return (
    <PlacePixelTabBlock active={active}>
      <ScrollBlock>
        <ActionPanelTabBody>
          <ColorPicker>
            <Heading>Main colors</Heading>
            {mainColors.length ?
              mainColors.map((color) => (
                <InteractiveSwatch
                  key={color.code}
                  rgba={color.rgba}
                  onAction={() => setSelectedColor(color)}
                  selected={color === selectedColor}
                />
              ))
            : Array.from({ length: 12 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: These will never change
                <SwatchSkeleton key={i} variant="rectangular" />
              ))
            }
            <Heading>Partner colors</Heading>
            {partnerColors.length ?
              partnerColors.map((color) => (
                <InteractiveSwatch
                  key={color.code}
                  onAction={() => setSelectedColor(color)}
                  rgba={color.rgba}
                  selected={color === selectedColor}
                />
              ))
            : Array.from({ length: 13 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: These will never change
                <SwatchSkeleton key={i} variant="rectangular" />
              ))
            }
          </ColorPicker>
        </ActionPanelTabBody>
      </ScrollBlock>
      <ActionPanelTabBody>
        <ColorInfoCard color={selectedColor} invite={serverInvite} />
        {canPlacePixel && <PlacePixelButton />}
        {isJoinServerShown && (
          <DynamicAnchorButton color={selectedColor} href={serverInvite}>
            Join {selectedColor?.guildName ?? "server"}
          </DynamicAnchorButton>
        )}
        {!readOnly && <BotCommandCard />}
      </ActionPanelTabBody>
    </PlacePixelTabBlock>
  );
}
