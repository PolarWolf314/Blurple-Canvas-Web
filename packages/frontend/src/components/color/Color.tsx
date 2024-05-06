"use client";
import { PaletteColor } from "@blurple-canvas-web/types";
import { css, styled } from "@mui/material";
import React from "react";

export const ColorfulDiv = styled("div", {
  shouldForwardProp: (prop) => prop !== "colorString",
})<{ colorString: string }>(
  ({ colorString }) => css`
    aspect-ratio: 1;
    background-color: ${colorString};
    border-radius: var(--card-border-radius);
    border: oklch(var(--discord-white-oklch) / 30%) 3px solid;
    gap: 0.25rem;
  `,
);

interface SwatchProps {
  rgba: PaletteColor["rgba"];
  selected?: boolean;
}

export const Swatch = ({ rgba, selected = false }: SwatchProps) => {
  // Convert [255, 255, 255, 255] to rgb(255 255 255 / 1.0)
  const rgb = rgba.slice(0, 3).join(" ");
  const alphaFloat = rgba[3] / 255;

  return (
    <ColorfulDiv
      className={selected ? "selected" : undefined}
      colorString={`rgb(${rgb} / ${alphaFloat})`}
    />
  );
};

export const colorToSwatch = (color: PaletteColor, selected = false) => {
  return <Swatch key={color.code} rgba={color.rgba} selected={selected} />;
};
