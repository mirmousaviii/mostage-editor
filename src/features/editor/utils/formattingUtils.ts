/**
 * Utility functions for text formatting operations
 */

import { isTextFormatted, removeMarkers } from "./textUtils";

/**
 * Checks if markers wrap around the selection (markers are outside selection)
 */
export const checkMarkersAroundSelection = (
  text: string,
  start: number,
  end: number,
  selectedText: string,
  marker: string,
  closing: string
): { isFormatted: boolean; actualStart?: number; actualEnd?: number } => {
  const searchBefore = Math.max(0, start - marker.length - 2);
  const searchAfter = Math.min(text.length, end + closing.length + 2);
  const extendedText = text.substring(searchBefore, searchAfter);
  const selectionInExtended = start - searchBefore;

  const beforeSelection = extendedText.substring(0, selectionInExtended);
  const afterSelection = extendedText.substring(
    selectionInExtended + selectedText.length
  );

  const markerAtEnd = beforeSelection.endsWith(marker);
  const closingAtStart = afterSelection.startsWith(closing);

  if (markerAtEnd && closingAtStart) {
    return {
      isFormatted: true,
      actualStart: start - marker.length,
      actualEnd: end + closing.length,
    };
  }

  return { isFormatted: false };
};

/**
 * Checks if cursor is inside formatted text
 */
export const checkCursorInsideFormatted = (
  text: string,
  start: number,
  end: number,
  marker: string,
  closing: string
): { found: boolean; openStart?: number; closeEnd?: number } => {
  const searchRange = 100;
  const beforeStart = Math.max(0, start - searchRange);
  const afterEnd = Math.min(text.length, end + searchRange);
  const context = text.substring(beforeStart, afterEnd);
  const cursorInContext = start - beforeStart;

  const lastOpenIndex = context.lastIndexOf(marker, cursorInContext);
  if (lastOpenIndex === -1) return { found: false };

  const searchAfterOpen = context.substring(lastOpenIndex);
  const closeIndex = searchAfterOpen.indexOf(closing, marker.length);
  if (closeIndex === -1) return { found: false };

  const actualOpenStart = beforeStart + lastOpenIndex;
  const actualOpenEnd = actualOpenStart + marker.length;
  const actualCloseStart = actualOpenStart + closeIndex;
  const actualCloseEnd = actualCloseStart + closing.length;

  if (start >= actualOpenEnd && end <= actualCloseStart) {
    return {
      found: true,
      openStart: actualOpenStart,
      closeEnd: actualCloseEnd,
    };
  }

  return { found: false };
};

/**
 * Handles formatting for selected text
 */
export const handleSelectedTextFormatting = (
  text: string,
  start: number,
  end: number,
  selectedText: string,
  marker: string,
  closing: string,
  isFormatted: boolean,
  markersAroundResult?: {
    isFormatted: boolean;
    actualStart?: number;
    actualEnd?: number;
  }
): {
  newText: string;
  newStart: number;
  newEnd: number;
} | null => {
  // Check if markers are outside the selection
  if (
    !isFormatted &&
    markersAroundResult?.isFormatted &&
    markersAroundResult.actualStart !== undefined
  ) {
    const textWithoutMarkers = text.substring(
      markersAroundResult.actualStart + marker.length,
      markersAroundResult.actualEnd! - closing.length
    );
    const newText =
      text.substring(0, markersAroundResult.actualStart) +
      textWithoutMarkers +
      text.substring(markersAroundResult.actualEnd!);

    return {
      newText,
      newStart: markersAroundResult.actualStart,
      newEnd: markersAroundResult.actualStart + textWithoutMarkers.length,
    };
  }

  // Apply or remove formatting
  if (isFormatted) {
    const withoutMarkers = removeMarkers(selectedText, marker, closing);
    const newText =
      text.substring(0, start) + withoutMarkers + text.substring(end);
    return {
      newText,
      newStart: start,
      newEnd: start + withoutMarkers.length,
    };
  } else {
    const newText =
      text.substring(0, start) +
      marker +
      selectedText +
      closing +
      text.substring(end);
    return {
      newText,
      newStart: start + marker.length,
      newEnd: start + marker.length + selectedText.length,
    };
  }
};

/**
 * Handles formatting when no text is selected
 */
export const handleEmptySelectionFormatting = (
  text: string,
  start: number,
  end: number,
  marker: string,
  closing: string,
  findWordBoundaries: (
    text: string,
    pos: number
  ) => { start: number; end: number } | null
): {
  newText: string;
  newPos: number;
} | null => {
  // Case 1: Check adjacent markers (e.g., **|**)
  const beforeCursor = text.substring(
    Math.max(0, start - marker.length),
    start
  );
  const afterCursor = text.substring(
    end,
    Math.min(text.length, end + closing.length)
  );

  if (beforeCursor === marker && afterCursor === closing) {
    const newText =
      text.substring(0, start - marker.length) +
      text.substring(end + closing.length);
    return {
      newText,
      newPos: start - marker.length,
    };
  }

  // Case 2: Check if cursor is inside formatted text
  const cursorResult = checkCursorInsideFormatted(
    text,
    start,
    end,
    marker,
    closing
  );
  if (cursorResult.found && cursorResult.openStart !== undefined) {
    const contentBetween = text.substring(
      cursorResult.openStart! + marker.length,
      cursorResult.closeEnd! - closing.length
    );

    if (contentBetween.trim().length > 0) {
      const newText =
        text.substring(0, cursorResult.openStart!) +
        contentBetween +
        text.substring(cursorResult.closeEnd!);
      return {
        newText,
        newPos: cursorResult.openStart! + contentBetween.length,
      };
    }
  }

  // Case 3: Check if cursor is on a word
  const wordBounds = findWordBoundaries(text, start);
  if (wordBounds) {
    const { start: wordStart, end: wordEnd } = wordBounds;
    const word = text.substring(wordStart, wordEnd);

    // Check if word is formatted
    const searchBefore = Math.max(0, wordStart - marker.length);
    const searchAfter = Math.min(text.length, wordEnd + closing.length);
    const wordContext = text.substring(searchBefore, searchAfter);
    const wordInContext = wordStart - searchBefore;

    const markerBefore = wordContext.substring(
      Math.max(0, wordInContext - marker.length),
      wordInContext
    );
    const markerAfter = wordContext.substring(
      wordInContext + word.length,
      Math.min(wordContext.length, wordInContext + word.length + closing.length)
    );

    const isWordFormatted = markerBefore === marker && markerAfter === closing;

    if (isWordFormatted) {
      const newText =
        text.substring(0, wordStart - marker.length) +
        word +
        text.substring(wordEnd + closing.length);
      return {
        newText,
        newPos: wordStart - marker.length + word.length,
      };
    } else {
      const newText =
        text.substring(0, wordStart) +
        marker +
        word +
        closing +
        text.substring(wordEnd);
      return {
        newText,
        newPos: wordStart + marker.length + word.length + closing.length,
      };
    }
  }

  // Case 4: Default - add formatting markers
  const newText =
    text.substring(0, start) + marker + closing + text.substring(end);
  return {
    newText,
    newPos: start + marker.length,
  };
};
