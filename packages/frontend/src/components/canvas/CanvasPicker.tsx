"use client";

import { styled } from "@mui/material";

const Select = styled("select")`
  background-color: var(--discord-old-not-quite-black);
  border-radius: var(--card-border-radius);
  border: 0;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 500;
  justify-self: flex-start;
  min-inline-size: 16rem;
  padding: 0.5rem 1.25rem;

  :hover {
    background-color: var(--discord-old-greyple);
  }

  :focus,
  :focus-visible {
    outline: var(--focus-outline);
  }
`;

export default function CanvasPicker() {
  const options = ["Foo", "Bar", "Baz"];
  return (
    <Select>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Select>
  );
}
